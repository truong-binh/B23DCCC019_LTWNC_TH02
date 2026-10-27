import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { FixedSizeList } from 'react-window';
import type { ListChildComponentProps } from 'react-window';
import { GENRES, SONGS } from '../../data/songs';
import type { Genre, Song } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';
import { usePlayerStore } from '../player/usePlayerStore';
import { useFavoritesStore } from '../favorites/useFavoritesStore';
import { usePlaylistDispatch, usePlaylists } from '../playlists/PlaylistContext';
import SongRow from './SongRow';

type GenreFilter = Genre | 'all';
type SortOption = 'default' | 'title' | 'duration';

const LIST_HEIGHT = 560;
const ROW_HEIGHT = 56;

interface LibraryItemData {
  songs: Song[];
  favoriteIds: string[];
  currentSongId: string | undefined;
  isPlaying: boolean;
  playlistDisabled: boolean;
  onPlay: (song: Song, index: number) => void;
  onToggleFavorite: (id: string) => void;
  onAddToQueue: (song: Song) => void;
  onAddToPlaylist: (song: Song) => void;
}

function LibraryRow({ index, style, data }: ListChildComponentProps<LibraryItemData>) {
  const song = data.songs[index];
  return (
    <SongRow
      song={song}
      index={index}
      style={style}
      isFavorite={data.favoriteIds.includes(song.id)}
      isCurrent={song.id === data.currentSongId}
      isPlaying={data.isPlaying}
      playlistDisabled={data.playlistDisabled}
      onPlay={data.onPlay}
      onToggleFavorite={data.onToggleFavorite}
      onAddToQueue={data.onAddToQueue}
      onAddToPlaylist={data.onAddToPlaylist}
    />
  );
}

export default function LibraryPage() {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState<GenreFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const debouncedQuery = useDebounce(query, 300);

  const handleQueryShift = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const visibleSongs = useMemo(() => {
    const keyword = debouncedQuery.trim().toLowerCase();
    const filtered = SONGS.filter((song) => {
      if (genre !== 'all' && song.genre !== genre) return false;
      if (keyword === '') return true;
      return (
        song.title.toLowerCase().includes(keyword) ||
        song.artist.toLowerCase().includes(keyword)
      );
    });
    if (sortBy === 'title') {
      return [...filtered].sort((a, b) => a.title.localeCompare(b.title, 'vi'));
    }
    if (sortBy === 'duration') {
      return [...filtered].sort((a, b) => a.duration - b.duration);
    }
    return filtered;
  }, [debouncedQuery, genre, sortBy]);

  const playQueue = usePlayerStore((s) => s.playQueue);
  const addToQueue = usePlayerStore((s) => s.addToQueue);
  const currentSongId = usePlayerStore((s) =>
    s.currentIndex >= 0 ? s.queue[s.currentIndex]?.id : undefined,
  );
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const favoriteIds = useFavoritesStore((s) => s.ids);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);

  const playlists = usePlaylists();
  const playlistDispatch = usePlaylistDispatch();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [playlistNotice, setPlaylistNotice] = useState('');

  // Nếu playlist đang chọn bị xóa thì tự lùi về playlist đầu tiên còn lại.
  const effectivePlaylistId = playlists.some((p) => p.id === selectedPlaylistId)
    ? selectedPlaylistId
    : (playlists[0]?.id ?? '');

  useEffect(() => {
    if (playlistNotice === '') return;
    const timer = setTimeout(() => setPlaylistNotice(''), 4000);
    return () => clearTimeout(timer);
  }, [playlistNotice]);

  // Hàng đợi khi bấm Phát là đúng danh sách đang hiển thị (đã lọc + sắp xếp).
  const handlePlay = useCallback(
    (_song: Song, index: number) => {
      playQueue(visibleSongs, index);
    },
    [playQueue, visibleSongs],
  );

  const handleAddToPlaylist = useCallback(
    (song: Song) => {
      const target = playlists.find((p) => p.id === effectivePlaylistId);
      if (!target) return;
      if (target.songIds.includes(song.id)) {
        setPlaylistNotice(
          `“${song.title}” đã có sẵn trong playlist “${target.name}”.`,
        );
        return;
      }
      playlistDispatch({
        type: 'addSong',
        playlistId: target.id,
        songId: song.id,
      });
      setPlaylistNotice(`Đã thêm “${song.title}” vào playlist “${target.name}”.`);
    },
    [playlists, effectivePlaylistId, playlistDispatch],
  );

  const itemData = useMemo<LibraryItemData>(
    () => ({
      songs: visibleSongs,
      favoriteIds,
      currentSongId,
      isPlaying,
      playlistDisabled: playlists.length === 0,
      onPlay: handlePlay,
      onToggleFavorite: toggleFavorite,
      onAddToQueue: addToQueue,
      onAddToPlaylist: handleAddToPlaylist,
    }),
    [
      visibleSongs,
      favoriteIds,
      currentSongId,
      isPlaying,
      playlists.length,
      handlePlay,
      toggleFavorite,
      addToQueue,
      handleAddToPlaylist,
    ],
  );

  const itemKey = useCallback(
    (index: number, data: LibraryItemData) => data.songs[index].id,
    [],
  );

  return (
    <section className="library">
      <header className="page-head">
        <p className="page-head__kicker">Kho nhạc mô phỏng</p>
        <h1 className="page-head__title">Thư viện</h1>
        <p className="page-head__subtitle">
          10.000 bản thu được sinh tự động — tìm kiếm, lọc theo thể loại và
          phát ngay từ danh sách.
        </p>
      </header>

      <div className="library__controls">
        <div className="field field--search">
          <label className="field__label" htmlFor="library-search">
            Tìm kiếm
          </label>
          <input
            id="library-search"
            className="field__input"
            type="search"
            placeholder="Tên bài hát hoặc ca sĩ…"
            value={query}
            onChange={handleQueryShift}
            autoComplete="off"
          />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="library-genre">
            Thể loại
          </label>
          <select
            id="library-genre"
            className="field__input"
            value={genre}
            onChange={(e) => setGenre(e.target.value as GenreFilter)}
          >
            <option value="all">Tất cả</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="field__label" htmlFor="library-sort">
            Sắp xếp
          </label>
          <select
            id="library-sort"
            className="field__input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="default">Mặc định</option>
            <option value="title">Tên A–Z</option>
            <option value="duration">Thời lượng tăng dần</option>
          </select>
        </div>
        <div className="field">
          <label className="field__label" htmlFor="library-playlist">
            Playlist đang chọn
          </label>
          <select
            id="library-playlist"
            className="field__input"
            value={effectivePlaylistId}
            onChange={(e) => setSelectedPlaylistId(e.target.value)}
            disabled={playlists.length === 0}
          >
            {playlists.length === 0 ? (
              <option value="">Chưa có playlist</option>
            ) : (
              playlists.map((playlist) => (
                <option key={playlist.id} value={playlist.id}>
                  {playlist.name}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      <p className="library__status" role="status">
        {playlistNotice}
      </p>

      {visibleSongs.length > 0 && (
        <p className="library__count" role="status">
          Tìm thấy {visibleSongs.length} bài hát
        </p>
      )}

      {visibleSongs.length > 0 ? (
        <div className="song-list">
          <div className="song-list__head" aria-hidden="true">
            <span className="song-row__index">#</span>
            <span className="song-list__head-art" />
            <span className="song-list__head-title">Bài hát</span>
            <span>Thể loại</span>
            <span className="song-row__duration">Thời lượng</span>
            <span className="song-list__head-actions" />
          </div>
          <FixedSizeList
            height={LIST_HEIGHT}
            width="100%"
            itemCount={visibleSongs.length}
            itemSize={ROW_HEIGHT}
            itemData={itemData}
            itemKey={itemKey}
          >
            {LibraryRow}
          </FixedSizeList>
        </div>
      ) : (
        <div className="empty-state">
          <p className="empty-state__title">Không tìm thấy bài hát nào</p>
          <p className="empty-state__hint">
            Thử từ khóa khác hoặc chọn lại thể loại để xem thêm kết quả.
          </p>
        </div>
      )}
    </section>
  );
}
