import { use } from 'react';
import { create } from 'zustand';

type ProvinceSelection = {
    kd_propinsi: string;
    nm_propinsi: string;
};

type ProvinceStore = {
    selected: ProvinceSelection | null;
    setSelected: (prov: ProvinceSelection) => void;
};

type KabupatenSelection = {
    kd_kabupaten: string;
    nm_kabupaten: string;
}

type KabupatenStore = {
    selected: KabupatenSelection | null;
    setSelected: (kab: KabupatenSelection) => void;
};

type KecamatanSelection = {
    kd_kecamatan: string;
    nm_kecamatan: string;
}

type KecamatanStore = {
    selected: KecamatanSelection | null;
    setSelected: (kec: KecamatanSelection) => void;
};

type KelurahanSelection = {
    kd_kelurahan: string;
    nm_kelurahan: string;
}

type KelurahanStore = {
    selected: KelurahanSelection | null;
    setSelected: (kel: KelurahanSelection) => void;
}

export const useProvinceStore = create<ProvinceStore>((set) => ({
    selected: null,
    setSelected: (prov) => {
        set({ selected: prov })
        useKabupatenStore.setState({ selected: null });
        useKecamatanStore.setState({ selected: null });
        useKelurahanStore.setState({ selected: null });
    }
}));

export const useKabupatenStore = create<KabupatenStore>((set) => ({
    selected: null,
    setSelected: (kab) => {
        set({ selected: kab })
        // Reset kecamatan selection
        useKecamatanStore.setState({ selected: null });
        useKelurahanStore.setState({ selected: null });
    }
}));

export const useKecamatanStore = create<KecamatanStore>((set) => ({
    selected: null,
    setSelected: (kec) => {
        set({ selected: kec })
        useKelurahanStore.setState({ selected: null });
    }
}));

export function useKabupatenDropdown() {
    const selected = useKabupatenStore((s) => s.selected);
    const setSelected = useKabupatenStore((s) => s.setSelected);

    return { selected, setSelected };
}

export const useKelurahanStore = create<KelurahanStore>((set) => ({
    selected: null,
    setSelected: (kel) => set({ selected: kel }),
}));

export function useKelurahanDropdown() {
    const selected = useKelurahanStore((s) => s.selected);
    const setSelected = useKelurahanStore((s) => s.setSelected);

    return { selected, setSelected };
}

// Custom hook for easier usage
export function useProvinceDropdown() {
    const selected = useProvinceStore((s) => s.selected);
    const setSelected = useProvinceStore((s) => s.setSelected);
    return { selected, setSelected };
}

// Custom hook for kecamatan
export function useKecamatanDropdown() {
    const selected = useKecamatanStore((s) => s.selected);
    const setSelected = useKecamatanStore((s) => s.setSelected);
    return { selected, setSelected };
}
