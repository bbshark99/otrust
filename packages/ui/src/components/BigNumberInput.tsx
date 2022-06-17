import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';

export function BigNumberInput({
  value = new BigNumber(0),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (_val: BigNumber) => {},
}) {
  const [strState, setStrState] = useState(value.toString());

  useEffect(() => {
    const valueParsed = new BigNumber(strState.toString());
    if (valueParsed.isNaN()) {
      setStrState('');
    } else if (!value.eq(valueParsed)) {
      console.log({ value, valueParsed });
      setStrState(value.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function onChangeString(str: string) {
    setStrState(str);
    const val = new BigNumber(str.trim());
    if (val !== value) onChange(val);
  }

  return <input type="text" value={strState} onChange={e => onChangeString(e.target.value)} />;
}
