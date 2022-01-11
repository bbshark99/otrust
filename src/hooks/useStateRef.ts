import { useRef, useState } from 'react';

export function useStateRef<T>(init: T) {
  const [state, setState] = useState<T>(init);
  const stateRef = useRef(init);

  function setStateWrapper(fnOrValue: T | ((v: T) => T)) {
    function wrap(existing: T) {
      if (fnOrValue instanceof Function) {
        stateRef.current = fnOrValue(existing);
      } else {
        stateRef.current = fnOrValue;
      }
      return stateRef.current;
    }
    setState(wrap);
  }

  const ret: [T, typeof setStateWrapper, typeof stateRef] = [state, setStateWrapper, stateRef];
  return ret;
}
