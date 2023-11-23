import { useLayoutEffect, useRef } from 'react';

export const useLatest = <T>(cb: T): { readonly current: T } => {
  const latestCb = useRef(cb);

  useLayoutEffect(() => {
    latestCb.current = cb;
  }, [cb]);

  return latestCb;
};
