import { memo } from 'react';
import type { CSSProperties } from 'react';
import { Heart, ListEnd, ListPlus, Play } from 'lucide-react';
import type { Song } from '../../types';
import { formatDuration } from '../../utils/format';

export interface SongRowProps {
  song: Song;
  index: number;
  isFavorite: boolean;
  isCurrent: boolean;
  /** Trạng thái phát của player — chỉ dùng cho hiệu ứng ở bài hiện tại. */
  isPlaying: boolean;
  /** true khi chưa có playlist nào để thêm bài vào. */
  playlistDisabled: boolean;
  style?: CSSProperties;
  onPlay: (song: Song, index: number) => void;
  onToggleFavorite: (id: string) => void;
  onAddToQueue: (song: Song) => void;
  onAddToPlaylist: (song: Song) => void;
}

/**
 * Một dòng bài hát trong danh sách ảo hóa. Được bọc React.memo để
 * không render lại khi props không đổi (ví dụ trong lúc đang gõ tìm kiếm).
 */
const SongRow = memo(function SongRow({
  song,
  index,
  isFavorite,
  isCurrent,
  isPlaying,
  playlistDisabled,
  style,
  onPlay,
  onToggleFavorite,
  onAddToQueue,
  onAddToPlaylist,
}: SongRowProps) {
  return (
    <div
      style={style}
      className={isCurrent ? 'song-row song-row--current' : 'song-row'}
    >
      <span className="song-row__index" aria-hidden="true">
        {isCurrent ? (
          <span className={isPlaying ? 'eq' : 'eq eq--paused'}>
            <i />
            <i />
            <i />
          </span>
        ) : (
          index + 1
        )}
      </span>
      <span
        className={`song-art song-art--${song.genre.toLowerCase()}`}
        aria-hidden="true"
      >
        {song.title.charAt(0)}
      </span>
      <div className="song-row__names">
        <span className="song-row__title">{song.title}</span>
        <span className="song-row__artist">{song.artist}</span>
      </div>
      <span className="song-row__genre">
        <span className={`chip chip--${song.genre.toLowerCase()}`}>
          {song.genre}
        </span>
      </span>
      <span className="song-row__duration">{formatDuration(song.duration)}</span>
      <div className="song-row__actions">
        <button
          type="button"
          className="icon-btn icon-btn--play"
          aria-label={`Phát ${song.title}`}
          title="Phát"
          onClick={() => onPlay(song, index)}
        >
          <Play size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={isFavorite ? 'icon-btn icon-btn--fav is-on' : 'icon-btn icon-btn--fav'}
          aria-label={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          aria-pressed={isFavorite}
          title={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          onClick={() => onToggleFavorite(song.id)}
        >
          <Heart size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="icon-btn"
          aria-label={`Thêm ${song.title} vào hàng đợi`}
          title="Thêm vào hàng đợi"
          onClick={() => onAddToQueue(song)}
        >
          <ListEnd size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="icon-btn"
          aria-label={`Thêm ${song.title} vào playlist`}
          title={
            playlistDisabled
              ? 'Hãy tạo playlist trước'
              : 'Thêm vào playlist đang chọn'
          }
          disabled={playlistDisabled}
          onClick={() => onAddToPlaylist(song)}
        >
          <ListPlus size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
});

export default SongRow;
