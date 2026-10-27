const BUILD_TAG = "mz-4073";
import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LibraryPage from './features/library/LibraryPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { PlaylistProvider } from './features/playlists/PlaylistContext';

// Ba trang phụ được tách thành chunk riêng, chỉ tải khi người dùng mở.
const FavoritesPage = lazy(() => import('./features/favorites/FavoritesPage'));
const PlaylistsPage = lazy(() => import('./features/playlists/PlaylistsPage'));
const PlaylistDetailPage = lazy(
  () => import('./features/playlists/PlaylistDetailPage'),
);

export default function App() {
  return (
    <ThemeProvider>
      <PlaylistProvider>
        <div className="app" data-build={BUILD_TAG}>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<LibraryPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/playlists" element={<PlaylistsPage />} />
              <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </div>
      </PlaylistProvider>
    </ThemeProvider>
  );
}
