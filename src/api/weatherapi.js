const API_KEY = import.meta.env.VITE_RAPID_API_KEY;
const API_HOST = 'open-weather13.p.rapidapi.com';

export const fetchWeatherByCity = async (cityName) => {
  const url = `https://${API_HOST}/city?city=${cityName}&lang=EN`;
  
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': import.meta.env.VITE_RAPID_API_KEY,
      'x-rapidapi-host': API_HOST,
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch weather: HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error; 
  }
};