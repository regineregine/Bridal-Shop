import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function SizeCustomizationModal({
  isOpen,
  onClose,
  onSave,
  savedMeasurements,
}) {
  const [measurements, setMeasurements] = useState({
    bust: '',
    waist: '',
    hips: '',
    hollow_to_hem: '',
    height: '',
    notes: '',
  });

  // Sync measurements when modal opens or savedMeasurements changes
  useEffect(() => {
    if (isOpen && savedMeasurements) {
      // Use functional update to avoid triggering cascade
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMeasurements((prev) => ({
        bust: savedMeasurements.bust || prev.bust || '',
        waist: savedMeasurements.waist || prev.waist || '',
        hips: savedMeasurements.hips || prev.hips || '',
        hollow_to_hem:
          savedMeasurements.hollow_to_hem || prev.hollow_to_hem || '',
        height: savedMeasurements.height || prev.height || '',
        notes: savedMeasurements.notes || prev.notes || '',
      }));
    } else if (isOpen && !savedMeasurements) {
      setMeasurements({
        bust: '',
        waist: '',
        hips: '',
        hollow_to_hem: '',
        height: '',
        notes: '',
      });
    }
  }, [isOpen, savedMeasurements]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeasurements((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Save to profile
      await api.post('/user/measurements', measurements);
      toast.success('Measurements saved successfully!');
      if (onSave) onSave(measurements);
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to save measurements'
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-panel is-open"
      aria-hidden="true"
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-surface max-w-2xl">
        <div className="modal-header">
          <div>
            <h2 className="headline text-slate-900">Customize Dress Size</h2>
            <p className="text-xs text-slate-700 mt-2">
              Enter your measurements for a custom-fitted dress
            </p>
          </div>
          <button className="close-btn" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body max-h-[65vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-700">
                <strong>Note:</strong> Please measure yourself wearing the
                undergarments you plan to wear with your dress. These
                measurements will be saved to your profile for future orders.
                Refer to the{' '}
                <a
                  href="/size-guide"
                  target="_blank"
                  className="text-pink-600 hover:text-pink-700 font-medium underline"
                >
                  Size Guide
                </a>{' '}
                for detailed measurement instructions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="block text-sm font-medium text-slate-700 mb-1"
                  htmlFor="bust"
                >
                  Bust (inches)
                </label>
                <input
                  id="bust"
                  name="bust"
                  type="number"
                  step="0.5"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="32.5"
                  value={measurements.bust}
                  onChange={handleChange}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Measure around the fullest part of your bust
                </p>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-slate-700 mb-1"
                  htmlFor="waist"
                >
                  Waist (inches)
                </label>
                <input
                  id="waist"
                  name="waist"
                  type="number"
                  step="0.5"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="25.5"
                  value={measurements.waist}
                  onChange={handleChange}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Measure around your natural waistline
                </p>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-slate-700 mb-1"
                  htmlFor="hips"
                >
                  Hips (inches)
                </label>
                <input
                  id="hips"
                  name="hips"
                  type="number"
                  step="0.5"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="35.75"
                  value={measurements.hips}
                  onChange={handleChange}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Measure around the fullest part of your hips
                </p>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-slate-700 mb-1"
                  htmlFor="hollow_to_hem"
                >
                  Hollow to Hem (inches)
                </label>
                <input
                  id="hollow_to_hem"
                  name="hollow_to_hem"
                  type="number"
                  step="0.5"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="58"
                  value={measurements.hollow_to_hem}
                  onChange={handleChange}
                />
                <p className="text-xs text-slate-500 mt-1">
                  From hollow of neck to bottom hem (with shoes)
                </p>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-slate-700 mb-1"
                  htmlFor="height"
                >
                  Height (inches)
                </label>
                <input
                  id="height"
                  name="height"
                  type="number"
                  step="0.5"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="65"
                  value={measurements.height}
                  onChange={handleChange}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Your height in inches
                </p>
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-slate-700 mb-1"
                htmlFor="notes"
              >
                Additional Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows="3"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Any special requirements or notes..."
                value={measurements.notes}
                onChange={handleChange}
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="flex-1 px-6 py-2 rounded-lg bg-white border border-gray-300 text-slate-700 font-medium hover:bg-gray-50 transition-colors"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-2 rounded-lg bg-pink-500 text-white font-medium hover:bg-pink-600 transition-colors"
              >
                Save Measurements
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
