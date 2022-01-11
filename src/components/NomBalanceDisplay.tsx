import React from 'react';
import { BigNumber } from 'bignumber.js';

import { format18 } from 'utils/math';

export function NomBalanceDisplay({ value }: { value: string }) {
  const val = new BigNumber(value);
  const display = format18(val).toFixed(6);
  return <>{display}</>;
}
