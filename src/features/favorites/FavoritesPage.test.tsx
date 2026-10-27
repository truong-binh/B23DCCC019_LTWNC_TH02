import { beforeEach, describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FavoritesPage from './FavoritesPage';
import { useFavoritesStore } from './useFavoritesStore';
import { usePlayerStore } from '../player/usePlayerStore';
import { renderWithProviders } from '../../test/renderWithProviders';

beforeEach(() => {
  window.localStorage.clear();
  useFavoritesStore.setState({ ids: [] });
  usePlayerStore.setState({
    queue: [],
    currentIndex: -1,
    isPlaying: false,
    position: 0,
  });
});

describe('FavoritesPage', () => {
  it('hiển thị "Bạn chưa có bài hát yêu thích." khi danh sách rỗng', () => {
    renderWithProviders(<FavoritesPage />);
    expect(
      screen.getByText('Bạn chưa có bài hát yêu thích.'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Khám phá thư viện' }),
    ).toBeInTheDocument();
  });

  it('liệt kê các bài đã thích và Phát tất cả đưa chúng vào hàng đợi', async () => {
    const user = userEvent.setup();
    useFavoritesStore.setState({ ids: ['s1', 's3'] });
    renderWithProviders(<FavoritesPage />);

    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('Gió tháng Sáu 1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Phát tất cả/ }));
    const state = usePlayerStore.getState();
    expect(state.queue.map((song) => song.id)).toEqual(['s1', 's3']);
    expect(state.currentIndex).toBe(0);
    expect(state.isPlaying).toBe(true);
  });

  it('nút "Bỏ yêu thích" gỡ bài khỏi danh sách', async () => {
    const user = userEvent.setup();
    useFavoritesStore.setState({ ids: ['s1', 's3'] });
    renderWithProviders(<FavoritesPage />);

    const removeButtons = screen.getAllByRole('button', {
      name: 'Bỏ yêu thích',
    });
    await user.click(removeButtons[0]);

    expect(useFavoritesStore.getState().ids).toEqual(['s3']);
    expect(screen.queryByText('Mưa tháng Sáu 1')).not.toBeInTheDocument();
  });
});
