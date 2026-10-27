import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SongRow from './SongRow';
import type { SongRowProps } from './SongRow';
import type { Song } from '../../types';

const song: Song = {
  id: 's1',
  title: 'Mưa tháng Sáu 1',
  artist: 'Lê Minh',
  genre: 'Pop',
  duration: 150,
};

function renderSongRow(overrides: Partial<SongRowProps> = {}) {
  const props: SongRowProps = {
    song,
    index: 0,
    isFavorite: false,
    isCurrent: false,
    isPlaying: false,
    playlistDisabled: true,
    onPlay: vi.fn(),
    onToggleFavorite: vi.fn(),
    onAddToQueue: vi.fn(),
    onAddToPlaylist: vi.fn(),
    ...overrides,
  };
  render(<SongRow {...props} />);
  return props;
}

describe('SongRow', () => {
  it('hiển thị tên bài, ca sĩ và thời lượng "2:30" khi duration là 150', () => {
    renderSongRow();
    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('Lê Minh')).toBeInTheDocument();
    expect(screen.getByText('2:30')).toBeInTheDocument();
  });

  it('bấm nút Phát thì gọi hàm mock với đúng bài hát', async () => {
    const user = userEvent.setup();
    const props = renderSongRow();
    await user.click(
      screen.getByRole('button', { name: 'Phát Mưa tháng Sáu 1' }),
    );
    expect(props.onPlay).toHaveBeenCalledTimes(1);
    expect(props.onPlay).toHaveBeenCalledWith(song, 0);
  });

  it('nút yêu thích có accessible name "Thêm vào yêu thích" khi chưa thích', async () => {
    const user = userEvent.setup();
    const props = renderSongRow();
    const favoriteButton = screen.getByRole('button', {
      name: 'Thêm vào yêu thích',
    });
    expect(favoriteButton).toHaveAttribute('aria-pressed', 'false');
    await user.click(favoriteButton);
    expect(props.onToggleFavorite).toHaveBeenCalledWith('s1');
  });

  it('nút yêu thích đổi thành "Bỏ yêu thích" khi bài đã được thích', () => {
    renderSongRow({ isFavorite: true });
    const favoriteButton = screen.getByRole('button', { name: 'Bỏ yêu thích' });
    expect(favoriteButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('nút thêm vào hàng đợi gọi đúng hàm, nút playlist bị khóa khi chưa có playlist', async () => {
    const user = userEvent.setup();
    const props = renderSongRow();
    await user.click(
      screen.getByRole('button', { name: 'Thêm Mưa tháng Sáu 1 vào hàng đợi' }),
    );
    expect(props.onAddToQueue).toHaveBeenCalledWith(song);
    expect(
      screen.getByRole('button', { name: 'Thêm Mưa tháng Sáu 1 vào playlist' }),
    ).toBeDisabled();
  });
});
