import { useState } from "react";
import type { Plant, UserData } from "../App";
import { PLANTS } from "./PlantSelector";
import { Leaf, ArrowRight, ArrowLeft } from "lucide-react";

interface AddPlantsProps {
  user: UserData;
  onDone: (updatedUser: UserData) => void;
  onBack: () => void;
}

export function AddPlants({ user, onDone, onBack }: AddPlantsProps) {
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [error, setError] = useState("");
  const API_BASE_URL = "http://localhost:5000/api";

  const handleSavePlant = async () => {
    setError("");
    if (!selectedPlant) { setError("Please select a plant"); return; }

    try {
      const res = await fetch(`${API_BASE_URL}/users/${user._id}/plants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedPlant.name,
          soilType: selectedPlant.soilType,
          moistureRange: selectedPlant.moistureRange,
          droughtTolerance: selectedPlant.droughtTolerance,
          cropCoefficient: selectedPlant.cropCoefficient,
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.message || "Failed to save plant"); return; }

      onDone(data.user);
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-green-500 to-cyan-500 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-green-900 text-center mb-4">Select Your Plant</h2>
        <p className="text-green-600 text-center mb-6">Choose what you are growing in your garden</p>

        <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
          {PLANTS.map((plant) => (
            <button key={plant.id} onClick={() => setSelectedPlant(plant)} className={`p-4 rounded-lg border-2 text-left transition-all ${selectedPlant?.id === plant.id ? "border-green-500 bg-green-50" : "border-green-200 hover:border-green-300 bg-white"}`}>
              <div className="text-green-900 font-semibold">{plant.name}</div>
              <div className="text-green-600 text-sm">{plant.soilType}</div>
            </button>
          ))}
        </div>

        {error && <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mt-4">{error}</div>}

        <div className="flex gap-4 mt-6">
          <button onClick={onBack} className="px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-all flex items-center gap-2">
            <ArrowLeft className="size-5" /> Back
          </button>

          <button onClick={handleSavePlant} className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all shadow-lg flex items-center justify-center gap-2">
            Save Plant <Leaf className="size-5" /> <ArrowRight className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
