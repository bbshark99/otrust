import React from 'react';

import { useOnomy } from 'context/chain/OnomyContext';
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
  const { amount: nomBalance, address: nomAddress, bridgeProgress } = useOnomy();

  return (
    <>
      {nomAddress && (
        <Balance>
          <BalancePrice>
            <strong>NOM Balance</strong>
            <BalanceNumber strong>
              <NomBalanceDisplay value={nomBalance} />
              {bridgeProgress === null ? (
                <small>
                  <EquivalentValue amount={nomBalance} asset="NOM" />
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
