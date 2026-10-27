import { beforeEach, describe, expect, it } from 'vitest';
import { useFavoritesStore } from './useFavoritesStore';

beforeEach(() => {
  window.localStorage.clear();
  useFavoritesStore.setState({ ids: [] });
});

describe('useFavoritesStore', () => {
  it('toggle thêm id khi chưa có và gỡ id khi đã có', () => {
    useFavoritesStore.getState().toggle('s1');
    useFavoritesStore.getState().toggle('s3');
    expect(useFavoritesStore.getState().ids).toEqual(['s1', 's3']);

    useFavoritesStore.getState().toggle('s1');
    expect(useFavoritesStore.getState().ids).toEqual(['s3']);
  });

  it('lưu danh sách yêu thích vào localStorage với key "music-favorites"', () => {
    useFavoritesStore.getState().toggle('s1');
    const raw = window.localStorage.getItem('music-favorites');
    expect(raw).not.toBeNull();
    expect(raw).toContain('s1');
  });
});
