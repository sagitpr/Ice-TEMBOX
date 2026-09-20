// Pengirim pesan broadcast peringatan es kritis ke HP nelayan / pembeli / pengepul

export async function sendIceAlertNotification(alert: { recipient: string; message: string }) {
  console.log(`Sending alert to ${alert.recipient}: ${alert.message}`);
}
