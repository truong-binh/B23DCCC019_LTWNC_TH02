/**
 * Đổi số giây sang chuỗi "phút:giây", ví dụ 150 -> "2:30", 65 -> "1:05".
 * Giá trị âm hoặc không hợp lệ được coi là 0.
 */
export function formatDuration(seconds: number): string {
  const safeSeconds =
    Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const remain = safeSeconds % 60;
  return `${minutes}:${String(remain).padStart(2, '0')}`;
}
