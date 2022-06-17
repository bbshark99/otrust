import React from 'react';
import { useBondingCurve } from '@onomy/react-hub';

import ProgressCircle from './ProgressCircle';

export function BridgeProgress() {
  const { onomyAddress, bridgeProgress } = useBondingCurve();

  return (
    <>
      {onomyAddress && bridgeProgress !== null && (
        <ProgressCircle message="Bridging bNOM to NOM…" percent={bridgeProgress} />
      )}
    </>
  );
}
