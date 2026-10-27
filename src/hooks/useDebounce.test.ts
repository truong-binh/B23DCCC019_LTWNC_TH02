import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useDebounce } from './useDebounce';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useDebounce', () => {
  it('trả về giá trị ban đầu ngay lập tức', () => {
    const { result } = renderHook(() => useDebounce('xin chào', 300));
    expect(result.current).toBe('xin chào');
  });

  it('giữ giá trị cũ trước 300ms và trả về giá trị mới sau 300ms', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'mưa' } },
    );

    rerender({ value: 'mưa tháng' });

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe('mưa');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('mưa tháng');
  });

  it('gõ liên tục thì timer cũ bị hủy, chỉ giá trị cuối cùng được áp dụng', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } },
    );

    rerender({ value: 'ab' });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    rerender({ value: 'abc' });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('abc');
  });

  it('dọn dẹp timer khi unmount, không để timer rò rỉ', () => {
    const { rerender, unmount } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } },
    );
    rerender({ value: 'b' });
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
