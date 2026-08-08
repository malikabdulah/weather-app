import React from 'react';
import { Sunrise, Sunset, Thermometer, ThermometerSun } from 'lucide-react';

export default function HourlyForecast({ data }) {
  if (!data || !data.sys || !data.main) return null;

  //extracting data from API
  const min = Math.round(data.main.temp_min);
  const max = Math.round(data.main.temp_max);
  const sunriseTime = data.sys.sunrise;
  const sunsetTime = data.sys.sunset;
  const currentTime = data.dt;

  //calculating suns progress and pos
  const totalDaylight = sunsetTime - sunriseTime;
  const timeElapsed = currentTime - sunriseTime;
  let sunProgress = timeElapsed / totalDaylight;
  
  //making sure it stays between 0 and 1
  if (sunProgress < 0) sunProgress = 0;
  if (sunProgress > 1) sunProgress = 1;

  //that semi circle arc
  const radius = 80;
  const cx = 100;
  const cy = 90;
  //calculating angle in radians for suns pos
  const angle = Math.PI - (sunProgress * Math.PI);
  
  //x and y on curve
  const sunX = cx + (radius-5) * Math.cos(angle);
  const sunY = cy - (radius-35) * Math.sin(angle);

  //kinda helper function to format time to readable format
  const formatTime = (t) => {
    return new Date(t * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-6 bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/30 text-white">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Left Side: Sun Path (Dawn to Dusk) */}
        <div className="flex-1 w-full max-w-sm flex flex-col items-center">
          <h3 className="text-lg font-bold mt-5 uppercase tracking-wider opacity-90">Daylight</h3>
          
          <div className="relative w-full max-w-50">
            {/* SVG viewBox ensures the graphic scales responsively */}
            <svg viewBox="0 0 200 110" className="w-full h-auto overflow-hidden">
              
              {/* Dashed Semi-Circle Arc */}
              <path 
                d={`M ${cx - radius} ${cy} A ${radius+10} ${radius+10} 0 0 1 ${cx + radius} ${cy}`} 
                fill="transparent" 
                stroke="rgba(255,255,255,0.4)" 
                strokeWidth="2" 
                strokeDasharray="5 5" 
              />
              
              {/* Horizon line */}
              <line x1="18" y1="90" x2="182" y2="90" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
              
              {/* The Sun Indicator */}
              <g transform={`translate(${sunX}, ${sunY})`}>
                <circle cx="0" cy="0" r="10" fill="#FFD700" className="drop-shadow-lg" />
              </g>
            </svg>
            
            {/* Time Labels */}
            <div className="flex justify-between w-full mt-2 text-sm font-medium">
              <div className="flex flex-col items-center">
                <Sunrise size={20} className="mb-1 text-orange-300" />
                <span>{formatTime(sunriseTime)}</span>
              </div>
              <div className="flex flex-col items-center">
                <Sunset size={20} className="mb-1 text-orange-400" />
                <span>{formatTime(sunsetTime)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Min & Max Temperatures */}
        <div className="flex-1 w-full flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-white/20 pt-6 md:pt-0 md:pl-6">
           <h3 className="text-lg font-semibold mb-6 uppercase tracking-wider opacity-90">Temperature Range</h3>
           
           <div className="flex justify-around w-full max-w-xs">
             {/* Min Temp */}
             <div className="flex flex-col items-center">
               <div className="bg-white/20 p-3 rounded-full mb-3 shadow-inner">
                 <Thermometer className="text-blue-200" size={28} />
               </div>
               <p className="text-sm uppercase tracking-wide opacity-80 mb-1">Min Temp</p>
               <p className="text-3xl font-bold">{min}°</p>
             </div>
             
             {/* Max Temp */}
             <div className="flex flex-col items-center">
               <div className="bg-white/20 p-3 rounded-full mb-3 shadow-inner">
                 <ThermometerSun className="text-orange-300" size={28} />
               </div>
               <p className="text-sm uppercase tracking-wide opacity-80 mb-1">Max Temp</p>
               <p className="text-3xl font-bold">{max}°</p>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}