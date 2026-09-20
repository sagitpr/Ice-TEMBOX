/**
 * Script simulasi injeksi data log suhu palka kapal ke server
 */

console.log('Mengirim simulasi data telemetri suhu palka kapal...');

const mockData = {
  tripId: 'TRIP-SAMPLE-001',
  timestamp: new Date().toISOString(),
  temperatureCelsius: 1.2,
  batteryVoltage: 3.85
};

console.log('Sample telemetry payload:', JSON.stringify(mockData, null, 2));
