/**
 * TEMBOX REAL-TIME TELEMETRY SERVICE
 * ===================================
 * Manages WebSocket transport, connection states, and telemetry data store.
 * 
 * STRICT REAL DATA ENFORCEMENT:
 * - NO dummy data.
 * - NO fake temperature values (-1.5, -2.0, 3.1, 0.2).
 * - NO fake statistics or chart points.
 * - NO Math.random() or setInterval() sensor simulation.
 * - When no data is received from backend/sensor, state remains honest empty.
 */

export const ConnectionState = {
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
  ERROR: 'ERROR'
};

class TemboxRealtimeService {
  constructor() {
    this.ws = null;
    this.wsUrl = localStorage.getItem('tembox_ws_url') || 'ws://localhost:8000/ws';
    this.connectionState = ConnectionState.DISCONNECTED;
    this.reconnectTimer = null;
    this.listeners = new Set();

    // Data Store - Completely empty initially. All values populate ONLY from real stream.
    this.store = {
      hasReceivedData: false,
      serverConnected: false,
      lastPacketTime: null,
      packetsCount: 0,
      
      // Overview values (null until received)
      currentTemperature: null,
      iceCondition: null,
      systemStatus: null,
      lastUpdateTimestamp: null,

      // Multi-box status (null until received)
      boxes: {
        box_01: null,
        box_02: null,
        box_03: null,
        box_04: null
      },

      // Sensor time-series history (array populated ONLY by real telemetry events)
      temperatureHistory: [],

      // Notification records (populated ONLY by real events)
      notifications: [],

      // Activity logs (populated ONLY by real events)
      activityLogs: [],

      // Device information
      device: {
        id: null,
        status: 'Belum terhubung',
        ip: null
      }
    };
  }

  /**
   * Subscribe to real-time store updates
   */
  subscribe(callback) {
    this.listeners.add(callback);
    // Trigger initial state call
    callback(this.getState());
    return () => this.listeners.delete(callback);
  }

  notify() {
    const state = this.getState();
    this.listeners.forEach(cb => {
      try {
        cb(state);
      } catch (err) {
        console.error('Error in telemetry listener:', err);
      }
    });
  }

  getState() {
    return {
      connectionState: this.connectionState,
      store: this.store,
      stats: this.calculateRealStats()
    };
  }

  /**
   * Derive statistics strictly from real recorded history.
   * If history is empty, all statistics remain null.
   */
  calculateRealStats() {
    const history = this.store.temperatureHistory;
    if (!history || history.length === 0) {
      return {
        current: null,
        lowest: null,
        highest: null,
        average: null
      };
    }

    const temps = history.map(item => item.temperature).filter(t => typeof t === 'number' && !isNaN(t));
    if (temps.length === 0) {
      return { current: null, lowest: null, highest: null, average: null };
    }

    const current = temps[temps.length - 1];
    const lowest = Math.min(...temps);
    const highest = Math.max(...temps);
    const sum = temps.reduce((acc, val) => acc + val, 0);
    const average = (sum / temps.length).toFixed(1);

    return { current, lowest, highest, average };
  }

  /**
   * Initialize real-time WebSocket connection
   */
  connect(customUrl) {
    if (customUrl) {
      this.wsUrl = customUrl;
      localStorage.setItem('tembox_ws_url', customUrl);
    }

    if (this.ws) {
      try {
        this.ws.close();
      } catch (e) {}
    }

    this.connectionState = ConnectionState.CONNECTING;
    this.store.serverConnected = false;
    this.notify();

    try {
      this.ws = new WebSocket(this.wsUrl);

      this.ws.onopen = () => {
        this.connectionState = ConnectionState.CONNECTED;
        this.store.serverConnected = true;
        this.notify();
        console.log(`[TEMBOX] Terhubung ke real-time stream di ${this.wsUrl}`);
      };

      this.ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          this.handleIncomingPayload(payload);
        } catch (err) {
          console.warn('[TEMBOX] Non-JSON payload received:', event.data);
        }
      };

      this.ws.onclose = () => {
        this.connectionState = ConnectionState.DISCONNECTED;
        this.store.serverConnected = false;
        this.notify();
        this.scheduleReconnect();
      };

      this.ws.onerror = (err) => {
        this.connectionState = ConnectionState.ERROR;
        this.notify();
      };
    } catch (err) {
      console.warn('[TEMBOX] WebSocket connection failed:', err);
      this.connectionState = ConnectionState.DISCONNECTED;
      this.notify();
      this.scheduleReconnect();
    }
  }

  scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      if (this.connectionState !== ConnectionState.CONNECTED) {
        this.connect();
      }
    }, 6000);
  }

  /**
   * Process genuine real telemetry events
   */
  handleIncomingPayload(payload) {
    if (!payload || typeof payload !== 'object') return;

    this.store.packetsCount += 1;
    this.store.lastPacketTime = new Date().toLocaleTimeString();

    // Check payload type
    if (payload.type === 'connection') {
      // Server handshake info (no sensor data yet)
      this.notify();
      return;
    }

    if (payload.type === 'temperature' || payload.temperature !== undefined || payload.temperatureCelsius !== undefined) {
      const tempVal = Number(payload.temperature ?? payload.temperatureCelsius);
      if (isNaN(tempVal)) return;

      this.store.hasReceivedData = true;
      this.store.currentTemperature = tempVal;
      this.store.iceCondition = payload.ice_condition || (tempVal <= 2.0 ? 'Normal' : tempVal <= 4.4 ? 'Mulai Mencair' : 'Es Mencair');
      this.store.systemStatus = payload.status || (tempVal <= 2.0 ? 'Aman' : 'Waspada');
      this.store.lastUpdateTimestamp = payload.timestamp || new Date().toISOString();

      if (payload.device_id) {
        this.store.device.id = payload.device_id;
        this.store.device.status = 'Online';
      }

      // Update specific box if specified
      const boxId = payload.box_id || 'box_01';
      if (this.store.boxes.hasOwnProperty(boxId)) {
        this.store.boxes[boxId] = {
          temperature: tempVal,
          iceCondition: this.store.iceCondition,
          status: this.store.systemStatus,
          timestamp: this.store.lastUpdateTimestamp
        };
      }

      // Append real data point to chart time-series history (cap at last 50 points)
      this.store.temperatureHistory.push({
        box_id: boxId,
        timestamp: this.store.lastUpdateTimestamp,
        temperature: tempVal
      });
      if (this.store.temperatureHistory.length > 50) {
        this.store.temperatureHistory.shift();
      }

      // Record Activity Log
      this.store.activityLogs.unshift({
        waktu: new Date(this.store.lastUpdateTimestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        suhu: `${tempVal > 0 ? '+' : ''}${tempVal.toFixed(1)}°C`,
        kondisiEs: this.store.iceCondition,
        status: this.store.systemStatus,
        aktivitas: `Pembaruan data telemetri ${boxId}`
      });
      if (this.store.activityLogs.length > 30) {
        this.store.activityLogs.pop();
      }

      // Check if alert or notification should be recorded from real anomaly
      if (payload.is_anomaly || tempVal > 4.4 || payload.type === 'notification') {
        this.store.notifications.unshift({
          id: 'notif_' + Date.now(),
          type: tempVal > 4.4 ? 'danger' : 'warning',
          title: tempVal > 4.4 ? 'Suhu Melebihi Batas Aman!' : 'Peringatan Fluktuasi Suhu',
          message: `Suhu tercatat ${tempVal.toFixed(1)}°C pada ${boxId}. Periksa palka penyimpanan.`,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        });
      }

      this.notify();
    }
  }

  /**
   * For hardware engineer debugging / testing with actual device:
   * Dispatches a verified real payload from manual ingest without fake loops.
   */
  ingestRealPayload(payload) {
    this.handleIncomingPayload(payload);
  }
}

// Global Singleton Instance
export const temboxRealtime = new TemboxRealtimeService();
