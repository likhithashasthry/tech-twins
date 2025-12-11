import { WateringSchedule } from '../App';
import { Calendar, Clock, Droplets, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

interface ScheduleOutputProps {
  schedule: WateringSchedule;
}

export function ScheduleOutput({ schedule }: ScheduleOutputProps) {
  return (
    <div className="space-y-4">
      {/* Main Schedule Card */}
      <div className={`rounded-xl shadow-lg p-6 border-2 ${
        schedule.shouldWater 
          ? 'bg-gradient-to-br from-green-500 to-emerald-500 border-green-400 text-white'
          : 'bg-gradient-to-br from-red-500 to-orange-500 border-red-400 text-white'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3>Watering Schedule</h3>
          {schedule.shouldWater ? (
            <CheckCircle className="size-8" />
          ) : (
            <AlertCircle className="size-8" />
          )}
        </div>

        {schedule.shouldWater ? (
          <div>
            <div className="text-5xl mb-2">{schedule.duration.toFixed(1)} min</div>
            <div className="text-green-100 mb-6">Recommended watering time</div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Droplets className="size-4" />
                  <span className="text-green-100 text-sm">Water Volume</span>
                </div>
                <div className="text-2xl">{schedule.waterVolume.toFixed(1)} L</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="size-4" />
                  <span className="text-green-100 text-sm">Optimal Time</span>
                </div>
                <div className="text-2xl">{schedule.optimalTime}</div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-5xl mb-2">SKIP</div>
            <div className="text-red-100 mb-4">No watering needed today</div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Droplets className="size-5" />
                <span>Expected rainfall will meet your plants&apos; water needs</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Water Savings Card */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-green-100 p-2 rounded-lg">
            <TrendingDown className="size-6 text-green-600" />
          </div>
          <h3 className="text-green-900">Water Savings</h3>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4">
          <div className="text-green-700 mb-1">Estimated Savings vs. Traditional Schedule</div>
          <div className="text-4xl text-green-900">{schedule.waterSavings}%</div>
        </div>

        <div className="text-green-600 text-sm">
          By using real-time weather data and plant-specific requirements, you&apos;re using water more efficiently 
          compared to traditional fixed schedules.
        </div>
      </div>

      {/* Reasoning Card */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="size-5 text-green-600" />
          <h3 className="text-green-900">Analysis</h3>
        </div>
        <p className="text-green-700">{schedule.reasoning}</p>
      </div>

      {/* Best Practices */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h4 className="text-blue-900 mb-3">💡 Watering Tips</h4>
        <ul className="space-y-2 text-blue-700 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Water early in the morning (6-8 AM) to minimize evaporation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Check soil moisture before watering - if it&apos;s still moist, you can skip</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Water deeply and less frequently to encourage root growth</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>Monitor weather forecasts and adjust schedule accordingly</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
