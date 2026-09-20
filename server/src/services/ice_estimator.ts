// Estimasi laju peleburan es balok di dalam coolbox/palka kapal

export interface IceEstimateInput {
  initialIceKg: number;
  tripDurationHours: number;
  averageBoxTemperature: number;
}

export function estimateRemainingIceKg(input: IceEstimateInput): number {
  // Laju peleburan es dasar (kg/jam) terpengaruh oleh deviasi suhu palka
  const meltRateBasePerHour = 0.5; // perkiraan konstan
  const tempFactor = Math.max(1, 1 + (input.averageBoxTemperature * 0.1));
  const estimatedMelted = input.tripDurationHours * meltRateBasePerHour * tempFactor;
  return Math.max(0, input.initialIceKg - estimatedMelted);
}
