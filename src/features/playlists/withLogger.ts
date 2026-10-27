type Reducer<S, A> = (state: S, action: A) => S;

/**
 * Middleware cho reducer: ghi log tên action cùng state trước/sau
 * (chỉ trong môi trường DEV), rồi trả về đúng kết quả của reducer gốc.
 */
export function withLogger<S, A extends { type: string }>(
  reducer: Reducer<S, A>,
): Reducer<S, A> {
  return (state, action) => {
    const nextState = reducer(state, action);
    if (import.meta.env.DEV) {
      console.log(`[playlist] action: ${action.type}`, {
        before: state,
        after: nextState,
      });
    }
    return nextState;
  };
}
