export interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  description: string;
  icon: string;
}

export interface ForecastData {
  date: string;
  temperature: number;
  description: string;
  icon: string;
}