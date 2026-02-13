'use client';

interface Props {
  temperature: number;
  humidity: number;
  sid: string;
  name: string;
}

export default function SensorGauge({
  temperature,
  humidity,
  sid,
  name,
}: Props) {
  const humidityPercentage = Math.min(Math.max(humidity, 0), 100);
  const arcLength = (humidityPercentage / 100) * 270;
  const circumference = 2 * Math.PI * 70;
  const strokeDasharray = `${(arcLength / 360) * circumference} ${circumference}`;

  return (
    <div className="bg-white rounded-xl p-6 shadow-md w-full">
      <div className="relative w-full max-w-[240px] h-[240px] mx-auto">
        <svg width="100%" height="100%" viewBox="0 0 200 200" className="transform -rotate-90">
          <defs>
            <linearGradient id={`gradient-${sid}`} x1="0%" y1="0%" x2="100%" y2="0%">
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
            strokeDasharray={`${(270 / 360) * circumference} ${circumference}`}
          />

          <circle
            cx="100"
            cy="100"
            r="70"
            stroke={`url(#gradient-${sid})`}
            strokeWidth="20"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            className="transition-all duration-500"
          />

          {Array.from({ length: 20 }).map((_, i) => {
            const angle = -135 + (i * 270) / 19;
            const radians = (angle * Math.PI) / 180;
            const x1 = 100 + 85 * Math.cos(radians);
            const y1 = 100 + 85 * Math.sin(radians);
            const x2 = 100 + 90 * Math.cos(radians);
            const y2 = 100 + 90 * Math.sin(radians);

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#D1D5DB"
                strokeWidth="2"
                transform={`rotate(90 100 100)`}
              />
            );
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-gray-900">
            {temperature.toFixed(2)} °C
          </div>
          <div className="h-px w-20 bg-gray-300 my-2"></div>
          <div className="flex items-center gap-2 text-gray-700">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
            </svg>
            <span className="text-lg">{humidity.toFixed(2)}%</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-gray-600 text-sm">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m0 6l4.2 4.2m6-5.2h-6m-6 0H1m13.2-5.2l-4.2 4.2m0 6l4.2 4.2"/>
            </svg>
            <span>{sid}</span>
          </div>
        </div>
      </div>

      <p className="text-center text-blue-600 font-medium mt-4 text-base truncate">
        {name}
      </p>
    </div>
  );
}