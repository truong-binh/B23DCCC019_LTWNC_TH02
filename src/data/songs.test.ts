import { describe, expect, it } from 'vitest';
import { GENRES, generateSongs } from './songs';

describe('generateSongs', () => {
  it('sinh đúng 10000 bài hát', () => {
    expect(generateSongs(10000)).toHaveLength(10000);
  });

  it('không có id nào trùng nhau', () => {
    const songs = generateSongs(10000);
    const uniqueIds = new Set(songs.map((song) => song.id));
    expect(uniqueIds.size).toBe(10000);
  });

  it('mọi thời lượng đều nằm trong khoảng 150–300 giây', () => {
    const songs = generateSongs(10000);
    expect(
      songs.every((song) => song.duration >= 150 && song.duration <= 300),
    ).toBe(true);
  });

  it('các trường dữ liệu đúng định dạng', () => {
    const songs = generateSongs(200);
    for (const song of songs) {
      expect(song.id).toMatch(/^s\d+$/);
      expect(song.title.length).toBeGreaterThan(0);
      expect(song.artist.length).toBeGreaterThan(0);
      expect(GENRES).toContain(song.genre);
    }
  });

  it('thuật toán ổn định: hai lần sinh giống hệt nhau và khớp dữ liệu mẫu', () => {
    expect(generateSongs(50)).toEqual(generateSongs(50));

    const [s1, s2, s3] = generateSongs(3);
    expect(s1).toEqual({
      id: 's1',
      title: 'Mưa tháng Sáu 1',
      artist: 'Lê Minh',
      genre: 'Pop',
      duration: 150,
    });
    expect(s2.title).toBe('Nắng tháng Sáu 1');
    expect(s2.artist).toBe('Quang Huy');
    expect(s2.duration).toBe(187);
    expect(s3.genre).toBe('Ballad');
  });
});
