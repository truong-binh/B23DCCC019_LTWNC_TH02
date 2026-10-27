import { createContext, useContext, useEffect, useReducer } from 'react';
import type { Dispatch, ReactNode } from 'react';
import { playlistReducer } from './playlistReducer';
import type { Playlist, PlaylistAction } from './playlistReducer';
import { withLogger } from './withLogger';

const STORAGE_KEY = 'music-playlists';

// Tách riêng hai Context: component chỉ cần dispatch sẽ không bị
// render lại khi danh sách playlist thay đổi.
const PlaylistStateContext = createContext<Playlist[] | undefined>(undefined);
const PlaylistDispatchContext = createContext<
  Dispatch<PlaylistAction> | undefined
>(undefined);

function isPlaylist(value: unknown): value is Playlist {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    Array.isArray(candidate.songIds) &&
    candidate.songIds.every((songId) => typeof songId === 'string')
  );
}

/**
 * Đọc playlist đã lưu từ localStorage. JSON hỏng hoặc dữ liệu sai cấu trúc
 * được bỏ qua an toàn thay vì làm crash ứng dụng.
 */
function loadPlaylists(): Playlist[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isPlaylist);
  } catch {
    return [];
  }
}

export function PlaylistProvider({ children }: { children: ReactNode }) {
  // Khởi tạo lười từ localStorage nên lần ghi đầu tiên không bao giờ
  // ghi đè dữ liệu đã lưu bằng mảng rỗng.
  const [playlists, dispatch] = useReducer(
    withLogger(playlistReducer),
    undefined,
    loadPlaylists,
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
    } catch {
      // localStorage đầy hoặc bị chặn: bỏ qua, ứng dụng vẫn chạy bình thường.
    }
  }, [playlists]);

  return (
    <PlaylistStateContext.Provider value={playlists}>
      <PlaylistDispatchContext.Provider value={dispatch}>
        {children}
      </PlaylistDispatchContext.Provider>
    </PlaylistStateContext.Provider>
  );
}

export function usePlaylists(): Playlist[] {
  const context = useContext(PlaylistStateContext);
  if (context === undefined) {
    throw new Error('usePlaylists phải được dùng bên trong <PlaylistProvider>.');
  }
  return context;
}

export function usePlaylistDispatch(): Dispatch<PlaylistAction> {
  const context = useContext(PlaylistDispatchContext);
  if (context === undefined) {
    throw new Error(
      'usePlaylistDispatch phải được dùng bên trong <PlaylistProvider>.',
    );
  }
  return context;
}
