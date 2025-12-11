import axios from "axios";
import User from "../models/User.js";

export const getWaterRecommendation = async (req, res) => {
  try {
    const userId = req.params.id;
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ message: "Missing lat/lon" });
    }

    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const API_KEY = process.env.OPENWEATHER_API_KEY;

    // 1. Fetch weather data
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    const weatherRes = await axios.get(weatherURL);
    const w = weatherRes.data;

    const temp = w.main.temp;
    const humidity = w.main.humidity;
    const pop = w.clouds.all; // clouds % as proxy
    const rain = w.rain?.["1h"] || 0;
    const sunrise = w.sys.sunrise;
    const sunset = w.sys.sunset;

    // 2. Logic for WATER or SKIP
    let shouldWater = true;
    let reason = "";

    if (rain > 2) {
      shouldWater = false;
      reason = "Rain expected, watering skipped.";
    } else if (humidity > 80) {
      shouldWater = false;
      reason = "Humidity is high, plants don't need watering.";
    } else if (temp < 15) {
      shouldWater = false;
      reason = "Temperature low, watering not recommended.";
    } else {
      shouldWater = true;
      reason = "Weather conditions require watering.";
    }

    return res.json({
      recommendation: shouldWater ? "WATER" : "SKIP",
      reason,
      weatherSummary: {
        pop,
        rain,
        humidity,
        temp,
        sunrise,
        sunset
      }
    });

  } catch (err) {
    console.error("Error in waterController:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};
