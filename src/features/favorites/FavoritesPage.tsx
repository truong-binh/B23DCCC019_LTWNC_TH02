import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, HeartOff, Play } from 'lucide-react';
import { SONGS } from '../../data/songs';
import { formatDuration } from '../../utils/format';
import { usePlayerStore } from '../player/usePlayerStore';
import { useFavoritesStore } from './useFavoritesStore';

export default function FavoritesPage() {
  const ids = useFavoritesStore((s) => s.ids);
  const toggle = useFavoritesStore((s) => s.toggle);
  const playQueue = usePlayerStore((s) => s.playQueue);
  const currentSongId = usePlayerStore((s) =>
    s.currentIndex >= 0 ? s.queue[s.currentIndex]?.id : undefined,
  );

  const favoriteSongs = useMemo(() => {
    const idSet = new Set(ids);
    return SONGS.filter((song) => idSet.has(song.id));
  }, [ids]);

  return (
    <section>
      <header className="page-head">
        <p className="page-head__kicker">Bộ sưu tập của bạn</p>
        <h1 className="page-head__title">Yêu thích</h1>
        <p className="page-head__subtitle">
          {favoriteSongs.length > 0
            ? `${favoriteSongs.length} bài hát bạn đã đánh dấu yêu thích.`
            : 'Nơi lưu lại những bài hát bạn yêu thích nhất.'}
        </p>
      </header>

      {favoriteSongs.length > 0 ? (
        <>
          <div className="page-actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => playQueue(favoriteSongs, 0)}
            >
              <Play size={16} aria-hidden="true" />
              Phát tất cả
            </button>
          </div>
          <ul className="track-list">
            {favoriteSongs.map((song, index) => (
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
                    onClick={() => playQueue(favoriteSongs, index)}
                  >
                    <Play size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label="Bỏ yêu thích"
                    title="Bỏ yêu thích"
                    onClick={() => toggle(song.id)}
                  >
                    <HeartOff size={16} aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="empty-state">
          <span className="empty-state__icon">
            <Heart size={28} aria-hidden="true" />
          </span>
          <p className="empty-state__title">Bạn chưa có bài hát yêu thích.</p>
          <p className="empty-state__hint">
            Bấm vào biểu tượng trái tim ở một bài hát trong thư viện để lưu lại
            đây.
          </p>
          <Link to="/" className="btn empty-state__action">
            Khám phá thư viện
          </Link>
        </div>
      )}
    </section>
  );
}
