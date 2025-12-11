import { useState } from "react";
import { CreateAccount } from "./components/CreateAccount";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { SettingsModal } from "./components/SettingsModal";
import { AddPlants } from "./components/AddPlants";
import { Droplets, LogOut, Settings } from "lucide-react";

export interface Plant {
  id: string;
  name: string;
  soilType: string;
  moistureRange: string;
  droughtTolerance: "Low" | "Medium" | "High" | string;
  cropCoefficient: number;
}

export interface UserData {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  location: string;
  plant: Plant | null;
  soilType: string;
  flowRate: number;
  areaSize: number;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  predictedRainfall: number;
  location: string;
}

export interface WateringSchedule {
  duration: number;
  waterVolume: number;
  shouldWater: boolean;
  reasoning: string;
  waterSavings: number;
  optimalTime: string;
}

type Screen = "create-account" | "add-plants" | "login" | "dashboard";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("create-account");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [loginError, setLoginError] = useState("");

  // called after successful registration (server returns full user)
  const handleAccountCreated = (savedUser: UserData) => {
    setUserData(savedUser);
    // after signup we go to add-plants screen so user can select the single plant
    setCurrentScreen("add-plants");
  };

  // called after successful login (server returns full user)
  const handleLogin = (savedUser: UserData) => {
    setUserData(savedUser);
    setCurrentScreen("dashboard");
    setLoginError("");
  };

  const handleLogout = () => {
    setUserData(null);
    setCurrentScreen("login");
  };

  const handleUserUpdated = (updated: UserData) => {
    setUserData(updated);
  };

  if (currentScreen === "create-account") {
    return (
      <CreateAccount
        onAccountCreated={handleAccountCreated}
        onSwitchToLogin={() => setCurrentScreen("login")}
      />
    );
  }

  if (currentScreen === "add-plants" && userData) {
    return (
      <AddPlants
        user={userData}
        onDone={(updatedUser) => {
          setUserData(updatedUser);
          setCurrentScreen("dashboard");
        }}
        onBack={() => setCurrentScreen("create-account")}
      />
    );
  }

  if (currentScreen === "login") {
    return (
      <Login
        onLogin={handleLogin}
        onSwitchToCreate={() => setCurrentScreen("create-account")}
      />
    );
  }

  if (currentScreen === "dashboard" && userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-cyan-50">
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-green-100 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-green-500 p-3 rounded-xl">
                  <Droplets className="size-8 text-white" />
                </div>
                <div>
                  <h1 className="text-green-900">Intelligent Irrigation Scheduler</h1>
                  <p className="text-green-600">Smart watering for sustainable gardens</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all border border-green-200"
                >
                  <Settings className="size-4" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all border border-red-200"
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Dashboard userData={userData} onOpenSettings={() => setShowSettings(true)} />
        </main>

        {showSettings && userData && (
          <SettingsModal
            userData={userData}
            onClose={() => setShowSettings(false)}
            onSave={(updated) => {
              setUserData(updated);
              setShowSettings(false);
            }}
          />
        )}
      </div>
    );
  }

  return null;
}
