
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const fetch = require("node-fetch");

const OPENWEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";

exports.register = async (req, res) => {
  try {
    const { name, email, password, location, flowRate, areaSize } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, location: location || "", flowRate: flowRate || 0, areaSize: areaSize || 0 });
    await user.save();
    const u = user.toObject(); delete u.password;
    res.json({ message: "Registered", user: u });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Wrong password" });

    const u = user.toObject(); delete u.password;
    res.json({ message: "Login success", user: u });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.addPlant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, soilType, moistureRange, droughtTolerance, cropCoefficient } = req.body;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const plant = {
      id: uuidv4(),
      name,
      soilType,
      moistureRange,
      droughtTolerance,
      cropCoefficient: Number(cropCoefficient) || 0
    };
    user.plants.push(plant);
    await user.save();
    const u = user.toObject(); delete u.password;
    res.json({ message: "Plant added", user: u });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getWaterRecommendation = async (req, res) => {
  try {
    const { id } = req.params;
    const { lat, lon } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey) return res.status(500).json({ message: "OpenWeather API key not configured" });
    if (!lat || !lon) return res.status(400).json({ message: "lat and lon required as query params" });

    // Using the free 'weather' endpoint
    const url = `${OPENWEATHER_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    
    const resp = await fetch(url);
    
    if (!resp.ok) {
      const txt = await resp.text();
      console.error("OWM fetch failed:", txt);
      return res.status(500).json({ message: "Failed to fetch weather" });
    }
    
    const data = await resp.json();

    // --- ADAPTATION FOR CURRENT WEATHER API DATA STRUCTURE ---
    
    const humidity = data.main ? data.main.humidity : 0;
    const temp = data.main ? data.main.temp : null;
    
    // Check for rain in the last hour, which is often a better proxy for skipping watering
    // The rain object is optional, so we must check if it exists
    const rain_1h = (data.rain && data.rain['1h']) ? data.rain['1h'] : 0; 
    
    let recommendation = "WATER";
    let reason = "";

    if (rain_1h > 0.5) { // Check for recent rain (e.g., more than 0.5mm in the last hour)
      recommendation = "SKIP";
      reason = `Recent rain detected (${rain_1h}mm in the last hour).`;
    } else if (humidity >= 80 && temp !== null && temp < 20) {
      recommendation = "SKIP";
      reason = `High humidity (${humidity}%) and cool temperature (${temp}°C).`;
    } else {
      recommendation = "WATER";
      reason = `No significant rain detected. Temp ${temp}°C, humidity ${humidity}%.`;
    }
    
    res.json({
      recommendation,
      reason,
      weatherSummary: {
        rain: rain_1h, // Use the 1-hour rain data
        humidity,
        temp,
        // sunrise and sunset are in 'sys' object for this endpoint
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};