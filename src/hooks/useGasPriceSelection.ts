import { useState, useMemo } from 'react';

import { useGasPrices } from './useGasPrices';

export function useGasPriceSelection() {
  const [gasPriceChoice, setGasPriceChoice] = useState(2);
  const [gasPrices] = useGasPrices();
  const gasOptions = useMemo(
    () => [
      {
        id: 0,
        text: `${gasPrices.safe.dividedBy(1e9).toPrecision(4)} (Standard)`,
        gas: gasPrices.safe,
      },
      {
        id: 1,
        text: `${gasPrices.propose.dividedBy(1e9).toPrecision(4)} (Fast)`,
        gas: gasPrices.propose,
      },
      {
        id: 2,
        text: `${gasPrices.fast.dividedBy(1e9).toPrecision(4)} (Instant)`,
        gas: gasPrices.fast,
      },
    ],
    [gasPrices]
  );
  const gasPrice = useMemo(() => {
    const choice = gasOptions.find(o => o.id === gasPriceChoice);
    return choice?.gas || gasOptions[2].gas;
  }, [gasOptions, gasPriceChoice]);

  return { gasPriceChoice, setGasPriceChoice, gasOptions, gasPrice };
}
