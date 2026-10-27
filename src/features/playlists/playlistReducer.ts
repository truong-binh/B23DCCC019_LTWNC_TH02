export interface Playlist {
  id: string;
  name: string;
  songIds: string[];
}

export type PlaylistAction =
  | { type: 'create'; id: string; name: string }
  | { type: 'rename'; id: string; name: string }
  | { type: 'remove'; id: string }
  | { type: 'addSong'; playlistId: string; songId: string }
  | { type: 'removeSong'; playlistId: string; songId: string };

/**
 * Reducer thuần cho danh sách playlist: không mutate state,
 * luôn trả về mảng/đối tượng mới khi có thay đổi.
 */
export function playlistReducer(
  state: Playlist[],
  action: PlaylistAction,
): Playlist[] {
  switch (action.type) {
    case 'create':
      return [...state, { id: action.id, name: action.name, songIds: [] }];

    case 'rename':
      return state.map((playlist) =>
        playlist.id === action.id
          ? { ...playlist, name: action.name }
          : playlist,
      );

    case 'remove':
      return state.filter((playlist) => playlist.id !== action.id);

    case 'addSong':
      return state.map((playlist) => {
        if (playlist.id !== action.playlistId) return playlist;
        if (playlist.songIds.includes(action.songId)) return playlist;
        return { ...playlist, songIds: [...playlist.songIds, action.songId] };
      });

    case 'removeSong':
      return state.map((playlist) =>
        playlist.id === action.playlistId
          ? {
              ...playlist,
              songIds: playlist.songIds.filter(
                (songId) => songId !== action.songId,
              ),
            }
          : playlist,
      );

    default:
      return state;
  }
}
