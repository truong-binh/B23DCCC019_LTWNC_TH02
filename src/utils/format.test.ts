import { describe, expect, it } from 'vitest';
import { formatDuration } from './format';

describe('formatDuration', () => {
  it('đổi 0 giây thành "0:00"', () => {
    expect(formatDuration(0)).toBe('0:00');
  });

  it('đổi 65 giây thành "1:05" (giây lẻ có số 0 ở trước)', () => {
    expect(formatDuration(65)).toBe('1:05');
  });

  it('đổi 300 giây thành "5:00"', () => {
    expect(formatDuration(300)).toBe('5:00');
  });

  it('đổi 150 giây thành "2:30"', () => {
    expect(formatDuration(150)).toBe('2:30');
  });

  it('coi giá trị âm hoặc không hợp lệ là 0 giây', () => {
    expect(formatDuration(-10)).toBe('0:00');
    expect(formatDuration(Number.NaN)).toBe('0:00');
  });
});
