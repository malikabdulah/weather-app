import React from 'react';

export default function WeatherDetailsGrid({ data }) {
  if (!data || !data.main || !data.wind) return null;

  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const pressure = data.main.pressure;
  const visibility = data.visibility ? (data.visibility / 1000).toFixed(1) : 'N/A';

  const details = [
    { label: 'Humidity', value: `${humidity}%` },
    { label: 'Wind Speed', value: `${windSpeed} km/h` },
    { label: 'Pressure', value: `${pressure} hPa` },
    { label: 'Visibility', value: `${visibility} km` },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      {details.map((item, index) => (
        <div 
          key={index} 
          className="bg-white/20 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center shadow-lg border border-white/30 text-white"
        >
          <p className="text-sm font-medium uppercase tracking-wide opacity-80 mb-1">
            {item.label}
          </p>
          <p className="text-xl font-bold">{item.value}</p>
        </div>
      ))}
    </div>
  );
}