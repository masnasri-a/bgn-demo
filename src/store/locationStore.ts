import { create } from 'zustand';

interface LocationItem {
  kd_propinsi?: string;
  kd_kabupaten?: string;
  kd_kecamatan?: string;
  kd_kelurahan?: string;
  nm_propinsi?: string;
  nm_kabupaten?: string;
  nm_kecamatan?: string;
  nm_kelurahan?: string;
}

interface LocationState {
  // Data arrays
  provinsi: LocationItem[];
  kabupaten: LocationItem[];
  kecamatan: LocationItem[];
  kelurahan: LocationItem[];
  
  // Selected values
  selectedProvinsi: LocationItem | null;
  selectedKabupaten: LocationItem | null;
  selectedKecamatan: LocationItem | null;
  selectedKelurahan: LocationItem | null;
  
  // Loading states
  loadingProvinsi: boolean;
  loadingKabupaten: boolean;
  loadingKecamatan: boolean;
  loadingKelurahan: boolean;
  
  // Error states
  errorProvinsi: string | null;
  errorKabupaten: string | null;
  errorKecamatan: string | null;
  errorKelurahan: string | null;
  
  // Actions
  fetchProvinsi: () => Promise<void>;
  fetchKabupaten: (kd_propinsi: string) => Promise<void>;
  fetchKecamatan: (kd_propinsi: string, kd_kabupaten: string) => Promise<void>;
  fetchKelurahan: (kd_propinsi: string, kd_kabupaten: string, kd_kecamatan: string) => Promise<void>;
  
  setSelectedProvinsi: (provinsi: LocationItem | null) => void;
  setSelectedKabupaten: (kabupaten: LocationItem | null) => void;
  setSelectedKecamatan: (kecamatan: LocationItem | null) => void;
  setSelectedKelurahan: (kelurahan: LocationItem | null) => void;
  
  resetSelections: () => void;
  resetKabupatenAndBelow: () => void;
  resetKecamatanAndBelow: () => void;
  resetKelurahan: () => void;
}

const BASE_URL = 'https://bgn-be.anakanjeng.site/locations/list';

export const useLocationStore = create<LocationState>((set, get) => ({
  // Initial state
  provinsi: [],
  kabupaten: [],
  kecamatan: [],
  kelurahan: [],
  
  selectedProvinsi: null,
  selectedKabupaten: null,
  selectedKecamatan: null,
  selectedKelurahan: null,
  
  loadingProvinsi: false,
  loadingKabupaten: false,
  loadingKecamatan: false,
  loadingKelurahan: false,
  
  errorProvinsi: null,
  errorKabupaten: null,
  errorKecamatan: null,
  errorKelurahan: null,
  
  // Fetch provinsi (no parameters needed)
  fetchProvinsi: async () => {
    set({ loadingProvinsi: true, errorProvinsi: null });
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      set({ 
        provinsi: data.data || data || [], 
        loadingProvinsi: false 
      });
    } catch (error) {
      set({ 
        errorProvinsi: error instanceof Error ? error.message : 'Failed to fetch provinsi',
        loadingProvinsi: false 
      });
    }
  },
  
  // Fetch kabupaten (requires kd_propinsi)
  fetchKabupaten: async (kd_propinsi: string) => {
    set({ loadingKabupaten: true, errorKabupaten: null });
    try {
      const response = await fetch(`${BASE_URL}?kd_propinsi=${kd_propinsi}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      set({ 
        kabupaten: data.data || data || [], 
        loadingKabupaten: false 
      });
    } catch (error) {
      set({ 
        errorKabupaten: error instanceof Error ? error.message : 'Failed to fetch kabupaten',
        loadingKabupaten: false 
      });
    }
  },
  
  // Fetch kecamatan (requires kd_propinsi and kd_kabupaten)
  fetchKecamatan: async (kd_propinsi: string, kd_kabupaten: string) => {
    set({ loadingKecamatan: true, errorKecamatan: null });
    try {
      const response = await fetch(`${BASE_URL}?kd_propinsi=${kd_propinsi}&kd_kabupaten=${kd_kabupaten}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      set({ 
        kecamatan: data.data || data || [], 
        loadingKecamatan: false 
      });
    } catch (error) {
      set({ 
        errorKecamatan: error instanceof Error ? error.message : 'Failed to fetch kecamatan',
        loadingKecamatan: false 
      });
    }
  },
  
  // Fetch kelurahan (requires kd_propinsi, kd_kabupaten, and kd_kecamatan)
  fetchKelurahan: async (kd_propinsi: string, kd_kabupaten: string, kd_kecamatan: string) => {
    set({ loadingKelurahan: true, errorKelurahan: null });
    try {
      const response = await fetch(`${BASE_URL}?kd_propinsi=${kd_propinsi}&kd_kabupaten=${kd_kabupaten}&kd_kecamatan=${kd_kecamatan}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      set({ 
        kelurahan: data.data || data || [], 
        loadingKelurahan: false 
      });
    } catch (error) {
      set({ 
        errorKelurahan: error instanceof Error ? error.message : 'Failed to fetch kelurahan',
        loadingKelurahan: false 
      });
    }
  },
  
  // Selection setters
  setSelectedProvinsi: (provinsi: LocationItem | null) => {
    set({ selectedProvinsi: provinsi });
    get().resetKabupatenAndBelow();
  },
  
  setSelectedKabupaten: (kabupaten: LocationItem | null) => {
    set({ selectedKabupaten: kabupaten });
    get().resetKecamatanAndBelow();
  },
  
  setSelectedKecamatan: (kecamatan: LocationItem | null) => {
    set({ selectedKecamatan: kecamatan });
    get().resetKelurahan();
  },
  
  setSelectedKelurahan: (kelurahan: LocationItem | null) => {
    set({ selectedKelurahan: kelurahan });
  },
  
  // Reset functions
  resetSelections: () => {
    set({
      selectedProvinsi: null,
      selectedKabupaten: null,
      selectedKecamatan: null,
      selectedKelurahan: null,
      kabupaten: [],
      kecamatan: [],
      kelurahan: []
    });
  },
  
  resetKabupatenAndBelow: () => {
    set({
      selectedKabupaten: null,
      selectedKecamatan: null,
      selectedKelurahan: null,
      kabupaten: [],
      kecamatan: [],
      kelurahan: []
    });
  },
  
  resetKecamatanAndBelow: () => {
    set({
      selectedKecamatan: null,
      selectedKelurahan: null,
      kecamatan: [],
      kelurahan: []
    });
  },
  
  resetKelurahan: () => {
    set({
      selectedKelurahan: null,
      kelurahan: []
    });
  }
}));
