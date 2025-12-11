import { useState } from 'react';
import { UserData } from './CreateAccount';
import { Plant } from '../App';
import { PLANTS } from './PlantSelector';
import { X, Save, MapPin, Leaf, Settings, Droplets, Mail, User } from 'lucide-react';

interface SettingsModalProps {
  userData: UserData;
  onClose: () => void;
  onSave: (updatedData: UserData) => void;
}

const SOIL_TYPES = ['Sandy', 'Clay', 'Loamy', 'Sandy Loam', 'Silty', 'Peaty'];

export function SettingsModal({ userData, onClose, onSave }: SettingsModalProps) {
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    location: userData.location,
    plant: userData.plant,
    soilType: userData.soilType,
    flowRate: userData.flowRate.toString(),
    areaSize: userData.areaSize.toString()
  });
  const [error, setError] = useState('');

  const handleSave = () => {
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!formData.location.trim()) {
      setError('Please enter your location');
      return;
    }
    if (!formData.plant) {
      setError('Please select a plant');
      return;
    }
    if (!formData.soilType) {
      setError('Please select a soil type');
      return;
    }
    if (!formData.flowRate || parseFloat(formData.flowRate) <= 0) {
      setError('Please enter a valid flow rate');
      return;
    }
    if (!formData.areaSize || parseFloat(formData.areaSize) <= 0) {
      setError('Please enter a valid area size');
      return;
    }

    const updatedData: UserData = {
      ...userData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      location: formData.location.trim(),
      plant: formData.plant,
      soilType: formData.soilType,
      flowRate: parseFloat(formData.flowRate),
      areaSize: parseFloat(formData.areaSize)
    };

    onSave(updatedData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="mb-1">Settings</h2>
            <p className="text-green-50">Update your garden configuration</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Account Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-green-700 mb-2">
                <div className="flex items-center gap-2">
                  <User className="size-5 text-green-600" />
                  <span>Full Name</span>
                </div>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setError('');
                }}
                placeholder="Your name"
                className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-green-700 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="size-5 text-green-600" />
                  <span>Email Address</span>
                </div>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setError('');
                }}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-green-700 mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="size-5 text-green-600" />
                <span>Location</span>
              </div>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => {
                setFormData({ ...formData, location: e.target.value });
                setError('');
              }}
              placeholder="City or Zip Code"
              className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Plant Selection */}
          <div>
            <label className="block text-green-700 mb-2">
              <div className="flex items-center gap-2">
                <Leaf className="size-5 text-green-600" />
                <span>Plant Type</span>
              </div>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-1 border-2 border-green-100 rounded-lg">
              {PLANTS.map((plant) => (
                <button
                  key={plant.id}
                  onClick={() => {
                    setFormData({ ...formData, plant });
                    setError('');
                  }}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    formData.plant.id === plant.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-green-200 hover:border-green-300 bg-white'
                  }`}
                >
                  <div className="text-green-900 text-sm">{plant.name}</div>
                  <div className="text-green-600 text-xs">{plant.soilType}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Soil Type */}
          <div>
            <label className="block text-green-700 mb-2">
              <div className="flex items-center gap-2">
                <Settings className="size-5 text-green-600" />
                <span>Soil Type</span>
              </div>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {SOIL_TYPES.map((soil) => (
                <button
                  key={soil}
                  onClick={() => {
                    setFormData({ ...formData, soilType: soil });
                    setError('');
                  }}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.soilType === soil
                      ? 'border-green-500 bg-green-50 text-green-900'
                      : 'border-green-200 hover:border-green-300 text-green-700'
                  }`}
                >
                  {soil}
                </button>
              ))}
            </div>
          </div>

          {/* System Configuration */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-green-700 mb-2">
                <div className="flex items-center gap-2">
                  <Droplets className="size-5 text-green-600" />
                  <span>Flow Rate (L/min)</span>
                </div>
              </label>
              <input
                type="number"
                value={formData.flowRate}
                onChange={(e) => {
                  setFormData({ ...formData, flowRate: e.target.value });
                  setError('');
                }}
                placeholder="e.g., 5"
                className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-green-700 mb-2">
                <div className="flex items-center gap-2">
                  <Settings className="size-5 text-green-600" />
                  <span>Garden Area (m²)</span>
                </div>
              </label>
              <input
                type="number"
                value={formData.areaSize}
                onChange={(e) => {
                  setFormData({ ...formData, areaSize: e.target.value });
                  setError('');
                }}
                placeholder="e.g., 10"
                className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
                step="0.1"
              />
            </div>
          </div>

          {/* Current Plant Info */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
            <h4 className="text-green-900 mb-3">Selected Plant Details</h4>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <dt className="text-green-700">Name:</dt>
              <dd className="text-green-900">{formData.plant.name}</dd>
              <dt className="text-green-700">Optimal Soil:</dt>
              <dd className="text-green-900">{formData.plant.soilType}</dd>
              <dt className="text-green-700">Moisture Range:</dt>
              <dd className="text-green-900">{formData.plant.moistureRange}</dd>
              <dt className="text-green-700">Drought Tolerance:</dt>
              <dd className="text-green-900">{formData.plant.droughtTolerance}</dd>
              <dt className="text-green-700">Crop Coefficient:</dt>
              <dd className="text-green-900">{formData.plant.cropCoefficient}</dd>
            </dl>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl flex gap-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Save className="size-5" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}