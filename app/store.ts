import { create } from 'zustand';

interface RandomStore {
  items: string[];
  setItems: (items: string[]) => void;
}

export const useRandomStore = create<RandomStore>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
}));
