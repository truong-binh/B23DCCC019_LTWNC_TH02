import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FavoritesState {
  ids: string[];
  toggle: (id: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const { ids } = get();
        set({
          ids: ids.includes(id)
            ? ids.filter((favoriteId) => favoriteId !== id)
            : [...ids, id],
        });
      },
    }),
    { name: 'music-favorites' },
  ),
);
