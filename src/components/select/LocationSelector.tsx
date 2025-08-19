"use client";

import React, { useCallback, useState } from 'react';
import { useLocationStore } from '../../store/locationStore';
import { ProvinsiSelect } from './provinsi-select';
import { KabupatenSelect, KecamatanSelect, KelurahanSelect } from '.';
import Button from '../ui/button/Button';
import type { LocationChangeCallback } from '../../types/location';
import { useLocationStoreTemp } from '../tables/hook';

interface LocationSelectorProps {
  className?: string;
  onLocationChange?: LocationChangeCallback;
  showResetButton?: boolean;
  value?: string;
  onChange?: (locationId: string) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  className = "",
  onLocationChange,
  showResetButton = true,
  value,
  onChange
}) => {
  const [selectedProvinsiId, setSelectedProvinsiId] = useState<string>('');
  const [selectedKabupatenId, setSelectedKabupatenId] = useState<string>('');
  const [selectedKecamatanId, setSelectedKecamatanId] = useState<string>('');
  const [selectedKelurahanId, setSelectedKelurahanId] = useState<string>('');

  const { setLastLocationId } = useLocationStoreTemp();

  const {
    selectedProvinsi,
    selectedKabupaten,
    selectedKecamatan,
    selectedKelurahan,
    resetSelections
  } = useLocationStore();

  // Handle provinsi selection
  const handleProvinsiChange = useCallback((provinsi: any) => {
    const provinsiId = provinsi?.kd_propinsi || '';
    setSelectedProvinsiId(provinsiId);
    setSelectedKabupatenId('');
    setSelectedKecamatanId('');
    setSelectedKelurahanId('');
    setLastLocationId(provinsiId);
  }, []);

  // Handle kabupaten selection
  const handleKabupatenChange = useCallback((kabupatenId: string) => {
    setSelectedKabupatenId(kabupatenId);
    setSelectedKecamatanId('');
    setSelectedKelurahanId('');
    setLastLocationId(`${selectedProvinsiId}.${kabupatenId}`);
  }, []);

  // Handle kecamatan selection
  const handleKecamatanChange = useCallback((kecamatanId: string) => {
    setSelectedKecamatanId(kecamatanId);
    setSelectedKelurahanId('');
    setLastLocationId(`${selectedProvinsiId}.${selectedKabupatenId}.${kecamatanId}`);
  }, []);

  // Handle kelurahan selection
  const handleKelurahanChange = useCallback((kelurahanId: string) => {
    setSelectedKelurahanId(kelurahanId);
    setLastLocationId(`${selectedProvinsiId}.${selectedKabupatenId}.${selectedKecamatanId}.${kelurahanId}`);

    // Generate and notify location ID when kelurahan is selected
    const locationId = `${selectedProvinsiId}.${selectedKabupatenId}.${selectedKecamatanId}.${kelurahanId}`;
    onChange?.(locationId);
  }, [selectedProvinsiId, selectedKabupatenId, selectedKecamatanId, onChange]);

  // Notify parent component when any location changes
  const notifyLocationChange = useCallback(() => {
    onLocationChange?.({
      provinsi: selectedProvinsi,
      kabupaten: selectedKabupaten,
      kecamatan: selectedKecamatan,
      kelurahan: selectedKelurahan
    });
    
  }, [selectedProvinsi, selectedKabupaten, selectedKecamatan, selectedKelurahan, onLocationChange]);

  React.useEffect(() => {
    notifyLocationChange();
  }, [notifyLocationChange]);

  const handleReset = () => {
    resetSelections();
    setSelectedProvinsiId('');
    setSelectedKabupatenId('');
    setSelectedKecamatanId('');
    setSelectedKelurahanId('');
    onChange?.('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="w-full">
          <ProvinsiSelect onSelectionChange={handleProvinsiChange} />
        </div>
        <div className="w-full">
          <KabupatenSelect 
            selectedProvinsiId={selectedProvinsiId}
            value={selectedKabupatenId}
            onChange={handleKabupatenChange}
          />
        </div>
        <div className="w-full">
          <KecamatanSelect 
            selectedProvinsiId={selectedProvinsiId}
            selectedKabupatenId={selectedKabupatenId}
            value={selectedKecamatanId}
            onChange={handleKecamatanChange}
          />
        </div>
        <div className="w-full">
          <KelurahanSelect 
            selectedProvinsiId={selectedProvinsiId}
            selectedKabupatenId={selectedKabupatenId}
            selectedKecamatanId={selectedKecamatanId}
            value={selectedKelurahanId}
            onChange={handleKelurahanChange}
          />
        </div>
      </div>

      {/* Location ID Display */}
      {selectedKelurahanId && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location ID
          </label>
          <div className="text-sm font-mono text-gray-900 dark:text-white bg-white dark:bg-gray-700 p-2 rounded border">
            {`${selectedProvinsiId}.${selectedKabupatenId}.${selectedKecamatanId}.${selectedKelurahanId}`}
          </div>
        </div>
      )}

      {/* Selected Location Summary */}
      {/* {selectedProvinsi && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Selected Location
          </label>
          <div className="text-sm space-y-1">
            <div><span className="font-medium">Provinsi:</span> {selectedProvinsi.nm_propinsi}</div>
            {selectedKabupaten && (
              <div><span className="font-medium">Kabupaten:</span> {selectedKabupaten.nm_kabupaten}</div>
            )}
            {selectedKecamatan && (
              <div><span className="font-medium">Kecamatan:</span> {selectedKecamatan.nm_kecamatan}</div>
            )}
            {selectedKelurahan && (
              <div><span className="font-medium">Kelurahan:</span> {selectedKelurahan.nm_kelurahan}</div>
            )}
          </div>
        </div>
      )} */}

      {/* Reset Button */}
      {showResetButton && (selectedProvinsiId || selectedKabupatenId || selectedKecamatanId || selectedKelurahanId) && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
          >
            Reset Selections
          </Button>
        </div>
      )}
    </div>
  );
};
