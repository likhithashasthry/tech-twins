import { useState } from "react";
import { Droplets, Lock, LogIn, Mail } from "lucide-react";
import type { UserData } from "../App";

interface LoginProps {
  onLogin: (user: UserData) => void;
  onSwitchToCreate: () => void;
}

const API_BASE_URL = "http://localhost:5000/api";

export function Login({ onLogin, onSwitchToCreate }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) { setError("Please enter your email"); return; }
    if (!password.trim()) { setError("Please enter your password"); return; }

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      onLogin(data.user);
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-green-500 to-cyan-500 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-white rounded-2xl p-4 shadow-2xl mb-4">
            <Droplets className="size-16 text-green-500" />
          </div>
          <h1 className="text-white mb-2">Intelligent Irrigation Scheduler</h1>
          <p className="text-white/90 text-lg">Smart watering for sustainable gardens</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-green-900 mb-2 text-center">Welcome Back</h2>
          <p className="text-green-600 text-center mb-6">Sign in to optimize your water usage</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-green-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-green-400" />
                <input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} className="w-full pl-12 pr-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-green-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-green-400" />
                <input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} className="w-full pl-12 pr-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>

            {error && <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

            <button type="submit" className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all shadow-lg flex items-center justify-center gap-2">
              <LogIn className="size-5" /> Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-green-600 text-sm">New user? <button onClick={onSwitchToCreate} className="text-green-700 hover:underline">Create an account</button></p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 text-white text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl mb-1">20-40%</div>
            <div className="text-white/80 text-sm">Water Savings</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl mb-1">10+</div>
            <div className="text-white/80 text-sm">Plant Types</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl mb-1">24/7</div>
            <div className="text-white/80 text-sm">Weather Data</div>
          </div>
        </div>
      </div>
    </div>
  );
}
