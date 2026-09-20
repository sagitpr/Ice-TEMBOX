// Antrean pengurai ribuan data log sensor saat kapal sandar di pelabuhan/TPI

export async function processBatchLogsJob(jobData: { tripId: string; rawLogsCount: number }) {
  console.log(`Processing ${jobData.rawLogsCount} logs for trip ${jobData.tripId}`);
}
