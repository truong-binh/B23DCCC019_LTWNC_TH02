import { useEffect, useState } from 'react';

/**
 * Trả về giá trị chỉ sau khi `value` ngừng thay đổi trong `delay` ms.
 * Timer cũ luôn được dọn dẹp khi value đổi hoặc component unmount.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
