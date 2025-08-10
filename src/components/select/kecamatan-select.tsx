'use client';
import React, { useEffect, useCallback } from 'react';
import { useLocationStore } from '../../store/locationStore';
import { SearchableSelect } from './SearchableSelect';
import { SelectOption, LocationItem } from '../../types/location';

interface KecamatanSelectProps {
  selectedProvinsiId: string;
  selectedKabupatenId: string;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const KecamatanSelect: React.FC<KecamatanSelectProps> = ({
  selectedProvinsiId,
  selectedKabupatenId,
  value,
  onChange,
  disabled,
}) => {
  const { 
    kecamatan, 
    loadingKecamatan, 
    fetchKecamatan 
  } = useLocationStore();

  // Fetch kecamatan when provinsi and kabupaten are selected
  const fetchData = useCallback(() => {
    if (selectedProvinsiId && selectedKabupatenId) {
      fetchKecamatan(selectedProvinsiId, selectedKabupatenId);
    }
  }, [selectedProvinsiId, selectedKabupatenId, fetchKecamatan]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const kecamatanOptions: SelectOption[] = kecamatan.map((item: LocationItem) => ({
    value: item.kd_kecamatan || '',
    label: item.nm_kecamatan || '',
    data: item,
  }));

  const selectedOption = value ? kecamatanOptions.find(opt => opt.value === value) || null : null;

  const handleChange = (option: SelectOption | null) => {
    onChange(option?.value || '');
  };

  return (
    <SearchableSelect
      options={kecamatanOptions}
      value={selectedOption}
      onChange={handleChange}
      placeholder="Pilih Kecamatan"
      loading={loadingKecamatan}
      disabled={disabled || !selectedProvinsiId || !selectedKabupatenId}
    />
  );
};

export default KecamatanSelect;
