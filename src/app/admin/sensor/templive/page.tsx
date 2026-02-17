'use client';

import { useEffect, useMemo, useState } from 'react';
import { getLiveSensorDataWithAssetName } from '@/services/sensordata';
import { SensorWithName } from '@/types/sensorWithName';
import SensorGauge from '@/components/SensorGauge';
import CustomLoader from '@/components/CustomerLoader';
import { AdminAuth } from '@/hooks/AdminAuth';
export default function TemperatureDashboard() {
  
AdminAuth();
  const [data, setData] = useState<SensorWithName[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    getLiveSensorDataWithAssetName()
      .then(res => {
        if (mounted) setData(res || []);
      })
      .catch(() => {
        if (mounted) setData([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // ✅ filter ONCE only
  const validSensors = useMemo(
    () => data.filter(d => d.sid !== 'UNKNOWN'),
    [data]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-4 md:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
              Live Temperature Data
            </h1>
            <p className="text-gray-600 text-sm md:text-base lg:text-lg">
              Real-time monitoring of all sensor units
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-md w-fit">
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs md:text-sm font-medium text-gray-700">Live</span>
          </div>
        </div>

        {!loading && (
          <div className="bg-white rounded-xl shadow-md p-3 md:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>

              <div>
                <p className="text-xs md:text-sm text-gray-500">Total Sensors</p>
                <p className="text-lg md:text-xl font-bold text-gray-900">
                  {validSensors.length}
                </p>
              </div>
            </div>

            <div className="text-xs md:text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <CustomLoader />
          </div>
        ) : validSensors.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 md:h-96 bg-white rounded-2xl shadow-lg p-6">
            <p className="text-xl md:text-2xl font-semibold text-gray-700">
              No Data Available
            </p>
            <p className="text-sm md:text-base text-gray-500">
              No sensor data found at the moment
            </p>
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
    </div>
  );
}
