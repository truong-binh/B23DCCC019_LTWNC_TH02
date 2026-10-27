import { describe, expect, it } from 'vitest';
import { playlistReducer } from './playlistReducer';
import type { Playlist } from './playlistReducer';

const baseState: Playlist[] = [
  { id: 'pl-1', name: 'Chạy bộ', songIds: ['s1'] },
  { id: 'pl-2', name: 'Học bài', songIds: [] },
];

describe('playlistReducer', () => {
  it('tạo playlist mới với danh sách bài rỗng', () => {
    const next = playlistReducer([], { type: 'create', id: 'pl-1', name: 'Chạy bộ' });
    expect(next).toEqual([{ id: 'pl-1', name: 'Chạy bộ', songIds: [] }]);
  });

  it('addSong thêm bài vào đúng playlist và không mutate state cũ', () => {
    const next = playlistReducer(baseState, {
      type: 'addSong',
      playlistId: 'pl-2',
      songId: 's9',
    });
    expect(next[1].songIds).toEqual(['s9']);
    expect(next[0].songIds).toEqual(['s1']);
    expect(baseState[1].songIds).toEqual([]);
  });

  it('addSong không thêm trùng bài đã có trong playlist', () => {
    const next = playlistReducer(baseState, {
      type: 'addSong',
      playlistId: 'pl-1',
      songId: 's1',
    });
    expect(next[0].songIds).toEqual(['s1']);
  });

  it('removeSong bỏ đúng bài khỏi playlist', () => {
    const next = playlistReducer(baseState, {
      type: 'removeSong',
      playlistId: 'pl-1',
      songId: 's1',
    });
    expect(next[0].songIds).toEqual([]);
  });

  it('xóa playlist không tồn tại thì state giữ nguyên', () => {
    const next = playlistReducer(baseState, {
      type: 'remove',
      id: 'khong-ton-tai',
    });
    expect(next).toEqual(baseState);
  });

  it('remove xóa đúng playlist', () => {
    const next = playlistReducer(baseState, { type: 'remove', id: 'pl-1' });
    expect(next).toEqual([baseState[1]]);
  });

  it('rename đổi tên đúng playlist, các playlist khác giữ nguyên', () => {
    const next = playlistReducer(baseState, {
      type: 'rename',
      id: 'pl-1',
      name: 'Tập gym',
    });
    expect(next[0].name).toBe('Tập gym');
    expect(next[1]).toEqual(baseState[1]);
    expect(baseState[0].name).toBe('Chạy bộ');
  });
});
