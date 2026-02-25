'use client';

import { memo } from 'react';

interface Props {
  temperature: number;
  humidity: number;
  sid: string;
  name: string;
}

const SensorGauge = ({ temperature, humidity, sid, name }: Props) => {
  const humidityPercentage = Math.min(Math.max(humidity, 0), 100);

  const circumference = 2 * Math.PI * 70;
  const arcLength = (humidityPercentage / 100) * 270;
  const strokeDasharray = `${(arcLength / 360) * circumference} ${circumference}`;

  return (
    <div className="bg-white rounded-xl p-6 shadow-md w-full">
      <div className="relative w-full max-w-[240px] h-[240px] mx-auto">
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
          <defs>
            <linearGradient id={sid} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1D4ED8" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#93C5FD" />
            </linearGradient>
          </defs>

          <circle
            cx="100"
            cy="100"
            r="70"
            stroke="#E5E7EB"
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${(270 / 360) * circumference}`}
          />

          <circle
            cx="100"
            cy="100"
            r="70"
            stroke={`url(#${sid})`}
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-gray-900">
            {temperature.toFixed(2)} °C
          </div>
          <div className="h-px w-20 bg-gray-300 my-2" />
          <div className="text-lg text-gray-700">
            {humidity.toFixed(2)}%
          </div>
          <div className="text-sm text-gray-500 mt-1">{sid}</div>
        </div>
      </div>

      <p className="text-center text-blue-600 font-medium mt-4 truncate">
        {name}
      </p>
    </div>
  );
};

export default memo(SensorGauge);