// Location data interfaces
export interface LocationItem {
  kd_propinsi?: string;
  kd_kabupaten?: string;
  kd_kecamatan?: string;
  kd_kelurahan?: string;
  nm_propinsi?: string;
  nm_kabupaten?: string;
  nm_kecamatan?: string;
  nm_kelurahan?: string;
  id?: string;
  name?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  data: LocationItem;
}

export interface LocationSelection {
  provinsi: LocationItem | null;
  kabupaten: LocationItem | null;
  kecamatan: LocationItem | null;
  kelurahan: LocationItem | null;
}

// Callback type for location changes
export type LocationChangeCallback = (location: LocationSelection) => void;

// Callback type for individual select changes
export type SelectChangeCallback = (item: LocationItem | null) => void;
