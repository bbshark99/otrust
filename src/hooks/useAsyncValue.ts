import { useEffect, useState } from 'react';

import { AsyncStatus, useAsyncProcess } from './useAsyncProcess';

export function useAsyncValue<T, U>(fn: () => Promise<T>, defVal: U): [T | U, AsyncStatus] {
  const [value, setValue] = useState<T | U>(defVal);
  const [run, state] = useAsyncProcess();

  useEffect(() => {
    run(async () => setValue(await fn()));
  }, [fn, run]);

  return [value, state];
}
