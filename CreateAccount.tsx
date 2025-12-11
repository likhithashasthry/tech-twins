import { useState } from "react";
import { Droplets, User, Lock, MapPin, Settings, ArrowRight, Mail } from "lucide-react";
import type { Plant, UserData } from "../App";
import { PLANTS } from "./PlantSelector";

interface CreateAccountProps {
  onAccountCreated: (userData: UserData) => void;
  onSwitchToLogin: () => void;
}

const SOIL_TYPES = ["Sandy", "Clay", "Loamy", "Sandy Loam", "Silty", "Peaty"];
const API_BASE_URL = "http://localhost:5000/api";

export function CreateAccount({ onAccountCreated, onSwitchToLogin }: CreateAccountProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    plant: null as Plant | null,
    soilType: "",
    flowRate: "",
    areaSize: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    setError("");

    // STEP 1
    if (step === 1) {
      if (!formData.name.trim()) { setError("Please enter your name"); return; }
      if (!formData.email.trim()) { setError("Please enter your email"); return; }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) { setError("Please enter a valid email address"); return; }
      if (!formData.password || formData.password.length < 4) { setError("Password must be at least 4 characters"); return; }
      if (formData.password !== formData.confirmPassword) { setError("Passwords do not match"); return; }
      setStep(2);
      return;
    }

    // STEP 2
    if (step === 2) {
      if (!formData.location.trim()) { setError("Please enter your location"); return; }
      if (!formData.plant) { setError("Please select a plant/crop"); return; }
      if (!formData.soilType) { setError("Please select your soil type"); return; }
      setStep(3);
      return;
    }

    // STEP 3 -> call backend register
    if (step === 3) {
      if (!formData.flowRate || Number(formData.flowRate) <= 0) { setError("Please enter a valid flow rate"); return; }
      if (!formData.areaSize || Number(formData.areaSize) <= 0) { setError("Please enter a valid area size"); return; }

      setLoading(true);
      try {
        const payload = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          location: formData.location.trim(),
          soilType: formData.soilType,
          flowRate: Number(formData.flowRate) || 0,
          areaSize: Number(formData.areaSize) || 0,
        };

        const res = await fetch(`${API_BASE_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || data.error || "Signup failed");
          setLoading(false);
          return;
        }

        // backend returns data.user
        onAccountCreated(data.user);
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    setError("");
    setStep(Math.max(1, step - 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-green-500 to-cyan-500 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-white rounded-2xl p-4 shadow-2xl mb-4">
            <Droplets className="size-16 text-green-500" />
          </div>
          <h1 className="text-white mb-2 font-bold">Create Your Account</h1>
          <p className="text-white/90">Intelligent Irrigation Scheduler</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${s <= step ? "bg-white text-green-600" : "bg-white/30 text-white"}`}>{s}</div>
                {s < 3 && <div className={`flex-1 h-1 mx-2 rounded transition-all ${s < step ? "bg-white" : "bg-white/30"}`} />}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2 text-white text-sm text-center">
            <div>Account Info</div>
            <div>Garden Setup</div>
            <div>System Config</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-green-900 mb-2">Account Information</h2>
                <p className="text-green-600">Let's start with your basic details</p>
              </div>

              <div>
                <label htmlFor="name" className="block text-green-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-green-400" />
                  <input id="name" type="text" placeholder="Enter your full name" value={formData.name} onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setError(""); }} className="w-full pl-12 pr-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-green-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-green-400" />
                  <input id="email" type="email" placeholder="Enter your email" value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setError(""); }} className="w-full pl-12 pr-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-green-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-green-400" />
                  <input id="password" type="password" placeholder="Create a password (min 4 characters)" value={formData.password} onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setError(""); }} className="w-full pl-12 pr-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-green-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-green-400" />
                  <input id="confirmPassword" type="password" placeholder="Re-enter your password" value={formData.confirmPassword} onChange={(e) => { setFormData({ ...formData, confirmPassword: e.target.value }); setError(""); }} className="w-full pl-12 pr-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-green-900 mb-2">Garden Setup</h2>
                <p className="text-green-600">Tell us about your garden</p>
              </div>

              <div>
                <label htmlFor="location" className="block text-green-700 mb-2">Location (City or Zip Code)</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-green-400" />
                  <input id="location" type="text" placeholder="e.g., San Francisco or 94102" value={formData.location} onChange={(e) => { setFormData({ ...formData, location: e.target.value }); setError(""); }} className="w-full pl-12 pr-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>

              <div>
                <label className="block text-green-700 mb-2">What are you growing?</label>
                <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1">
                  {PLANTS.map((plant) => (
                    <button key={plant.id} onClick={() => { setFormData({ ...formData, plant }); setError(""); }} className={`p-3 rounded-lg border-2 text-left transition-all ${formData.plant?.id === plant.id ? "border-green-500 bg-green-50" : "border-green-200 hover:border-green-300 bg-white"}`}>
                      <div className="text-green-900">{plant.name}</div>
                      <div className="text-green-600 text-sm">{plant.soilType}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-green-700 mb-2">Your Soil Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {SOIL_TYPES.map((soil) => (
                    <button key={soil} onClick={() => { setFormData({ ...formData, soilType: soil }); setError(""); }} className={`p-3 rounded-lg border-2 transition-all ${formData.soilType === soil ? "border-green-500 bg-green-50 text-green-900" : "border-green-200 hover:border-green-300 text-green-700"}`}>
                      {soil}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-green-900 mb-2">System Configuration</h2>
                <p className="text-green-600">Final details about your irrigation system</p>
              </div>

              <div>
                <label htmlFor="flowRate" className="block text-green-700 mb-2">Flow Rate (Liters/minute)</label>
                <div className="relative">
                  <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-green-400" />
                  <input id="flowRate" type="number" placeholder="e.g., 5" value={formData.flowRate} onChange={(e) => { setFormData({ ...formData, flowRate: e.target.value }); setError(""); }} className="w-full pl-12 pr-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" min="0" step="0.1" />
                </div>
                <p className="text-green-600 text-sm mt-1">How much water your system delivers per minute</p>
              </div>

              <div>
                <label htmlFor="areaSize" className="block text-green-700 mb-2">Garden Area (m²)</label>
                <div className="relative">
                  <Settings className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-green-400" />
                  <input id="areaSize" type="number" placeholder="e.g., 10" value={formData.areaSize} onChange={(e) => { setFormData({ ...formData, areaSize: e.target.value }); setError(""); }} className="w-full pl-12 pr-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" min="0" step="0.1" />
                </div>
                <p className="text-green-600 text-sm mt-1">Total area you want to water</p>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <h4 className="text-green-900 mb-2">Your Setup Summary</h4>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-green-700">Name:</dt>
                    <dd className="text-green-900">{formData.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-green-700">Email:</dt>
                    <dd className="text-green-900">{formData.email}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-green-700">Location:</dt>
                    <dd className="text-green-900">{formData.location}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-green-700">Plant:</dt>
                    <dd className="text-green-900">{formData.plant?.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-green-700">Soil Type:</dt>
                    <dd className="text-green-900">{formData.soilType}</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {error && <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mt-4">{error}</div>}

          <div className="flex gap-4 mt-6">
            {step > 1 && <button onClick={handleBack} className="px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-all">Back</button>}
            <button onClick={handleNext} className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all shadow-lg flex items-center justify-center gap-2">
              {loading ? "Please wait..." : step === 3 ? "Create Account" : "Next"}
              <ArrowRight className="size-5" />
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-green-600 text-sm">Already have an account? <button onClick={onSwitchToLogin} className="text-green-700 hover:underline">Sign In</button></p>
          </div>
        </div>
      </div>
    </div>
  );
}
