import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Music, Play, X } from 'lucide-react';
import { SONGS } from '../../data/songs';
import type { Song } from '../../types';
import { formatDuration } from '../../utils/format';
import { usePlayerStore } from '../player/usePlayerStore';
import { usePlaylistDispatch, usePlaylists } from './PlaylistContext';

const SONG_BY_ID = new Map(SONGS.map((song) => [song.id, song]));

export default function PlaylistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();
  const playQueue = usePlayerStore((s) => s.playQueue);
  const currentSongId = usePlayerStore((s) =>
    s.currentIndex >= 0 ? s.queue[s.currentIndex]?.id : undefined,
  );

  const playlist = playlists.find((item) => item.id === id);

  // Bỏ qua các id không còn tồn tại trong kho nhạc (dữ liệu lưu có thể cũ).
  const songs = useMemo(() => {
    if (!playlist) return [];
    return playlist.songIds
      .map((songId) => SONG_BY_ID.get(songId))
      .filter((song): song is Song => song !== undefined);
  }, [playlist]);

  if (!playlist) {
    return (
      <section>
        <header className="page-head">
          <h1 className="page-head__title">Không tìm thấy playlist</h1>
          <p className="page-head__subtitle">
            Playlist này không tồn tại hoặc đã bị xóa.
          </p>
        </header>
        <Link to="/playlists" className="btn">
          Quay lại danh sách playlist
        </Link>
      </section>
    );
  }

  const totalSeconds = songs.reduce((total, song) => total + song.duration, 0);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const remainSeconds = totalSeconds % 60;

  return (
    <section>
      <header className="page-head">
        <p className="page-head__kicker">Playlist</p>
        <h1 className="page-head__title">{playlist.name}</h1>
        <p className="page-head__subtitle">
          {songs.length} bài · Tổng thời lượng: {totalMinutes} phút{' '}
          {remainSeconds} giây
        </p>
      </header>

      {songs.length > 0 ? (
        <>
          <div className="page-actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => playQueue(songs, 0)}
            >
              <Play size={16} aria-hidden="true" />
              Phát tất cả
            </button>
            <Link to="/playlists" className="btn">
              Tất cả playlist
            </Link>
          </div>
          <ul className="track-list">
            {songs.map((song, index) => (
              <li
                key={song.id}
                className={
                  song.id === currentSongId
                    ? 'track-list__item song-row--current'
                    : 'track-list__item'
                }
              >
                <span className="song-row__index" aria-hidden="true">
                  {index + 1}
                </span>
                <span
                  className={`song-art song-art--${song.genre.toLowerCase()}`}
                  aria-hidden="true"
                >
                  {song.title.charAt(0)}
                </span>
                <div className="song-row__names">
                  <span className="song-row__title">{song.title}</span>
                  <span className="song-row__artist">
                    {song.artist} · {song.genre}
                  </span>
                </div>
                <span className="song-row__duration">
                  {formatDuration(song.duration)}
                </span>
                <div className="song-row__actions">
                  <button
                    type="button"
                    className="icon-btn icon-btn--play"
                    aria-label={`Phát ${song.title}`}
                    title="Phát"
                    onClick={() => playQueue(songs, index)}
                  >
                    <Play size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label={`Bỏ ${song.title} khỏi playlist`}
                    title="Bỏ khỏi playlist"
                    onClick={() =>
                      dispatch({
                        type: 'removeSong',
                        playlistId: playlist.id,
                        songId: song.id,
                      })
                    }
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="empty-state">
          <span className="empty-state__icon">
            <Music size={28} aria-hidden="true" />
          </span>
          <p className="empty-state__title">Playlist này chưa có bài hát nào.</p>
          <p className="empty-state__hint">
            Sang trang Thư viện, chọn playlist “{playlist.name}” rồi bấm nút
            thêm vào playlist ở bài hát bạn muốn.
          </p>
          <Link to="/" className="btn empty-state__action">
            Mở thư viện
          </Link>
        </div>
      )}
    </section>
  );
}
