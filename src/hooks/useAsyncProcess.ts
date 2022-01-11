import { useCallback } from 'react';

import { useStateRef } from './useStateRef';

type AsyncInit = {
  finished: false;
  pending: false;
  error: null;
};
const ASYNC_INIT: AsyncInit = {
  finished: false,
  pending: false,
  error: null,
};

type AsyncPending = {
  finished: false;
  pending: true;
  error: null;
};
const ASYNC_PENDING: AsyncPending = {
  finished: false,
  pending: true,
  error: null,
};

type AsyncSuccess = {
  finished: true;
  pending: false;
  error: null;
};
const ASYNC_SUCCESS: AsyncSuccess = {
  finished: true,
  pending: false,
  error: null,
};

type AsyncFail = {
  finished: true;
  pending: false;
  error: Error;
};

export type AsyncStatus = AsyncInit | AsyncSuccess | AsyncFail | AsyncPending;

export function useAsyncProcess(): [(fn: () => Promise<void>) => Promise<void>, AsyncStatus] {
  const [state, setState, stateRef] = useStateRef<AsyncStatus>(ASYNC_INIT);
  const run = useCallback(async (fn: () => Promise<void>) => {
    if (stateRef.current.pending) return;
    try {
      setState(() => ASYNC_PENDING);
      await fn();
      setState(() => ASYNC_SUCCESS);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(`${err}`);
      setState(() => ({
        finished: true,
        pending: false,
        error,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [run, state];
}
