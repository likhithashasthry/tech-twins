import { WeatherData } from '../App';
import { Cloud, Droplets, Thermometer, Wind } from 'lucide-react';

interface WeatherDisplayProps {
  weather: WeatherData;
}

export function WeatherDisplay({ weather }: WeatherDisplayProps) {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3>Current Weather</h3>
        <Cloud className="size-8 opacity-80" />
      </div>
      
      <div className="text-2xl mb-1">{weather.location}</div>
      <div className="text-blue-100 mb-6">Live Weather Data</div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Thermometer className="size-5" />
            <span className="text-blue-100">Temperature</span>
          </div>
          <div className="text-3xl">{weather.temperature}°C</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wind className="size-5" />
            <span className="text-blue-100">Humidity</span>
          </div>
          <div className="text-3xl">{weather.humidity}%</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="size-5" />
            <span className="text-blue-100">Predicted Rainfall (24h)</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl">{weather.predictedRainfall.toFixed(1)}</span>
            <span className="text-xl text-blue-100">mm</span>
          </div>
          {weather.predictedRainfall > 5 && (
            <div className="mt-2 bg-yellow-400/20 border border-yellow-400/40 rounded px-3 py-1 text-sm">
              Significant rainfall expected
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
