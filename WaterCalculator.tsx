import { Plant, WeatherData, WateringSchedule } from '../App';

/**
 * Calculate the optimal watering schedule based on weather and plant data
 * 
 * Algorithm:
 * 1. Calculate Reference Evapotranspiration (ET₀)
 * 2. Calculate Plant-Specific Water Need (ETc) using crop coefficient
 * 3. Calculate Net Watering Requirement (Wnet) by subtracting predicted rainfall
 * 4. Convert to watering duration based on flow rate
 */
export function calculateWateringSchedule(
  weather: WeatherData,
  plant: Plant,
  flowRate: number,
  areaSize: number
): WateringSchedule {
  // Constants
  const K_CONSTANT = 0.0023; // Day length adjustment factor (simplified for hackathon)
  
  // Step 1: Calculate Reference Evapotranspiration (ET₀)
  // Simplified formula: ET₀ ≈ k × (T + 10) × (100 / (100 - RH))
  // This estimates water loss from a reference surface
  const temperatureFactor = weather.temperature + 10;
  const humidityFactor = 100 / (100 - weather.humidity);
  const ET0 = K_CONSTANT * temperatureFactor * humidityFactor;
  
  // Step 2: Calculate Plant-Specific Water Need (ETc)
  // ETc = Kc × ET₀
  // Kc is the crop coefficient specific to each plant
  const ETc = plant.cropCoefficient * ET0;
  
  // Step 3: Calculate Net Watering Requirement (Wnet)
  // Wnet = MAX(0, ETc - Predicted Rainfall)
  // Convert predicted rainfall from mm to L/m² (1mm = 1L/m²)
  const predictedRainfallLiters = weather.predictedRainfall;
  const Wnet = Math.max(0, ETc - predictedRainfallLiters);
  
  // Step 4: Convert to total volume needed for the area
  const totalWaterNeeded = Wnet * areaSize; // Liters
  
  // Step 5: Calculate watering duration
  // Duration = Total Volume / Flow Rate
  const duration = totalWaterNeeded / flowRate; // Minutes
  
  // Determine if watering should occur
  const shouldWater = Wnet > 0.5; // Threshold: only water if net need is > 0.5 L/m²
  
  // Calculate water savings (compared to traditional fixed schedule)
  // Assume traditional schedule waters 30 min daily
  const traditionalWaterUsed = flowRate * 30; // Liters
  const actualWaterUsed = shouldWater ? totalWaterNeeded : 0;
  const waterSavings = Math.round(((traditionalWaterUsed - actualWaterUsed) / traditionalWaterUsed) * 100);
  
  // Generate reasoning
  const reasoning = shouldWater
    ? `Based on current conditions (${weather.temperature}°C, ${weather.humidity}% humidity) and ${plant.name} water requirements (crop coefficient: ${plant.cropCoefficient}), your plants need ${ETc.toFixed(2)} L/m² today. With ${predictedRainfallLiters.toFixed(1)}mm predicted rainfall, the net requirement is ${Wnet.toFixed(2)} L/m² for your ${areaSize}m² garden.`
    : `Great news! The predicted rainfall of ${predictedRainfallLiters.toFixed(1)}mm will provide sufficient water for your ${plant.name} plants today. The calculated water need was ${ETc.toFixed(2)} L/m², which will be met by natural precipitation.`;
  
  return {
    duration: duration,
    waterVolume: totalWaterNeeded,
    shouldWater: shouldWater,
    reasoning: reasoning,
    waterSavings: Math.max(0, waterSavings),
    optimalTime: '6:00 AM'
  };
}
