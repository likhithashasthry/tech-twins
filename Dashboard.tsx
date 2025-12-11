import { useState, useEffect } from 'react';
import type { UserData, WeatherData, WateringSchedule } from "../App";
import {
  Droplets,
  Thermometer,
  Cloud,
  Calendar,
  TrendingDown,
  AlertCircle,
  Leaf,
  MapPin,
  Settings as SettingsIcon,
  CheckCircle,
  Sun,
  CloudRain,
  Wind,
} from "lucide-react";

interface DashboardProps {
  userData: UserData;
  onOpenSettings: () => void;
}

const API_BASE_URL = "http://localhost:5000/api";

export function Dashboard({ userData, onOpenSettings }: DashboardProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [schedule, setSchedule] = useState<WateringSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBackendRecommendation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const fetchBackendRecommendation = () => {
    setLoading(true);
    setError("");

    if (!userData || !userData._id) {
      setError("Missing user data");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          const res = await fetch(`${API_BASE_URL}/users/${userData._id}/water-recommendation?lat=${lat}&lon=${lon}`);
          const data = await res.json();

          if (!res.ok) {
            setError(data.message || "Failed to load data");
            setLoading(false);
            return;
          }

          const backendWeather: WeatherData = {
            temperature: data.weatherSummary.temp,
            humidity: data.weatherSummary.humidity,
            predictedRainfall: data.weatherSummary.rain,
            location: userData.location,
          };

          const backendSchedule: WateringSchedule = {
            duration: data.duration ?? 0,
            waterVolume: data.waterVolume ?? 0,
            shouldWater: data.recommendation === "WATER",
            reasoning: data.reason,
            waterSavings: data.waterSavings ?? 0,
            optimalTime: data.optimalTime ?? "Morning",
          };

          setWeatherData(backendWeather);
          setSchedule(backendSchedule);
          setLoading(false);
        } catch (err) {
          console.error(err);
          setError("Unable to fetch recommendation");
          setLoading(false);
        }
      },
      (err) => {
        console.error("Geo error: ", err);
        setError("Enable location for accurate watering.");
        setLoading(false);
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Droplets className="size-16 text-green-500 animate-pulse mx-auto mb-4" />
          <p className="text-green-700">Loading your personalized dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <AlertCircle className="size-16 text-red-500 mb-4" />
        <p className="text-red-600 text-lg">{error}</p>
        <button onClick={fetchBackendRecommendation} className="mt-6 px-8 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
        <h2 className="mb-2">Welcome back, {userData.name}! 👋</h2>
        <p className="text-green-50 mb-4">Here's your personalized watering schedule and plant care recommendations</p>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2"><MapPin className="size-4" /><span>{userData.location}</span></div>
          <div className="flex items-center gap-2"><Leaf className="size-4" /><span>{userData.plant?.name}</span></div>
          <div className="flex items-center gap-2"><span>{userData.areaSize}m² garden</span></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {schedule && (
            <div className={`rounded-2xl shadow-xl p-8 ${schedule.shouldWater ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white" : "bg-gradient-to-br from-orange-500 to-red-500 text-white"}`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="mb-2">Today's Watering Schedule</h3>
                  <p className="text-white/90">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                </div>
                {schedule.shouldWater ? <CheckCircle className="size-12" /> : <AlertCircle className="size-12" />}
              </div>

              {schedule.shouldWater ? (
                <div>
                  <div className="mb-4">
                    <div className="text-6xl mb-2">{schedule.duration.toFixed(1)}</div>
                    <div className="text-2xl text-white/90">minutes of watering</div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2"><Droplets className="size-5" /><span className="text-sm">Volume</span></div>
                      <div className="text-2xl">{schedule.waterVolume.toFixed(1)} L</div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2"><Sun className="size-5" /><span className="text-sm">Best Time</span></div>
                      <div className="text-2xl">{schedule.optimalTime}</div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2"><TrendingDown className="size-5" /><span className="text-sm">Savings</span></div>
                      <div className="text-2xl">{schedule.waterSavings}%</div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4"><p className="text-white/90">{schedule.reasoning}</p></div>
                </div>
              ) : (
                <div>
                  <div className="text-6xl mb-4">SKIP WATERING</div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-3"><CloudRain className="size-8" /><p>{schedule.reasoning}</p></div>
                  </div>
                  <p className="text-white/90">You're saving {schedule.waterSavings}% of water today!</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {weatherData && (
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center justify-between mb-6">
                <h3>Current Weather</h3>
                <Cloud className="size-8 opacity-80" />
              </div>

              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><Thermometer className="size-5" /><span className="text-sm text-blue-100">Temperature</span></div><div className="text-4xl">{weatherData.temperature}°C</div></div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><Wind className="size-5" /><span className="text-sm text-blue-100">Humidity</span></div><div className="text-4xl">{weatherData.humidity}%</div></div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><CloudRain className="size-5" /><span className="text-sm text-blue-100">Rainfall (24h)</span></div><div className="text-4xl">{weatherData.predictedRainfall.toFixed(1)} mm</div></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-center">
        <button onClick={fetchBackendRecommendation} className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all shadow-lg flex items-center gap-2 mx-auto">
          <Calendar className="size-5" /> Refresh Weather & Schedule
        </button>
      </div>
    </div>
  );
}
