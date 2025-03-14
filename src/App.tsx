import React, { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { WeatherCard } from './components/WeatherCard';
import { FavoritesList } from './components/FavoritesList';
import type { WeatherData } from './types';
import { Cloud, Sun } from 'lucide-react';

// Mock weather data (replace with actual API integration)
const getMockWeatherData = (city: string): WeatherData => ({
  city,
  temperature: Math.random() * 30 + 10,
  humidity: Math.floor(Math.random() * 100),
  description: "Partly cloudy",
  icon: "02d"
});

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favoritesCities');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('favoritesCities', JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, this would be an API call
      const data = getMockWeatherData(city);
      setWeather(data);
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (city: string) => {
    setFavorites(prev =>
      prev.includes(city)
        ? prev.filter(c => c !== city)
        : [...prev, city]
    );
  };

  const getTemperatureClass = (temp: number) => {
    if (temp < 20) return 'cold';
    if (temp > 35) return 'hot';
    return 'moderate';
  };

  const renderWeatherEffects = (temp: number) => {
    if (temp < 20) {
      // Render snowflakes for cold weather
      return Array.from({ length: 50 }).map((_, i) => (
        <div key={i} className="snowflake" style={{
          left: `${Math.random() * 100}vw`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${5 + Math.random() * 5}s`
        }} />
      ));
    } else if (temp > 35) {
      // Render sun rays for hot weather
      return (
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
          <div className="sun-rays" />
          <Sun className="absolute top-10 right-10 text-yellow-400" size={100} />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div 
        className={`absolute inset-0 temperature-bg ${weather ? getTemperatureClass(weather.temperature) : 'moderate'}`}
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=2000&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
        }}
      />
      
      {/* Large animated clouds */}
      <div className="absolute w-full h-full overflow-hidden pointer-events-none">
        <div className="cloud absolute" style={{ top: '10%' }}>
          <Cloud size={120} className="text-white opacity-40" />
        </div>
        <div className="cloud absolute" style={{ top: '30%' }}>
          <Cloud size={100} className="text-white opacity-30" />
        </div>
        <div className="cloud absolute" style={{ top: '50%' }}>
          <Cloud size={80} className="text-white opacity-20" />
        </div>
      </div>

      {weather && renderWeatherEffects(weather.temperature)}

      <div className="relative max-w-4xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Cloud className="text-white mr-2" size={32} />
            <h1 className="text-4xl font-bold text-white font-serif tracking-wide">
              Weather Dashboard
            </h1>
          </div>
          <SearchBar onSearch={handleSearch} />
          
          {favorites.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4 font-serif">
                Your Favorite Cities
              </h2>
              <FavoritesList
                favorites={favorites}
                onSelectCity={handleSearch}
                onRemoveCity={toggleFavorite}
              />
            </div>
          )}
        </div>

        {loading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md mx-auto">
            {error}
          </div>
        )}

        {weather && !loading && (
          <div className="flex justify-center">
            <WeatherCard
              weather={weather}
              isFavorite={favorites.includes(weather.city)}
              onToggleFavorite={toggleFavorite}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;