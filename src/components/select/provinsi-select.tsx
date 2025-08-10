"use client";

import React, { useEffect, useCallback } from 'react';
import { useLocationStore } from '../../store/locationStore';
import { SearchableSelect } from './SearchableSelect';
import { SelectOption, LocationItem, SelectChangeCallback } from '../../types/location';

interface ProvinsiSelectProps {
  className?: string;
  placeholder?: string;
  onSelectionChange?: SelectChangeCallback;
}

export const ProvinsiSelect: React.FC<ProvinsiSelectProps> = ({
  className = "",
  placeholder = "Pilih Provinsi",
  onSelectionChange
}) => {
  const {
    provinsi,
    selectedProvinsi,
    loadingProvinsi,
    errorProvinsi,
    fetchProvinsi,
    setSelectedProvinsi
  } = useLocationStore();

  // Fetch provinsi data on component mount
  const fetchData = useCallback(() => {
    if (provinsi.length === 0 && !loadingProvinsi) {
      fetchProvinsi();
    }
  }, [provinsi.length, loadingProvinsi, fetchProvinsi]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Convert provinsi data to select options
    const provinsiOptions: SelectOption[] = provinsi.map((item: LocationItem) => ({
    value: item.kd_propinsi || '',
    label: item.nm_propinsi || '',
    data: item,
  }));

  // Current selected value
  const selectedValue = selectedProvinsi ? {
    value: selectedProvinsi.kd_propinsi || '',
    label: selectedProvinsi.nm_propinsi || '',
    data: selectedProvinsi
  } : null;

  const handleChange = (option: any) => {
    const provinsiData = option?.data || null;
    setSelectedProvinsi(provinsiData);
    onSelectionChange?.(provinsiData);
  };

  return (
    <div className={className}>
      
      <SearchableSelect
        options={provinsiOptions}
        value={selectedValue}
        onChange={handleChange}
        placeholder={placeholder}
        loading={loadingProvinsi}
        error={errorProvinsi}
        searchPlaceholder="Cari provinsi..."
      />
    </div>
  );
};