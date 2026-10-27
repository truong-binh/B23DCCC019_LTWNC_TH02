import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import PlayerBar from './PlayerBar';
import { usePlayerStore } from './usePlayerStore';
import { generateSongs } from '../../data/songs';

const songs = generateSongs(3);

beforeEach(() => {
  usePlayerStore.setState({
    queue: [],
    currentIndex: -1,
    isPlaying: false,
    position: 0,
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('PlayerBar', () => {
  it('hiển thị "Chưa phát bài nào" và khóa các nút khi chưa có bài', () => {
    render(<PlayerBar />);
    expect(screen.getByText('Chưa phát bài nào')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Phát' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Bài trước' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Bài sau' })).toBeDisabled();
    expect(screen.getByText('Hàng đợi: 0 bài')).toBeInTheDocument();
  });

  it('hiển thị "Đang phát: <tên bài> – <ca sĩ>" và số bài trong hàng đợi', () => {
    render(<PlayerBar />);
    act(() => {
      usePlayerStore.getState().playQueue(songs, 0);
    });
    expect(
      screen.getByText('Đang phát: Mưa tháng Sáu 1 – Lê Minh'),
    ).toBeInTheDocument();
    expect(screen.getByText('Hàng đợi: 3 bài')).toBeInTheDocument();
    expect(screen.getByText('0:00 / 2:30')).toBeInTheDocument();
  });

  it('đồng hồ tăng mỗi giây khi đang phát và đứng yên khi tạm dừng', () => {
    vi.useFakeTimers();
    render(<PlayerBar />);
    act(() => {
      usePlayerStore.getState().playQueue(songs, 0);
    });

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(usePlayerStore.getState().position).toBe(5);
    expect(screen.getByText('0:05 / 2:30')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Tạm dừng' }));
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(usePlayerStore.getState().position).toBe(5);
    expect(screen.getByRole('button', { name: 'Phát' })).toBeInTheDocument();
  });

  it('nút Bài sau chuyển bài và đưa thời gian về 0:00', () => {
    render(<PlayerBar />);
    act(() => {
      usePlayerStore.getState().playQueue(songs, 0);
      usePlayerStore.setState({ position: 42 });
    });
    fireEvent.click(screen.getByRole('button', { name: 'Bài sau' }));
    expect(
      screen.getByText('Đang phát: Nắng tháng Sáu 1 – Quang Huy'),
    ).toBeInTheDocument();
    expect(screen.getByText(/^0:00 \//)).toBeInTheDocument();
  });
});
