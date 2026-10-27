import { usePlayerStore } from './usePlayerStore';
import { formatDuration } from '../../utils/format';

/**
 * Component duy nhất subscribe `position` để phần còn lại của ứng dụng
 * không bị render lại mỗi giây khi nhạc đang chạy.
 */
export default function ProgressBar() {
  const position = usePlayerStore((s) => s.position);
  const duration = usePlayerStore((s) =>
    s.currentIndex >= 0 ? (s.queue[s.currentIndex]?.duration ?? 0) : 0,
  );

  const percent = duration > 0 ? Math.min((position / duration) * 100, 100) : 0;

  return (
    <div className="progress">
      <span className="progress__time">
        {formatDuration(position)} / {formatDuration(duration)}
      </span>
      <div
        className="progress__track"
        role="progressbar"
        aria-label="Tiến trình phát"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={position}
        aria-valuetext={`${formatDuration(position)} / ${formatDuration(duration)}`}
      >
        <div className="progress__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
