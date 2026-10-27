import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, screen } from '@testing-library/react';
import LibraryPage from './LibraryPage';
import { renderWithProviders } from '../../test/renderWithProviders';
import { usePlayerStore } from '../player/usePlayerStore';
import { useFavoritesStore } from '../favorites/useFavoritesStore';

beforeEach(() => {
  window.localStorage.clear();
  usePlayerStore.setState({
    queue: [],
    currentIndex: -1,
    isPlaying: false,
    position: 0,
  });
  useFavoritesStore.setState({ ids: [] });
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('LibraryPage', () => {
  it('hiển thị "Tìm thấy 10000 bài hát" nhưng chỉ render một phần nhỏ danh sách (ảo hóa)', () => {
    renderWithProviders(<LibraryPage />);
    expect(screen.getByText('Tìm thấy 10000 bài hát')).toBeInTheDocument();
    const renderedRows = document.querySelectorAll('.song-row');
    expect(renderedRows.length).toBeGreaterThan(0);
    expect(renderedRows.length).toBeLessThan(50);
  });

  it('danh sách chỉ được lọc sau khi ngừng gõ 300ms (debounce)', () => {
    renderWithProviders(<LibraryPage />);
    fireEvent.change(screen.getByLabelText('Tìm kiếm'), {
      target: { value: 'mưa' },
    });

    // Trong lúc chưa hết 300ms, danh sách vẫn như cũ
    expect(screen.getByText('Tìm thấy 10000 bài hát')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByText('Tìm thấy 1250 bài hát')).toBeInTheDocument();
  });

  it('không có kết quả thì hiển thị "Không tìm thấy bài hát nào"', () => {
    renderWithProviders(<LibraryPage />);
    fireEvent.change(screen.getByLabelText('Tìm kiếm'), {
      target: { value: 'xyz' },
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByText('Không tìm thấy bài hát nào')).toBeInTheDocument();
  });

  it('kết hợp tìm kiếm với bộ lọc thể loại cho đúng số kết quả', () => {
    renderWithProviders(<LibraryPage />);
    fireEvent.change(screen.getByLabelText('Tìm kiếm'), {
      target: { value: 'mưa' },
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    fireEvent.change(screen.getByLabelText('Thể loại'), {
      target: { value: 'Rock' },
    });
    expect(screen.getByText('Tìm thấy 250 bài hát')).toBeInTheDocument();
  });

  it('sắp xếp Tên A–Z đưa "Biển bình yên 1" lên đầu danh sách', () => {
    renderWithProviders(<LibraryPage />);
    fireEvent.change(screen.getByLabelText('Sắp xếp'), {
      target: { value: 'title' },
    });
    const firstTitle = document.querySelector('.song-row .song-row__title');
    expect(firstTitle?.textContent).toBe('Biển bình yên 1');
  });

  it('bấm Phát ở một dòng thì hàng đợi là danh sách đã lọc, bắt đầu từ bài đó', () => {
    renderWithProviders(<LibraryPage />);
    fireEvent.change(screen.getByLabelText('Tìm kiếm'), {
      target: { value: 'mưa' },
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    const playButtons = screen.getAllByRole('button', { name: /^Phát Mưa/ });
    fireEvent.click(playButtons[0]);

    const state = usePlayerStore.getState();
    expect(state.queue).toHaveLength(1250);
    expect(state.currentIndex).toBe(0);
    expect(state.isPlaying).toBe(true);
    expect(state.queue[0].title).toContain('Mưa');
  });

  it('bấm nút yêu thích trên một dòng cập nhật favorites store', () => {
    renderWithProviders(<LibraryPage />);
    const favoriteButtons = screen.getAllByRole('button', {
      name: 'Thêm vào yêu thích',
    });
    fireEvent.click(favoriteButtons[0]);
    expect(useFavoritesStore.getState().ids).toEqual(['s1']);
  });
});
