// Enum status mutu ikan dan zona bahaya
export enum FishQualityGrade {
  GRADE_A = 'GRADE_A', // Suhu stabil < 2°C, kualitas ekspor/premium
  GRADE_B = 'GRADE_B', // Fluktuasi 2°C - 4.4°C, layak konsumsi lokal
  GRADE_C = 'GRADE_C', // Paparan suhu > 4.4°C singkat
  REJECTED = 'REJECTED' // Melewati batas aman histamin / es cair total
}

export enum TripStatus {
  PLANNED = 'PLANNED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}
