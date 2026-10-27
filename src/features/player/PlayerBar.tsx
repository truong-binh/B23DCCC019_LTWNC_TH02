import { useEffect } from 'react';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { usePlayerStore } from './usePlayerStore';
import ProgressBar from './ProgressBar';

/**
 * Thanh phát nhạc cố định ở đáy mọi trang. Chỉ dùng các selector hẹp
 * (isPlaying, bài hiện tại, độ dài hàng đợi) nên không render lại mỗi giây;
 * phần thời gian/tiến trình nằm riêng trong ProgressBar.
 */
export default function PlayerBar() {
  const currentSong = usePlayerStore((s) =>
    s.currentIndex >= 0 ? s.queue[s.currentIndex] : undefined,
  );
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const queueLength = usePlayerStore((s) => s.queue.length);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const next = usePlayerStore((s) => s.next);
  const prev = usePlayerStore((s) => s.prev);

  // Đồng hồ mô phỏng: chỉ chạy khi đang phát, dọn dẹp bằng clearInterval.
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      usePlayerStore.getState().tick();
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const hasSong = currentSong !== undefined;

  return (
    <footer className="player-bar">
      <div className="player-bar__inner">
        <div className="player-bar__track" aria-live="polite">
          {hasSong ? (
            <>
              <span
                className={`song-art song-art--${currentSong.genre.toLowerCase()}`}
                aria-hidden="true"
              >
                {currentSong.title.charAt(0)}
              </span>
              <div className="player-bar__text">
                <p className="player-bar__title">
                  Đang phát: {currentSong.title} – {currentSong.artist}
                </p>
                <span className="player-bar__sub">
                  <span
                    className={isPlaying ? 'eq' : 'eq eq--paused'}
                    aria-hidden="true"
                  >
                    <i />
                    <i />
                    <i />
                  </span>
                  {currentSong.genre}
                </span>
              </div>
            </>
          ) : (
            <p className="player-bar__idle">Chưa phát bài nào</p>
          )}
        </div>

        <div className="player-bar__controls">
          <button
            type="button"
            className="player-bar__btn"
            aria-label="Bài trước"
            title="Bài trước"
            onClick={prev}
            disabled={!hasSong}
          >
            <SkipBack size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="player-bar__btn player-bar__btn--main"
            aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}
            title={isPlaying ? 'Tạm dừng' : 'Phát'}
            onClick={togglePlay}
            disabled={!hasSong}
          >
            {isPlaying ? (
              <Pause size={20} aria-hidden="true" />
            ) : (
              <Play size={20} aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            className="player-bar__btn"
            aria-label="Bài sau"
            title="Bài sau"
            onClick={next}
            disabled={!hasSong}
          >
            <SkipForward size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="player-bar__meta">
          <ProgressBar />
          <p className="player-bar__queue">Hàng đợi: {queueLength} bài</p>
        </div>
      </div>
    </footer>
  );
}
