'use client';
import React, { useEffect, useCallback } from 'react';
import { useLocationStore } from '../../store/locationStore';
import { SearchableSelect } from './SearchableSelect';
import { SelectOption, LocationItem } from '../../types/location';

interface KelurahanSelectProps {
  selectedProvinsiId: string;
  selectedKabupatenId: string;
  selectedKecamatanId: string;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const KelurahanSelect: React.FC<KelurahanSelectProps> = ({
  selectedProvinsiId,
  selectedKabupatenId,
  selectedKecamatanId,
  value,
  onChange,
  disabled,
}) => {
  const { 
    kelurahan, 
    loadingKelurahan, 
    fetchKelurahan 
  } = useLocationStore();

  // Fetch kelurahan when provinsi, kabupaten, and kecamatan are selected
  const fetchData = useCallback(() => {
    if (selectedProvinsiId && selectedKabupatenId && selectedKecamatanId) {
      fetchKelurahan(selectedProvinsiId, selectedKabupatenId, selectedKecamatanId);
    }
  }, [selectedProvinsiId, selectedKabupatenId, selectedKecamatanId, fetchKelurahan]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const kelurahanOptions: SelectOption[] = kelurahan.map((item: LocationItem) => ({
    value: item.kd_kelurahan || '',
    label: item.nm_kelurahan || '',
    data: item,
  }));

  const selectedOption = value ? kelurahanOptions.find(opt => opt.value === value) || null : null;

  const handleChange = (option: SelectOption | null) => {
    onChange(option?.value || '');
  };

  return (
    <SearchableSelect
      options={kelurahanOptions}
      value={selectedOption}
      onChange={handleChange}
      placeholder="Pilih Kelurahan/Desa"
      loading={loadingKelurahan}
      disabled={disabled || !selectedProvinsiId || !selectedKabupatenId || !selectedKecamatanId}
    />
  );
};

export default KelurahanSelect;
