import { FishQualityGrade, TripStatus } from '../enums';

export interface User {
  id: string;
  name: string;
  role: 'FISHERMAN' | 'TRADER' | 'TPI_OFFICER' | 'ADMIN';
  phone?: string;
  createdAt: string;
}

export interface Trip {
  id: string;
  boatName: string;
  captainId: string;
  status: TripStatus;
  startedAt: string;
  endedAt?: string;
  initialIceKg?: number;
  finalQualityGrade?: FishQualityGrade;
}

export interface SensorLog {
  id: string;
  tripId: string;
  timestamp: string;
  temperatureCelsius: number;
  batteryVoltage?: number;
  isAnomaly?: boolean;
}
