import { memo, useCallback, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ListMusic, Trash2 } from 'lucide-react';
import { usePlaylistDispatch, usePlaylists } from './PlaylistContext';

interface CreatePlaylistFormProps {
  /** Trả về thông báo lỗi nếu tên không hợp lệ, ngược lại trả về null. */
  validateName: (name: string) => string | null;
}

/**
 * Form tạo playlist chỉ dùng PlaylistDispatchContext (và prop validateName
 * ổn định) nên không bị render lại khi danh sách playlist thay đổi.
 */
const CreatePlaylistForm = memo(function CreatePlaylistForm({
  validateName,
}: CreatePlaylistFormProps) {
  const dispatch = usePlaylistDispatch();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const validationError = validateName(trimmedName);
    if (validationError) {
      setError(validationError);
      return;
    }
    dispatch({
      type: 'create',
      id: `pl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: trimmedName,
    });
    setName('');
    setError(null);
  };

  return (
    <form className="playlist-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label className="field__label" htmlFor="playlist-name">
          Tên playlist
        </label>
        <input
          id="playlist-name"
          className="field__input"
          type="text"
          value={name}
          placeholder="Ví dụ: Nhạc chạy bộ…"
          onChange={(e) => setName(e.target.value)}
          aria-invalid={error !== null}
          aria-describedby={error ? 'playlist-name-error' : undefined}
          autoComplete="off"
        />
        {error && (
          <p id="playlist-name-error" className="field__error" role="alert">
            {error}
          </p>
        )}
      </div>
      <button type="submit" className="btn btn--primary">
        Tạo
      </button>
    </form>
  );
});

export default function PlaylistsPage() {
  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();

  // Đọc danh sách mới nhất qua ref để validateName luôn ổn định,
  // nhờ đó form (React.memo) không render lại khi danh sách đổi.
  const playlistsRef = useRef(playlists);
  playlistsRef.current = playlists;

  const validateName = useCallback((name: string): string | null => {
    if (name === '') {
      return 'Tên playlist không được để trống';
    }
    const normalized = name.toLowerCase();
    const isTaken = playlistsRef.current.some(
      (playlist) => playlist.name.toLowerCase() === normalized,
    );
    if (isTaken) {
      return 'Tên playlist đã tồn tại';
    }
    return null;
  }, []);

  return (
    <section>
      <header className="page-head">
        <p className="page-head__kicker">Tự tay sắp xếp</p>
        <h1 className="page-head__title">Playlist</h1>
        <p className="page-head__subtitle">
          Tự tạo các danh sách phát theo tâm trạng và thêm bài từ thư viện.
        </p>
      </header>

      <CreatePlaylistForm validateName={validateName} />

      {playlists.length > 0 ? (
        <ul className="playlist-grid">
          {playlists.map((playlist) => (
            <li key={playlist.id} className="playlist-card">
              <span className="playlist-card__icon" aria-hidden="true">
                <ListMusic size={22} />
              </span>
              <span className="playlist-card__name">{playlist.name}</span>
              <span className="playlist-card__count">
                {playlist.songIds.length} bài
              </span>
              <div className="playlist-card__actions">
                <Link to={`/playlists/${playlist.id}`} className="btn">
                  Mở
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  className="btn btn--danger"
                  onClick={() => dispatch({ type: 'remove', id: playlist.id })}
                >
                  <Trash2 size={16} aria-hidden="true" />
                  Xóa
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state" style={{ marginTop: 18 }}>
          <span className="empty-state__icon">
            <ListMusic size={28} aria-hidden="true" />
          </span>
          <p className="empty-state__title">Chưa có playlist nào.</p>
          <p className="empty-state__hint">
            Đặt tên cho playlist đầu tiên của bạn ở form phía trên, sau đó thêm
            bài từ trang Thư viện.
          </p>
        </div>
      )}
    </section>
  );
}
