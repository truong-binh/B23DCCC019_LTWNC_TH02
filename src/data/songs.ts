import type { Song, Genre } from '../types';

const ADJ = ['Mưa', 'Nắng', 'Gió', 'Đêm', 'Phố', 'Biển', 'Mây', 'Sao'];

const NOUN = [
  'tháng Sáu', 'cuối ngày', 'Hà Nội', 'mùa thu', 'xa xôi',
  'bình yên', 'ngày cũ', 'lặng lẽ', 'trong tim', 'mùa hạ',
];

const ARTISTS = [
  'Lê Minh', 'Hà Anh', 'Tuấn Vũ', 'Ngọc Mai', 'Bảo Trâm',
  'Đức Phúc', 'Thu Hà', 'Quang Huy', 'Mỹ Linh', 'Hoàng Long',
];

export const GENRES: Genre[] = ['Pop', 'Ballad', 'Rock', 'Indie', 'Rap'];

export const generateSongs = (count: number): Song[] =>
  Array.from({ length: count }, (_, i) => {
    const name = `${ADJ[i % 8]} ${NOUN[Math.floor(i / 8) % 10]}`;
    return {
      id: `s${i + 1}`,
      title: `${name} ${Math.floor(i / 80) + 1}`,
      artist: ARTISTS[(i * 7) % 10],
      genre: GENRES[(i * 3) % 5],
      duration: 150 + ((i * 37) % 151), // từ 150 đến 300 giây
    };
  });

export const SONGS = generateSongs(10000);
