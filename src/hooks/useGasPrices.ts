import BigNumber from 'bignumber.js';
import * as t from 'io-ts';
import { useCallback } from 'react';

import { REACT_APP_ETHERSCAN_API_KEY } from 'constants/env';
import { decodeIoTs } from 'utils/decodeIoTs';
import { useAsyncValue } from './useAsyncValue';

const GasOracleResponse = t.type({
  status: t.string,
  message: t.string,
  result: t.type({
    SafeGasPrice: t.string,
    ProposeGasPrice: t.string,
    FastGasPrice: t.string,
  }),
});

export function useGasPrices() {
  const query = useCallback(async () => {
    const url = `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${REACT_APP_ETHERSCAN_API_KEY}`;
    const response = await fetch(url);
    const json = await response.json();
    const decoded = await decodeIoTs(GasOracleResponse, json);
    const {
      result: { SafeGasPrice: safe, ProposeGasPrice: propose, FastGasPrice: fast },
    } = decoded;
    return {
      safe: new BigNumber(safe).multipliedBy(1e9),
      propose: new BigNumber(propose).multipliedBy(1e9),
      fast: new BigNumber(fast).multipliedBy(1e9),
    };
  }, []);

  return useAsyncValue(query, {
    safe: new BigNumber('0'),
    propose: new BigNumber('0'),
    fast: new BigNumber('0'),
  });
}
