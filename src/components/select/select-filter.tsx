"use client"
import { create } from 'zustand';

interface SelectFilterState {
    selectedFilter: string;
    setSelectedFilter: (filter: string) => void;
}

const useSelectFilterStore = create<SelectFilterState>((set) => ({
    selectedFilter: 'Laporan Permasalahan',
    setSelectedFilter: (filter) => set({ selectedFilter: filter }),
}));

const SelectFilter = () => {
    const { selectedFilter, setSelectedFilter } = useSelectFilterStore();

    const options = [
        'Laporan Permasalahan',
        'Laporan Progress',
        'Laporan Informasi'
    ];

    return (
        <select 
            value={selectedFilter} 
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer shadow-sm"
        >
            {options.map((option) => (
            <option key={option} value={option}>
                {option}
            </option>
            ))}
        </select>
    );
};

export default SelectFilter;
export { useSelectFilterStore };