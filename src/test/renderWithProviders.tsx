import { render } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { PlaylistProvider } from '../features/playlists/PlaylistContext';

interface RenderOptions {
  /** Đường dẫn khởi tạo cho MemoryRouter, mặc định là '/'. */
  route?: string;
}

/**
 * Render component trong đầy đủ Provider (Theme, Playlist) và MemoryRouter,
 * dùng chung cho các test component cần context của ứng dụng.
 */
export function renderWithProviders(
  ui: ReactElement,
  { route = '/' }: RenderOptions = {},
): RenderResult {
  return render(
    <ThemeProvider>
      <PlaylistProvider>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </PlaylistProvider>
    </ThemeProvider>,
  );
}
