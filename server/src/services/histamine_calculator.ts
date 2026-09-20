// Logika akumulasi bahaya suhu & penentuan grade mutu ikan berdasarkan paparan suhu

export interface TemperatureExposurePoint {
  timestamp: Date;
  temperatureCelsius: number;
}

export function calculateHistamineRiskIndex(points: TemperatureExposurePoint[]): number {
  // Formula akumulasi hazard suhu di atas ambang kritis (4.4°C)
  let hazardScore = 0;
  for (const p of points) {
    if (p.temperatureCelsius > 4.4) {
      hazardScore += (p.temperatureCelsius - 4.4);
    }
  }
  return hazardScore;
}
