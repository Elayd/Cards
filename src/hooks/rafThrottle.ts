// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ThrottleCallback = (...args: any[]) => void;

export function throttle(callback: ThrottleCallback): ThrottleCallback {
  let requestId: number | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (...args: any[]): void {
    if (!requestId) {
      requestId = requestAnimationFrame(() => {
        callback(...args);
        requestId = null;
      });
    }
  };
}
