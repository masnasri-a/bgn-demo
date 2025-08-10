

import React, { useEffect, useCallback } from 'react';
import { useLocationStore } from '../../store/locationStore';
import { SearchableSelect } from './SearchableSelect';
import { SelectOption, LocationItem } from '../../types/location';

interface KabupatenSelectProps {
  selectedProvinsiId: string;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const KabupatenSelect: React.FC<KabupatenSelectProps> = ({
  selectedProvinsiId,
  value,
  onChange,
  disabled,
}) => {
  const { 
    kabupaten, 
    loadingKabupaten, 
    fetchKabupaten 
  } = useLocationStore();

  // Fetch kabupaten when provinsi is selected
  const fetchData = useCallback(() => {
    if (selectedProvinsiId) {
      fetchKabupaten(selectedProvinsiId);
    }
  }, [selectedProvinsiId, fetchKabupaten]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const kabupatenOptions: SelectOption[] = kabupaten.map((item: LocationItem) => ({
    value: item.kd_kabupaten || '',
    label: item.nm_kabupaten || '',
    data: item,
  }));

  const selectedOption = value ? kabupatenOptions.find(opt => opt.value === value) || null : null;

  const handleChange = (option: SelectOption | null) => {
    onChange(option?.value || '');
  };

  return (
    <SearchableSelect
      options={kabupatenOptions}
      value={selectedOption}
      onChange={handleChange}
      placeholder="Pilih Kabupaten/Kota"
      loading={loadingKabupaten}
      disabled={disabled || !selectedProvinsiId}
    />
  );
};

export default KabupatenSelect;