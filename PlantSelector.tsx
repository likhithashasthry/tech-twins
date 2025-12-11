import { Plant } from '../App';
import { Check } from 'lucide-react';

// Plant Database
export const PLANTS: Plant[] = [
  {
    id: '1',
    name: 'Tomato',
    soilType: 'Loamy',
    moistureRange: '60-80%',
    droughtTolerance: 'Low',
    cropCoefficient: 1.15
  },
  {
    id: '2',
    name: 'Basil',
    soilType: 'Loamy',
    moistureRange: '50-70%',
    droughtTolerance: 'Low',
    cropCoefficient: 0.95
  },
  {
    id: '3',
    name: 'Rose',
    soilType: 'Loamy',
    moistureRange: '40-60%',
    droughtTolerance: 'Medium',
    cropCoefficient: 0.85
  },
  {
    id: '4',
    name: 'Lettuce',
    soilType: 'Sandy Loam',
    moistureRange: '60-75%',
    droughtTolerance: 'Low',
    cropCoefficient: 1.0
  },
  {
    id: '5',
    name: 'Cucumber',
    soilType: 'Loamy',
    moistureRange: '65-80%',
    droughtTolerance: 'Low',
    cropCoefficient: 1.05
  },
  {
    id: '6',
    name: 'Pepper',
    soilType: 'Sandy Loam',
    moistureRange: '50-70%',
    droughtTolerance: 'Medium',
    cropCoefficient: 1.0
  },
  {
    id: '7',
    name: 'Lavender',
    soilType: 'Sandy',
    moistureRange: '30-50%',
    droughtTolerance: 'High',
    cropCoefficient: 0.65
  },
  {
    id: '8',
    name: 'Strawberry',
    soilType: 'Loamy',
    moistureRange: '55-70%',
    droughtTolerance: 'Low',
    cropCoefficient: 0.85
  },
  {
    id: '9',
    name: 'Carrot',
    soilType: 'Sandy Loam',
    moistureRange: '50-65%',
    droughtTolerance: 'Medium',
    cropCoefficient: 0.95
  },
  {
    id: '10',
    name: 'Succulent',
    soilType: 'Sandy',
    moistureRange: '20-40%',
    droughtTolerance: 'High',
    cropCoefficient: 0.35
  }
];

interface PlantSelectorProps {
  selectedPlant: Plant | null;
  onSelectPlant: (plant: Plant) => void;
}

export function PlantSelector({ selectedPlant, onSelectPlant }: PlantSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
        {PLANTS.map((plant) => (
          <button
            key={plant.id}
            onClick={() => onSelectPlant(plant)}
            className={`relative p-4 rounded-lg border-2 transition-all text-left ${
              selectedPlant?.id === plant.id
                ? 'border-green-500 bg-green-50'
                : 'border-green-200 hover:border-green-300 bg-white'
            }`}
          >
            {selectedPlant?.id === plant.id && (
              <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                <Check className="size-3 text-white" />
              </div>
            )}
            <div className="text-green-900 mb-1">{plant.name}</div>
            <div className="text-green-600 text-sm">
              {plant.soilType}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs px-2 py-1 rounded ${
                plant.droughtTolerance === 'High' 
                  ? 'bg-yellow-100 text-yellow-700'
                  : plant.droughtTolerance === 'Medium'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {plant.droughtTolerance} Drought
              </span>
            </div>
          </button>
        ))}
      </div>

      {selectedPlant && (
        <div className="bg-green-50 rounded-lg p-4 border border-green-200 mt-4">
          <h4 className="text-green-900 mb-2">Selected Plant Details</h4>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="text-green-700">Soil Type:</dt>
            <dd className="text-green-900">{selectedPlant.soilType}</dd>
            <dt className="text-green-700">Moisture Range:</dt>
            <dd className="text-green-900">{selectedPlant.moistureRange}</dd>
            <dt className="text-green-700">Drought Tolerance:</dt>
            <dd className="text-green-900">{selectedPlant.droughtTolerance}</dd>
            <dt className="text-green-700">Crop Coefficient:</dt>
            <dd className="text-green-900">{selectedPlant.cropCoefficient}</dd>
          </dl>
        </div>
      )}
    </div>
  );
}
