'use client';

import { useEffect, useState, useTransition, useRef } from 'react';
import { getLiveSensorDataWithAssetName, getTempManualLimit } from '@/services/sensordata';
import { SensorWithName } from '@/types/sensorWithName';
import { ManulLimitModel } from '@/types/sensordto';
import SensorGauge from '@/components/SensorGauge';
import CustomLoader from '@/components/CustomerLoader';
import { AdminAuth } from '@/hooks/AdminAuth';
import axiosInstance from '@/services/axiosInstance';

type AlertType = {
  sid: string;
  temp: number;
  type: 'upper' | 'lower';
};

export default function TemperatureDashboard() {
 const {user}= AdminAuth();

  const [data, setData] = useState<SensorWithName[]>([]);
  const [limits, setLimits] = useState<ManulLimitModel[]>([]);
  const [loading, setLoading] = useState(true);

  const [alertQueue, setAlertQueue] = useState<AlertType[]>([]);
  const [currentAlert, setCurrentAlert] = useState<AlertType | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [, startTransition] = useTransition();

  // 🔹 Fetch function (used for auto refresh)
  const fetchData = async () => {
    try {
      const [sensorData, limitData] = await Promise.all([
        getLiveSensorDataWithAssetName(),
        getTempManualLimit()
      ]);

      startTransition(() => {
        setData(sensorData || []);
        setLimits(limitData || []);
        setLoading(false);
      });
    } catch {
      setLoading(false);
    }
  };

  // 🔹 Initial load
  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Auto refresh every 1 minute
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 240000); // 1 minute

    return () => clearInterval(interval);
  }, []);

  // 🔹 Detect crossed sensors
  useEffect(() => {
    if (!data.length || !limits.length) return;

    const crossed: AlertType[] = [];

    for (const sensor of data) {
      const limit = limits.find(l => l.sid === sensor.sid);
      if (!limit) continue;

      const lower = parseFloat(limit.lowerLimit);
      const upper = parseFloat(limit.upperLimit);
      const temp = sensor.tmp;

      if (temp > upper) {
        crossed.push({ sid: sensor.sid, temp, type: 'upper' });
      } else if (temp < lower) {
        crossed.push({ sid: sensor.sid, temp, type: 'lower' });
      }
    }

    if (crossed.length > 0) {
      setAlertQueue(crossed);
      setCurrentAlert(crossed[0]);

      // 🔔 Play sound

      // 📧 Send email to admin (backend API required)
     axiosInstance.post('/TemperatureUnit/SendAlertEmail', {
        to: user?.email,   // ✅ Dynamic admin email
        alerts: crossed
      });
    }
  }, [data, limits]);

  const handleCloseAlert = () => {
    const updatedQueue = alertQueue.slice(1);
    setAlertQueue(updatedQueue);
    setCurrentAlert(updatedQueue[0] || null);
  };

  const validSensors = data.filter(d => d.sid !== 'UNKNOWN');

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-4 md:p-6">

    {/* ================= HEADER SECTION ================= */}
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 border border-gray-100">
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            🌡 Temperature Live Data
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time monitoring of connected sensors
          </p>
        </div>

        {/* Info Section */}
        <div className="flex flex-col md:items-end text-sm text-gray-600">
          <div className="bg-blue-50 px-4 py-2 rounded-lg mb-2 md:mb-1">
            <span className="font-medium text-gray-700">Last Updated:</span>{" "}
            {new Date().toLocaleString()}
          </div>

          <div className="bg-green-50 px-4 py-2 rounded-lg">
            <span className="font-medium text-gray-700">Connected Sensors:</span>{" "}
            {data.filter(d => d.sid !== 'UNKNOWN').length}
          </div>
        </div>

      </div>
    </div>
    {/* ================= END HEADER ================= */}



    {/* 🔴 DASHBOARD ALERT BANNER */}
    {alertQueue.length > 0 && (
      <div className="bg-red-600 text-white text-center py-2 font-semibold rounded mb-4 animate-pulse">
        ⚠ Temperature Limit Crossed on {alertQueue.length} Sensor(s)
      </div>
    )}

    {/* ALERT MODAL */}
    {currentAlert && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 shadow-xl w-[90%] max-w-sm text-center">
          <h2 className="text-lg font-bold text-red-600 mb-2">
            Temperature Alert 🚨
          </h2>

          <p className="text-gray-700 text-sm mb-4">
            Sensor <span className="font-semibold">{currentAlert.sid}</span> temperature{" "}
            <span className="font-bold">{currentAlert.temp.toFixed(2)}°C</span>{" "}
            has crossed the {currentAlert.type} limit.
          </p>

          <button
            onClick={handleCloseAlert}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    )}

    {/* CONTENT */}
    {loading ? (
      <div className="flex justify-center items-center h-64">
        <CustomLoader />
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {validSensors.map(item => (
          <SensorGauge
            key={item.sid}
            temperature={item.tmp}
            humidity={item.hum}
            sid={item.sid}
            name={item.fridgeName}
          />
        ))}
      </div>
    )}
  </div>
);
}