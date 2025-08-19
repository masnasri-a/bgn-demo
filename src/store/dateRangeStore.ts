import { create } from "zustand";

interface DateRangeState {
  startDate?: string;
  endDate?: string;
  setStartDate: (date?: string) => void;
  setEndDate: (date?: string) => void;
}

export const useDateRangeStore = create<DateRangeState>((set) => ({
  startDate: undefined,
  endDate: undefined,
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
}));
