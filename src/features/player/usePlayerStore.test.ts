import { beforeEach, describe, expect, it } from 'vitest';
import { generateSongs } from '../../data/songs';
import { usePlayerStore } from './usePlayerStore';

// s1: 150 giây, s2: 187 giây, s3: 224 giây
const songs = generateSongs(3);

beforeEach(() => {
  usePlayerStore.setState({
    queue: [],
    currentIndex: -1,
    isPlaying: false,
    position: 0,
  });
});

describe('playQueue', () => {
  it('thay hàng đợi, chọn đúng bài bắt đầu và đưa position về 0', () => {
    usePlayerStore.setState({ position: 42 });
    usePlayerStore.getState().playQueue(songs, 1);
    const state = usePlayerStore.getState();
    expect(state.queue).toEqual(songs);
    expect(state.currentIndex).toBe(1);
    expect(state.isPlaying).toBe(true);
    expect(state.position).toBe(0);
  });

  it('xử lý an toàn danh sách rỗng và startIndex không hợp lệ', () => {
    usePlayerStore.getState().playQueue([], 5);
    expect(usePlayerStore.getState().currentIndex).toBe(-1);
    expect(usePlayerStore.getState().isPlaying).toBe(false);

    usePlayerStore.getState().playQueue(songs, 99);
    expect(usePlayerStore.getState().currentIndex).toBe(songs.length - 1);

    usePlayerStore.getState().playQueue(songs, -4);
    expect(usePlayerStore.getState().currentIndex).toBe(0);
  });
});

describe('togglePlay', () => {
  it('không cho phát khi chưa có bài hợp lệ trong hàng đợi', () => {
    usePlayerStore.getState().togglePlay();
    expect(usePlayerStore.getState().isPlaying).toBe(false);
  });

  it('chuyển qua lại giữa phát và tạm dừng', () => {
    usePlayerStore.getState().playQueue(songs, 0);
    usePlayerStore.getState().togglePlay();
    expect(usePlayerStore.getState().isPlaying).toBe(false);
    usePlayerStore.getState().togglePlay();
    expect(usePlayerStore.getState().isPlaying).toBe(true);
  });
});

describe('addToQueue', () => {
  it('thêm bài vào cuối hàng đợi, bỏ qua bài đã có và giữ nguyên currentIndex', () => {
    usePlayerStore.getState().addToQueue(songs[0]);
    usePlayerStore.getState().addToQueue(songs[1]);
    usePlayerStore.getState().addToQueue(songs[0]);
    const state = usePlayerStore.getState();
    expect(state.queue.map((song) => song.id)).toEqual(['s1', 's2']);
    expect(state.currentIndex).toBe(-1);
    expect(state.position).toBe(0);
  });
});

describe('tick', () => {
  it('tăng position thêm 1 giây khi đang phát', () => {
    usePlayerStore.getState().playQueue(songs, 0);
    usePlayerStore.getState().tick();
    usePlayerStore.getState().tick();
    expect(usePlayerStore.getState().position).toBe(2);
  });

  it('không tăng position khi đang tạm dừng', () => {
    usePlayerStore.getState().playQueue(songs, 0);
    usePlayerStore.getState().togglePlay();
    usePlayerStore.getState().tick();
    expect(usePlayerStore.getState().position).toBe(0);
  });

  it('ở giây cuối của bài thì tự chuyển sang bài tiếp theo', () => {
    usePlayerStore.getState().playQueue(songs, 0);
    usePlayerStore.setState({ position: songs[0].duration - 1 });
    usePlayerStore.getState().tick();
    const state = usePlayerStore.getState();
    expect(state.currentIndex).toBe(1);
    expect(state.position).toBe(0);
    expect(state.isPlaying).toBe(true);
  });

  it('ở giây cuối của bài cuối cùng thì dừng phát, position không tăng vô hạn', () => {
    usePlayerStore.getState().playQueue(songs, songs.length - 1);
    usePlayerStore.setState({ position: songs[2].duration - 1 });
    usePlayerStore.getState().tick();
    const state = usePlayerStore.getState();
    expect(state.currentIndex).toBe(songs.length - 1);
    expect(state.isPlaying).toBe(false);
    expect(state.position).toBe(0);
  });
});

describe('next', () => {
  it('chuyển sang bài tiếp theo và reset position về 0', () => {
    usePlayerStore.getState().playQueue(songs, 0);
    usePlayerStore.setState({ position: 30 });
    usePlayerStore.getState().next();
    const state = usePlayerStore.getState();
    expect(state.currentIndex).toBe(1);
    expect(state.position).toBe(0);
  });

  it('ở bài cuối thì đặt isPlaying thành false và không vượt quá hàng đợi', () => {
    usePlayerStore.getState().playQueue(songs, songs.length - 1);
    usePlayerStore.getState().next();
    const state = usePlayerStore.getState();
    expect(state.isPlaying).toBe(false);
    expect(state.currentIndex).toBe(songs.length - 1);
  });
});

describe('prev', () => {
  it('khi đã phát quá 3 giây thì chỉ tua bài hiện tại về 0', () => {
    usePlayerStore.getState().playQueue(songs, 1);
    usePlayerStore.setState({ position: 10 });
    usePlayerStore.getState().prev();
    const state = usePlayerStore.getState();
    expect(state.currentIndex).toBe(1);
    expect(state.position).toBe(0);
  });

  it('trong 3 giây đầu thì lùi về bài trước', () => {
    usePlayerStore.getState().playQueue(songs, 1);
    usePlayerStore.setState({ position: 3 });
    usePlayerStore.getState().prev();
    const state = usePlayerStore.getState();
    expect(state.currentIndex).toBe(0);
    expect(state.position).toBe(0);
  });

  it('ở bài đầu tiên thì chỉ tua về 0', () => {
    usePlayerStore.getState().playQueue(songs, 0);
    usePlayerStore.setState({ position: 2 });
    usePlayerStore.getState().prev();
    const state = usePlayerStore.getState();
    expect(state.currentIndex).toBe(0);
    expect(state.position).toBe(0);
  });
});
