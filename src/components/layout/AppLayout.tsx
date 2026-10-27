import { Suspense } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Disc3, Moon, Sun } from 'lucide-react';
import PlayerBar from '../../features/player/PlayerBar';
import { usePlayerStore } from '../../features/player/usePlayerStore';
import { useTheme } from '../../contexts/ThemeContext';

export default function AppLayout() {
  const { theme, toggleTheme } = useTheme();
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const themeLabel = theme === 'light' ? 'Giao diện tối' : 'Giao diện sáng';

  return (
    <>
      <header className="topbar">
        <div className="topbar__inner">
          <NavLink to="/" className="wordmark">
            <Disc3
              size={22}
              className={
                isPlaying ? 'wordmark__disc wordmark__disc--spin' : 'wordmark__disc'
              }
              aria-hidden="true"
            />
            Giai<span className="wordmark__accent">Điệu</span>
          </NavLink>
          <nav className="main-nav" aria-label="Điều hướng chính">
            <NavLink to="/" end className="main-nav__link">
              Thư viện
            </NavLink>
            <NavLink to="/favorites" className="main-nav__link">
              Yêu thích
            </NavLink>
            <NavLink to="/playlists" className="main-nav__link">
              Playlist
            </NavLink>
          </nav>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={themeLabel}
            title={themeLabel}
          >
            {theme === 'light' ? (
              <Moon size={15} aria-hidden="true" />
            ) : (
              <Sun size={15} aria-hidden="true" />
            )}
            <span className="theme-toggle__text">{themeLabel}</span>
          </button>
        </div>
      </header>
      <main className="page">
        <Suspense fallback={<p className="page-loading">Đang tải trang...</p>}>
          <Outlet />
        </Suspense>
      </main>
      <PlayerBar />
    </>
  );
}
