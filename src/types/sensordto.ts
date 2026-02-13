export interface SensorData {
  sid: string;
  receiveDate: string; // ISO date string
  tmp: number;
  hum: number;
  voltage: number;
}

export interface SensorAsset {
  sid: string;
  fridgeName: string;
}
