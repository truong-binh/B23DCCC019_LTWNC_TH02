import { beforeEach, describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import PlaylistDetailPage from './PlaylistDetailPage';
import { usePlayerStore } from '../player/usePlayerStore';
import { renderWithProviders } from '../../test/renderWithProviders';

function renderDetail(route: string) {
  return renderWithProviders(
    <Routes>
      <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
    </Routes>,
    { route },
  );
}

beforeEach(() => {
  window.localStorage.clear();
  usePlayerStore.setState({
    queue: [],
    currentIndex: -1,
    isPlaying: false,
    position: 0,
  });
});

describe('PlaylistDetailPage', () => {
  it('hiển thị "Không tìm thấy playlist" với id không tồn tại', () => {
    renderDetail('/playlists/khong-co-that');
    expect(screen.getByText('Không tìm thấy playlist')).toBeInTheDocument();
  });

  it('dữ liệu localStorage hỏng không làm crash trang', () => {
    window.localStorage.setItem('music-playlists', '{json hỏng');
    renderDetail('/playlists/pl-1');
    expect(screen.getByText('Không tìm thấy playlist')).toBeInTheDocument();
  });

  it('hiển thị bài hát và tổng thời lượng tính bằng reduce', () => {
    window.localStorage.setItem(
      'music-playlists',
      JSON.stringify([{ id: 'pl-1', name: 'Chạy bộ', songIds: ['s1', 's2'] }]),
    );
    renderDetail('/playlists/pl-1');

    expect(
      screen.getByRole('heading', { name: 'Chạy bộ' }),
    ).toBeInTheDocument();
    // s1 (150 giây) + s2 (187 giây) = 337 giây = 5 phút 37 giây
    expect(screen.getByText(/Tổng thời lượng: 5 phút 37 giây/)).toBeInTheDocument();
    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('Nắng tháng Sáu 1')).toBeInTheDocument();
  });

  it('Phát tất cả gọi playQueue với đúng các bài trong playlist', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      'music-playlists',
      JSON.stringify([{ id: 'pl-1', name: 'Chạy bộ', songIds: ['s1', 's2'] }]),
    );
    renderDetail('/playlists/pl-1');

    await user.click(screen.getByRole('button', { name: /Phát tất cả/ }));
    const state = usePlayerStore.getState();
    expect(state.queue.map((song) => song.id)).toEqual(['s1', 's2']);
    expect(state.queue[0].title).toBe('Mưa tháng Sáu 1');
    expect(state.isPlaying).toBe(true);
  });

  it('nút Bỏ gỡ bài khỏi playlist và cập nhật tổng thời lượng', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      'music-playlists',
      JSON.stringify([{ id: 'pl-1', name: 'Chạy bộ', songIds: ['s1', 's2'] }]),
    );
    renderDetail('/playlists/pl-1');

    await user.click(
      screen.getByRole('button', { name: 'Bỏ Mưa tháng Sáu 1 khỏi playlist' }),
    );

    expect(screen.queryByText('Mưa tháng Sáu 1')).not.toBeInTheDocument();
    // chỉ còn s2 (187 giây) = 3 phút 7 giây
    expect(screen.getByText(/Tổng thời lượng: 3 phút 7 giây/)).toBeInTheDocument();
  });
});
