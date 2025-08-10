"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Modal } from "../ui/modal";
import { LocationSelector } from "../select/LocationSelector";
import { useLocationStore } from "../../store/locationStore";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "view";
  userId?: number;
  onSubmit: (data: { name: string; phone: string; location_id: string }) => Promise<void>;
  onGetUser?: (userId: number) => Promise<{ success: boolean; data?: any; error?: string }>;
}

interface UserData {
  name: string;
  phone: string;
  location_id: string;
  created_at?: string;
  updated_at?: string;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  mode,
  userId,
  onSubmit,
  onGetUser,
}) => {
  const [formData, setFormData] = useState<UserData>({
    name: "",
    phone: "",
    location_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { resetSelections } = useLocationStore();

  // Helper function to validate location_id format
  const isValidLocationId = (location_id: string) => {
    return location_id && location_id.includes('.');
  };

  useEffect(() => {
    if (isOpen && mode !== "create" && userId && onGetUser) {
      loadUserData();
    } else if (isOpen && mode === "create") {
      setFormData({ name: "", phone: "", location_id: "" });
      setError(null);
      resetSelections(); // Reset location selections for new user
    }
  }, [isOpen, mode, userId, onGetUser]); // Removed resetSelections from deps

  const loadUserData = async () => {
    if (!userId || !onGetUser) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await onGetUser(userId);
      if (result.success && result.data) {
        setFormData({
          name: result.data.name,
          phone: result.data.phone,
          location_id: result.data.location_id,
          created_at: result.data.created_at,
          updated_at: result.data.updated_at,
        });
      } else {
        setError(result.error || "Failed to load user data");
      }
    } catch (err) {
      setError("An error occurred while loading user data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "view") return;

    setSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        name: formData.name,
        phone: formData.phone,
        location_id: formData.location_id,
      });
      onClose();
      resetSelections(); // Reset after successful submission
    } catch (err) {
      setError("An error occurred while saving");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle location selection change - memoized to prevent infinite re-renders
  const handleLocationChange = useCallback((location: any) => {
    // Generate location_id from selected location
    const parts = [];
    if (location.provinsi?.kd_propinsi) parts.push(location.provinsi.kd_propinsi);
    if (location.kabupaten?.kd_kabupaten) parts.push(location.kabupaten.kd_kabupaten);
    if (location.kecamatan?.kd_kecamatan) parts.push(location.kecamatan.kd_kecamatan);
    if (location.kelurahan?.kd_kelurahan) parts.push(location.kelurahan.kd_kelurahan);
    
    const locationId = parts.join('.');
    setFormData(prev => ({ ...prev, location_id: locationId }));
  }, []); // No dependencies needed as we're only updating local state

  const getTitle = () => {
    switch (mode) {
      case "create": return "Add New User";
      case "edit": return "Edit User";
      case "view": return "User Details";
      default: return "User";
    }
  };

  const isReadOnly = mode === "view";

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl mx-4">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {getTitle()}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500 dark:text-gray-400">Loading...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    required={!isReadOnly}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                    disabled={isReadOnly}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    required={!isReadOnly}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                    disabled={isReadOnly}
                  />
                </div>
              </div>
              {/* Location Selector - Outside of form to avoid nesting issues */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Location</h3>
              {!isReadOnly ? (
                <LocationSelector onLocationChange={handleLocationChange} showResetButton={false} />
              ) : (
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location ID
                  </label>
                  <div className="text-sm font-mono text-gray-900 dark:text-white bg-white dark:bg-gray-700 p-2 rounded border">
                    {formData.location_id || '-'}
                  </div>
                </div>
              )}
            </div>
            {mode === "view" && formData.created_at && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Created At
                  </label>
                  <input
                    type="text"
                    value={new Date(formData.created_at).toLocaleString()}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Updated At
                  </label>
                  <input
                    type="text"
                    value={new Date(formData.updated_at!).toLocaleString()}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                </div>
              </div>
            )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  {mode === "view" ? "Close" : "Cancel"}
                </button>
                
                {!isReadOnly && (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Saving..." : mode === "create" ? "Create" : "Update"}
                  </button>
                )}
              </div>
            </form>

            

            
          </div>
        )}
      </div>
    </Modal>
  );
};
