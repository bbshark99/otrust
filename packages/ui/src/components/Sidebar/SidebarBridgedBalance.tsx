import React from 'react';
import { useBondingCurve } from '@onomy/react-hub';

import { NomBalanceDisplay } from 'components/NomBalanceDisplay';
import {
  Balance,
  BalancePrice,
  BalanceNumber,
  Hint,
  TooltipCaption,
  TooltipDesc,
} from './SidebarStyles';
import { EquivalentValue } from 'components/EquivalentValue';

export function SidebarBridgedBalance() {
  const { nomBalance, onomyAddress, bridgeProgress } = useBondingCurve();

  return (
    <>
      {onomyAddress && (
        <Balance>
          <BalancePrice>
            <strong>NOM Balance</strong>
            <BalanceNumber strong>
              <NomBalanceDisplay value={nomBalance.amount.toString()} />
              {bridgeProgress === null ? (
                <small>
                  <EquivalentValue amount={nomBalance.amount.toString()} asset="NOM" />
                </small>
              ) : (
                <small>{bridgeProgress.toFixed(2)}%</small>
              )}
            </BalanceNumber>
          </BalancePrice>
          <Hint>
            <TooltipCaption>NOM Balance</TooltipCaption>
            <TooltipDesc>This shows your total NOM balance on the Onomy chain</TooltipDesc>
          </Hint>
        </Balance>
      )}
    </>
  );
}
