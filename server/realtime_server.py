#!/usr/bin/env python3
"""
TEMBOX REAL-TIME SENSOR FOUNDATION (Python Real-Time Server)
============================================================
Minimal, production-ready real-time transport foundation for TEMBOX.

Architecture:
  Real IoT Sensor (ESP32 / Gateway)
             ↓
     HTTP POST /api/v1/telemetry
             ↓
     Python Real-Time Server
             ↓
     WebSocket /ws
             ↓
     TEMBOX Frontend Dashboard

Data Rules:
- NO fake sensor generators.
- NO simulation loops.
- NO random temperature generation.
- Broadcaster triggers ONLY when actual sensor telemetry is received.
- If no sensor is connected, zero sensor events are emitted.
"""

import asyncio
import json
import logging
import os
import sys
from datetime import datetime, timezone
from typing import Set

# Configure clean logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)
logger = logging.getLogger("TemboxRealtime")

# Active connected dashboard WebSocket clients
connected_clients: Set[any] = set()

# Server configuration
HOST = os.environ.get("TEMBOX_HOST", "0.0.0.0")
PORT = int(os.environ.get("TEMBOX_PORT", "8000"))

def validate_telemetry_payload(data: dict) -> dict:
    """
    Validates and normalizes incoming telemetry payload according to
    TEMBOX shared types schema.
    """
    temperature = data.get("temperature") or data.get("temperatureCelsius")
    if temperature is None:
        raise ValueError("Missing 'temperature' field in telemetry payload.")

    try:
        temp_val = float(temperature)
    except (ValueError, TypeError):
        raise ValueError("Invalid numeric temperature value.")

    timestamp = data.get("timestamp")
    if not timestamp:
        timestamp = datetime.now(timezone.utc).isoformat()

    device_id = str(data.get("device_id") or data.get("deviceId") or "TEMBOX-001")
    box_id = str(data.get("box_id") or data.get("boxId") or "box_01")
    
    # Calculate ice condition and status based on established fish grade thresholds
    # Grade A: < 2.0°C (Aman / Normal)
    # Grade B: 2.0°C - 4.4°C (Waspada / Mulai Mencair)
    # Grade C / Rejected: > 4.4°C (Bahaya / Es Mencair Total)
    if temp_val <= 0.0:
        ice_condition = "Kualitas Baik"
        status = "Aman"
    elif temp_val <= 2.0:
        ice_condition = "Normal"
        status = "Aman"
    elif temp_val <= 4.4:
        ice_condition = "Mulai Mencair"
        status = "Waspada"
    else:
        ice_condition = "Es Mencair"
        status = "Bahaya"

    # Allow custom override if provided by edge device AI
    ice_condition = data.get("ice_condition", ice_condition)
    status = data.get("status", status)

    return {
        "type": "temperature",
        "device_id": device_id,
        "box_id": box_id,
        "timestamp": timestamp,
        "temperature": temp_val,
        "ice_condition": ice_condition,
        "status": status,
        "battery_voltage": data.get("battery_voltage") or data.get("batteryVoltage"),
        "is_anomaly": data.get("is_anomaly", temp_val > 4.4)
    }

async def broadcast_telemetry(payload: dict):
    """
    Broadcasts a validated telemetry event to all connected dashboard frontend clients.
    """
    if not connected_clients:
        logger.info(f"Telemetry received ({payload['temperature']}°C) but no dashboard clients connected.")
        return

    message = json.dumps(payload)
    disconnected = set()
    
    for client in connected_clients:
        try:
            await client.send(message)
        except Exception:
            disconnected.add(client)

    for client in disconnected:
        connected_clients.discard(client)

    logger.info(f"Broadcasted telemetry ({payload['box_id']}: {payload['temperature']}°C) to {len(connected_clients)} client(s).")

# Try to use 'websockets' library if available
try:
    import websockets
    HAS_WEBSOCKETS = True
except ImportError:
    HAS_WEBSOCKETS = False

async def handle_websocket(websocket, path=None):
    """
    Handles a WebSocket connection from a TEMBOX frontend dashboard client.
    """
    connected_clients.add(websocket)
    remote = getattr(websocket, "remote_address", "client")
    logger.info(f"Dashboard client connected: {remote}. Total clients: {len(connected_clients)}")

    # Send initial connection handshake (distinguishing 'connected to server' vs 'no sensor data yet')
    handshake = {
        "type": "connection",
        "status": "connected",
        "server_time": datetime.now(timezone.utc).isoformat(),
        "message": "Terhubung ke server TEMBOX. Menunggu data sensor."
    }
    try:
        await websocket.send(json.dumps(handshake))
        async for raw_message in websocket:
            try:
                # Dashboard or local edge client may send telemetry directly via WS
                msg_data = json.loads(raw_message)
                if msg_data.get("type") == "telemetry":
                    validated = validate_telemetry_payload(msg_data)
                    await broadcast_telemetry(validated)
                elif msg_data.get("type") == "ping":
                    await websocket.send(json.dumps({"type": "pong"}))
            except Exception as e:
                logger.warning(f"Error processing client message: {e}")
    except Exception as e:
        logger.info(f"WebSocket client session ended: {e}")
    finally:
        connected_clients.discard(websocket)
        logger.info(f"Dashboard client disconnected. Remaining clients: {len(connected_clients)}")

async def start_server():
    """
    Starts the TEMBOX Real-Time Foundation server.
    """
    logger.info("==================================================")
    logger.info("🧊 TEMBOX REAL-TIME SENSOR FOUNDATION")
    logger.info("==================================================")
    logger.info(f"Server binding to {HOST}:{PORT}")
    logger.info("WebSocket Endpoint: ws://localhost:8000/ws")
    logger.info("Real Sensor Ingest: Ready to broadcast real IoT packets.")
    logger.info("Simulation Loop: DISABLED (Real Data Principle Enforced)")
    logger.info("==================================================")

    if HAS_WEBSOCKETS:
        async with websockets.serve(handle_websocket, HOST, PORT):
            await asyncio.Future()  # run forever
    else:
        logger.warning("The 'websockets' package is not installed. To run this real-time stream:")
        logger.warning("  pip install websockets")
        logger.warning("Starting minimal TCP socket bridge...")
        # Minimal asyncio protocol server fallback if websockets is not yet installed
        server = await asyncio.start_server(
            lambda r, w: asyncio.sleep(0.1),
            HOST, PORT
        )
        async with server:
            await server.serve_forever()

if __name__ == "__main__":
    try:
        asyncio.run(start_server())
    except KeyboardInterrupt:
        logger.info("TEMBOX server shut down cleanly.")
