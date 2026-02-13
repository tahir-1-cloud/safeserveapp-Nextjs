import axios from 'axios';
import axiosInstance from '@/services/axiosInstance';
import { SensorData } from '@/types/sensordto';
import { SensorAsset } from '@/types/sensordto';
import { SensorWithName } from '@/types/sensorWithName';
import { toast } from "sonner";


export const getLiveSensorDataWithAssetName =
  async (): Promise<SensorWithName[]> => {
    try {
      /* 1️⃣ Get live sensor data (external API) */
      const sensorResponse = await axios.get<SensorData[]>(
        'https://api.cloudsensor.safeserveapp.com/api/Sensordata/latest-Sensor-data');

      /* 2️⃣ Get sensor → asset names (base URL) */
      const assetResponse = await axiosInstance.get<SensorAsset[]>(
        '/TemperatureUnit/GetSensorDataWithAssetName');

      const sensors = sensorResponse.data;
      const assets = assetResponse.data;

      /* 3️⃣ Merge (like ViewBag logic but cleaner) */
      const mergedData: SensorWithName[] = sensors.map(sensor => {
        const asset = assets.find(a => a.sid === sensor.sid);

        return {
          ...sensor,
          fridgeName: asset?.fridgeName ?? 'Unknown',
        };
      });

      return mergedData;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.message);
      } else {
        toast.error('Unexpected error occurred');
      }
      throw error;
    }
  };
