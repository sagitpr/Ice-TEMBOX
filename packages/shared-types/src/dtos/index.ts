import { SensorLog } from '../models';

export interface BleSyncPayloadDto {
  tripId: string;
  deviceId: string;
  logs: Array<{
    ts: number;
    temp: number;
    vbat?: number;
  }>;
}

export interface UploadBatchLogsRequestDto {
  tripId: string;
  logs: Array<Omit<SensorLog, 'id'>>;
}

export interface ColdChainCertificateResponseDto {
  tripId: string;
  boatName: string;
  landingTime: string;
  qualityGrade: string;
  qrCodeUrl: string;
  pdfCertificateUrl: string;
}
