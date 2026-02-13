import { SensorData } from './sensordto';

export interface SensorWithName extends SensorData {
  fridgeName: string;
}
