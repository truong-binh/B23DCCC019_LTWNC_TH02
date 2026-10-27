import { create } from 'zustand';
import type { Song } from '../../types';

export interface PlayerState {
  queue: Song[];
  currentIndex: number; // -1 khi chưa phát bài nào
  isPlaying: boolean;
  position: number; // vị trí phát hiện tại, tính bằng giây
  playQueue: (songs: Song[], startIndex: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  addToQueue: (song: Song) => void;
  tick: () => void;
}

export const usePlayerStore = create<PlayerState>()((set, get) => ({
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  position: 0,

  playQueue: (songs, startIndex) => {
    if (songs.length === 0) {
      set({ queue: [], currentIndex: -1, isPlaying: false, position: 0 });
      return;
    }
    // startIndex không hợp lệ được kẹp về trong phạm vi hàng đợi
    const safeIndex = Math.min(Math.max(startIndex, 0), songs.length - 1);
    set({
      queue: songs,
      currentIndex: safeIndex,
      isPlaying: true,
      position: 0,
    });
  },

  togglePlay: () => {
    const { queue, currentIndex, isPlaying } = get();
    if (currentIndex < 0 || currentIndex >= queue.length) return;
    set({ isPlaying: !isPlaying });
  },

  next: () => {
    const { queue, currentIndex } = get();
    if (currentIndex < 0) return;
    if (currentIndex < queue.length - 1) {
      set({ currentIndex: currentIndex + 1, position: 0 });
    } else {
      // Bài cuối: dừng phát, không cho index vượt quá hàng đợi
      set({ isPlaying: false, position: 0 });
    }
  },

  prev: () => {
    const { currentIndex, position } = get();
    if (currentIndex < 0) return;
    if (position > 3) {
      set({ position: 0 });
      return;
    }
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1, position: 0 });
    } else {
      set({ position: 0 });
    }
  },

  addToQueue: (song) => {
    const { queue } = get();
    if (queue.some((item) => item.id === song.id)) return;
    set({ queue: [...queue, song] });
  },

  tick: () => {
    const { isPlaying, queue, currentIndex, position } = get();
    if (!isPlaying || currentIndex < 0) return;
    const currentSong = queue[currentIndex];
    if (!currentSong) return;
    const nextPosition = position + 1;
    if (nextPosition >= currentSong.duration) {
      get().next();
    } else {
      set({ position: nextPosition });
    }
  },
}));
