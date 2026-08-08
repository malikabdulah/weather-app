import React, { useState, useEffect } from 'react';
import { fetchWeatherByCity } from './api/weatherapi';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import WeatherDetailsGrid from './components/WeatherDetailsGrid';
import Footer from './components/Footer';

//background function
const getVisualTheme = (apiResponse) => {
  //fallback if no data yet so assigning default
  if (!apiResponse || !apiResponse.weather) {
    return {
      imgUrl: 'https://i.pinimg.com/1200x/5b/06/c3/5b06c3bbf190e8f6851c86b44163f160.jpg',
      baseColor: 'bg-blue-500',
      blendGradient: 'from-transparent via-blue-500/80 to-blue-500'
    };
  }
  
  //loading diff states for bg
  const weatherState = apiResponse.weather[0].main.toLowerCase();
  const timeNow = apiResponse.dt;
  const sunUp = apiResponse.sys.sunrise;
  const sunDown = apiResponse.sys.sunset;
  const isDaytime = timeNow > sunUp && timeNow < sunDown;

  if (!isDaytime&&(weatherState.includes('clear') || weatherState.includes('cloud'))) {
    return {
      imgUrl: 'https://i.pinimg.com/1200x/3d/79/4a/3d794a32d329d1ca6911b13a224e87d6.jpg', 
      baseColor: 'bg-gray-900',
      blendGradient: 'from-transparent via-gray-900/80 to-gray-900'
    };
  }

  if (weatherState.includes('clear')) {
    return {
      imgUrl: 'https://i.pinimg.com/1200x/5b/06/c3/5b06c3bbf190e8f6851c86b44163f160.jpg',
      baseColor: 'bg-blue-400',
      blendGradient: 'from-transparent via-blue-400/80 to-blue-400'
    };
  }
  if (weatherState.includes('cloud')) {
    return {
      imgUrl: 'https://i.pinimg.com/originals/5a/47/89/5a4789bb5becfc1666196fc98b2f5111.png',
      baseColor: 'bg-gray-500',
      blendGradient: 'from-transparent via-gray-500/80 to-gray-500'
    };
  }
  if (weatherState.includes('rain') || weatherState.includes('drizzle')) {
    return {
      imgUrl: 'https://i.pinimg.com/736x/22/4a/0c/224a0c422b4374ceb5bd818d597c2740.jpg',
      //https://i.pinimg.com/1200x/3c/71/53/3c7153685d5265eaebcc98e97fc0e99d.jpg
      baseColor: 'bg-slate-700',
      blendGradient: 'from-transparent via-slate-700/80 to-slate-700'
    };
  }
  if (weatherState.includes('snow')) {
    return {
      imgUrl: 'https://i.pinimg.com/1200x/28/8d/41/288d4197231ededb63363f591d0dc199.jpg',
      baseColor: 'bg-gray-200',
      blendGradient: 'from-transparent via-gray-200/80 to-gray-200'
    };
  }
  if (weatherState.includes('thunderstorm')) {
    return {
      imgUrl: 'https://i.pinimg.com/736x/75/dd/9b/75dd9b337b24dc03101d970365b270fa.jpg',
      baseColor: 'bg-purple-900',
      blendGradient: 'from-transparent via-purple-900/80 to-purple-900'
    };
  }
  
  //default daytime fallback
  return {
    imgUrl: 'https://i.pinimg.com/1200x/5b/06/c3/5b06c3bbf190e8f6851c86b44163f160.jpg',
    baseColor: 'bg-blue-500',
    blendGradient: 'from-transparent via-blue-500/80 to-blue-500'
  };
};

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [themeParams, setThemeParams] = useState(getVisualTheme(null));

  const defaultCity = 'london';

 const loadWeather = async (cityName) => {
    setLoading(true);
    setError(null);
    
    const cacheKey = `weather_${cityName.toLowerCase()}`;
    const cachedData = localStorage.getItem(cacheKey);

    //cache data (so i dont exhaust my api)
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      const now = new Date().getTime();
      
      //using cache data if its not that old (3hrs)
      if (now - parsedData.timestamp < 10800000) {
        setWeatherData(parsedData.data);
    
        setThemeParams(getVisualTheme(parsedData.data)); 
        
        setLoading(false);
        return;
      }
    }

    //getting the live data from api call
    try {
      //fetching from api
      const data = await fetchWeatherByCity(cityName); 
      
      const cacheObject = {
        timestamp: new Date().getTime(),//marking the time I get data to use it for cache later
        data: data
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheObject));
      
      setWeatherData(data);
      
      setThemeParams(getVisualTheme(data)); 
      
    } catch (err) {
      setError(`Could not find weather data for "${cityName}".`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(defaultCity);
  }, []);
  return (
   <div className={`min-h-screen flex flex-col relative transition-colors duration-700 ${themeParams.baseColor} px-4 py-8 overflow-hidden`}>
    {/* Background Image is load here and locked to screen width */}
      <div 
        className="absolute inset-0 z-0 bg-top bg-no-repeat transition-all duration-700"
        style={{ 
          backgroundImage: `url('${themeParams.imgUrl}')`,
          backgroundSize: '100% auto' 
        }}
      />
      
      {/* kinda layer 2 which is on top of our bg-image and blends into solid colour as you get to the bottom */}
      <div 
        className={`absolute inset-0 z-1 bg-linear-to-b ${themeParams.blendGradient} transition-colors duration-700 pointer-events-none`} 
      />
      
      {/* The CONTENT of my app */}
      <div className="w-full max-w-4xl mx-auto grow flex flex-col relative z-10"><SearchBar onSearch={loadWeather} />

        {loading && (
          <div className="grow flex items-center justify-center">
            <p className="text-2xl text-white font-medium animate-pulse">Loading weather data...</p>
          </div>
        )}

        {error && (
          <div className="grow flex items-center justify-center">
            <div className="bg-red-500/20 backdrop-blur-md text-white p-6 rounded-xl border border-red-500/50">
              <p className="text-xl text-center">{error}</p>
            </div>
          </div>
        )}

        {weatherData && !loading && !error && (
          <div className="grow flex flex-col items-center mt-8 w-full animate-fade-in">
            <CurrentWeather data={weatherData} />
            <HourlyForecast data={weatherData} />
            <WeatherDetailsGrid data={weatherData} />
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
}