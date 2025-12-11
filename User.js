const mongoose = require("mongoose");

const PlantSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  soilType: { type: String },
  moistureRange: { type: String },
  droughtTolerance: { type: String },
  cropCoefficient: { type: Number }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String, default: "" },
  flowRate: { type: Number, default: 0 },
  areaSize: { type: Number, default: 0 },
  plants: { type: [PlantSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
