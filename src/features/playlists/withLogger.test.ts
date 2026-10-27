import { afterEach, describe, expect, it, vi } from 'vitest';
import { withLogger } from './withLogger';
import { playlistReducer } from './playlistReducer';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('withLogger', () => {
  it('trả về đúng kết quả của reducer gốc', () => {
    const loggedReducer = withLogger(playlistReducer);
    const next = loggedReducer([], {
      type: 'create',
      id: 'pl-1',
      name: 'Chạy bộ',
    });
    expect(next).toEqual([{ id: 'pl-1', name: 'Chạy bộ', songIds: [] }]);
  });

  it('ghi log tên action cùng state trước và sau (môi trường DEV)', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const loggedReducer = withLogger(playlistReducer);
    loggedReducer([], { type: 'create', id: 'pl-1', name: 'Chạy bộ' });

    expect(logSpy).toHaveBeenCalledTimes(1);
    const [message, detail] = logSpy.mock.calls[0];
    expect(String(message)).toContain('create');
    expect(detail).toEqual({
      before: [],
      after: [{ id: 'pl-1', name: 'Chạy bộ', songIds: [] }],
    });
  });

  it('không làm thay đổi state ngoài ý muốn', () => {
    const loggedReducer = withLogger(playlistReducer);
    const state = [{ id: 'pl-1', name: 'Chạy bộ', songIds: ['s1'] }];
    loggedReducer(state, { type: 'remove', id: 'pl-1' });
    expect(state).toEqual([{ id: 'pl-1', name: 'Chạy bộ', songIds: ['s1'] }]);
  });
});
