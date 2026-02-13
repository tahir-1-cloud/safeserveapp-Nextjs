'use client';

import { useEffect, useState } from 'react';
import { getLiveSensorDataWithAssetName } from '@/services/sensordata';
import { SensorWithName } from '@/types/sensorWithName';
import SensorGauge from '@/components/SensorGauge';
import CustomLoader from '@/components/CustomerLoader';

export default function TemperatureDashboard() {
  const [data, setData] = useState<SensorWithName[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLiveSensorDataWithAssetName()
      .then(setData)
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-4 md:p-6">
      {/* Header Section */}
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
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs md:text-sm font-medium text-gray-700">Live</span>
          </div>
        </div>
        
        {/* Stats Bar */}
        {!loading && (
          <div className="bg-white rounded-xl shadow-md p-3 md:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Total Sensors</p>
                <p className="text-lg md:text-xl font-bold text-gray-900">
                  {data.filter(d => d.sid !== 'UNKNOWN').length}
                </p>
              </div>
            </div>
            <div className="text-xs md:text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
       {loading ? (
        <div className="flex justify-center items-center h-64">
            <CustomLoader />
        </div>
        )  : data.filter(d => d.sid !== 'UNKNOWN').length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 md:h-96 bg-white rounded-2xl shadow-lg p-6">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 md:mb-6">
              <svg className="w-8 h-8 md:w-12 md:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-xl md:text-2xl font-semibold text-gray-700 mb-2">No Data Available</p>
            <p className="text-sm md:text-base text-gray-500">No sensor data found at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data
              .filter(d => d.sid !== 'UNKNOWN')
              .map(item => (
                <div key={item.sid} className="transform transition-all duration-300 hover:scale-105">
                  <SensorGauge
                    temperature={item.tmp}
                    humidity={item.hum}
                    sid={item.sid}
                    name={item.fridgeName}
                  />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}