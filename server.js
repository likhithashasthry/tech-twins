import dotenv from "dotenv";
dotenv.config();
console.log("Key Loaded:", process.env.OPENWEATHER_API_KEY);
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import userRoutes from "./routes/userRoutes.js";
import waterRoutes from "./routes/waterRoutes.js";

const app = express();   // <-- You must create app FIRST

app.use(cors());
app.use(express.json());

// Database connection
const MONGO = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/wootdb";

mongoose
  .connect(MONGO)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo connection error", err));

// Routes
app.use("/api", userRoutes);
app.use("/api", waterRoutes);

app.get("/api/test", (req, res) => {
  res.send("API is working");
});

app.get("/", (req, res) => res.send("WOOT backend OK"));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
