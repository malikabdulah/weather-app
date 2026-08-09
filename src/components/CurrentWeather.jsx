import React from 'react';

export default function CurrentWeather({ data }) {
  if (!data || !data.main) return null;

  const temperature = Math.round((data.main.temp-32)/(9/5));
  const feelsLike = Math.round((data.main.feels_like-32)/(9/5));
  const condition = data.weather && data.weather[0] ? data.weather[0].main : 'Unknown';
  const description = data.weather && data.weather[0] ? data.weather[0].description : '';

  return (
    <div className="flex flex-col items-center justify-center text-white py-10 w-full">
      <h2 className="text-4xl md:text-5xl font-bold mb-2 text-center drop-shadow-md">
        {data.name}
      </h2>
      <p className="text-xl capitalize mb-6 drop-shadow-md">{description}</p>
      
      <div className="flex flex-col items-center">
        <h1 className="text-7xl md:text-8xl font-extrabold drop-shadow-lg mb-2 ml-2">
          {temperature}°
        </h1>
        <p className="text-lg md:text-xl font-medium drop-shadow-md">
          Feels like {feelsLike}°C
        </p>
      </div>
    </div>
  );
}