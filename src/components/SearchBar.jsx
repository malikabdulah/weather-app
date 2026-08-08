import React, { useState, useEffect } from 'react';
// import {Search} from lucide-react;

export default function SearchBar({ onSearch }) {
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      if (searchInput.trim().length < 2) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      try {
        //using geo-coding API to fetch city suggestions based on input
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchInput)}&count=5`
        );
        const data = await response.json();
        
        if (data.results) {
          setSuggestions(data.results);
          setShowDropdown(true);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching city suggestions:", error);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchCities();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  const handleSelectCity = (city) => {
    const formattedCityName = city.name;
    setSearchInput(formattedCityName);
    setShowDropdown(false);
    setSuggestions([]);
    onSearch(formattedCityName);
    setSearchInput('');
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (searchInput.trim() !== '') {
      onSearch(searchInput.trim());
      setShowDropdown(false);
      setSuggestions([]);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto relative">
      <form onSubmit={handleSubmit} className="flex bg-white/90 rounded-full shadow-md overflow-hidden px-2.5 py-2 backdrop-blur-4xl">
        <input 
          type="text" 
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search for a city..."
          className="flex-1 lg:p-3 md:p-2.8 sm:p-2 rounded-full focus:outline-none"
        />
        <button 
          type="submit"
          className="bg-blue-700 text-white lg:px-6 md:px-3 sm:px-2 rounded-full shadow-sm hover:bg-blue-900 transition-colors font-medium overflow-auto"
        >
          Search
        </button>
      </form>

      {/* Suggestion Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl mt-1 shadow-lg max-h-60 overflow-auto scroll-bar-thin scrollbar-thumb-gray-400">
          {suggestions.map((city) => (
            <li
              key={city.id}
              onClick={() => {
                handleSelectCity(city);
              }}
              className="py-3 px-5 hover:bg-gray-100 cursor-pointer text-gray-800 border-b last:border-b-0 border-gray-300 flex flex-col"  
            >
              <span className="font-medium">{city.name}</span>
              <span className="text-xs text-gray-500">
                {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}