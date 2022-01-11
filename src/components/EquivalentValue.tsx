/* eslint-disable react/require-default-props */
import React from 'react';
import { BigNumber } from 'bignumber.js';

import { useChain } from 'context/chain/ChainContext';
import { format18 } from 'utils/math';

const USD_PER_ETH = 3750;

type EquivalentValueProps = {
  amount: number | string;
  asset: 'ETH' | 'NOM';
  // eslint-disable-next-line react/require-default-props
  // eslint-disable-next-line react/no-unused-prop-types
  equivalent?: 'USD';
  prefix?: string;
};
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function EquivalentValue({ amount, asset, prefix = ' = $' }: EquivalentValueProps) {
  const { currentETHPrice } = useChain() || { currentETHPrice: 0 };
  const nomPerEth = BigNumber.isBigNumber(currentETHPrice)
    ? format18(currentETHPrice).toNumber()
    : 0;
  const amountNum = Number(amount);
  let value: number | null = null;

  if (asset === 'ETH') {
    value = USD_PER_ETH * amountNum;
  } else if (asset === 'NOM') {
    value = (amountNum / nomPerEth) * USD_PER_ETH;
  }

  if (value !== null && !Number.isNaN(value)) {
    return (
      <>
        {prefix}
        {Number(value.toFixed(2)).toLocaleString()}
      </>
    );
  }
  // TODO: calculate and return equivalent value display
  // return <> = $16,208.04</>
  return <></>;
}
