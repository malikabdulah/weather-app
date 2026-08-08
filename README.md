# Abar (ابر)

A responsive React weather application that provides live meteorological data, dynamic visual themes, and a custom daylight sun tracker.

## Overview

This project was built to deliver accurate weather data while strictly managing API rate limits. It utilizes a dual API architecture, separating the geocoding search functionality from the core weather data fetching process to ensure optimal performance and resource management. 
abar-app.vercel.app

## Key Features

* **Dual API Search**: Uses a free geocoding API for responsive keystroke search and autocomplete without consuming primary API limits.
* **Dynamic Backgrounds**: The user interface automatically shifts its color gradient and background images based on the current weather condition and the time of day.
* **Custom Daylight Tracker**: An SVG based sun path calculates and displays the exact position of the sun based on local sunrise and sunset times.
* **Local Caching**: Implements local storage to cache weather data for three hours, preventing unnecessary API calls on page reloads.

## Technical Skillset

* **Frontend**: React, Vite
* **Styling**: Tailwind CSS
* **Data Integration**: OpenWeather API (RapidAPI), Open-Meteo Geocoding API

## Setup Instructions

1. Clone the repository to your local machine.
2. Run `npm install` to install all required dependencies.
3. Create a `.env` file in the root directory of the project and add your RapidAPI key:
   `VITE_RAPID_API_KEY=your_api_key_here`
4. Run `npm run dev` to start the local development server.