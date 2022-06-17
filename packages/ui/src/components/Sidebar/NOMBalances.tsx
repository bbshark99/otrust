import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {
  useBondingCurve,
  useBridgedBalanceValue,
  useDelegationTotalValue,
  useUnbondingTotalValue,
} from '@onomy/react-hub';

import {
  Balances,
  Balance,
  BalancePrice,
  BalanceNumber,
  Hint,
  TooltipCaption,
  TooltipDesc,
} from './SidebarStyles';
import { PrimaryButton } from 'components/Modals/styles';
import { NomBalanceDisplay } from 'components/NomBalanceDisplay';
import { EquivalentValue } from 'components/EquivalentValue';
import { format18 } from 'utils/math';

const ButtonWrapper = styled.div`
  margin-top: 20px;
`;

const Message = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 15px;

  background-color: #252b39;
  border-radius: 4px;

  color: ${props => props.theme.colors.highlightBlue};
`;

export default function NOMBalances() {
  const { onomyAddress } = useBondingCurve();
  const bridged = useBridgedBalanceValue();
  const [locked] = useUnbondingTotalValue();
  const [delegated] = useDelegationTotalValue();

  const total = useMemo(() => bridged.plus(locked).plus(delegated), [bridged, locked, delegated]);

  return (
    <Balances>
      {onomyAddress ? (
        <>
          <Balance>
            <BalancePrice>
              <strong>NOM Balance (Bridged)</strong>
              <BalanceNumber strong>
                <NomBalanceDisplay value={total.toString()} />
                <small>
                  <EquivalentValue amount={format18(total).toNumber()} asset="NOM" />
                </small>
              </BalanceNumber>
            </BalancePrice>
            <Hint>
              <TooltipCaption>NOM Balance (Bridged)</TooltipCaption>
              <TooltipDesc>Your NOM balance on the Onomy Network</TooltipDesc>
            </Hint>
          </Balance>

          <Balance>
            <BalancePrice>
              <strong>NOM Staked</strong>
              <BalanceNumber strong>
                <NomBalanceDisplay value={delegated.toString()} />
                <small>
                  <EquivalentValue amount={format18(delegated).toNumber()} asset="NOM" />
                </small>
              </BalanceNumber>
            </BalancePrice>
            <Hint>
              <TooltipCaption>NOM Staked</TooltipCaption>
              <TooltipDesc>NOM delegated to earn staking rewards</TooltipDesc>
            </Hint>
          </Balance>

          <Balance>
            <BalancePrice>
              <strong>NOM Locked</strong>
              <BalanceNumber strong>
                <NomBalanceDisplay value={locked.toString()} />
                <small>
                  <EquivalentValue amount={format18(locked).toNumber()} asset="NOM" />
                </small>
              </BalanceNumber>
            </BalancePrice>
            <Hint>
              <TooltipCaption>NOM Locked</TooltipCaption>
              <TooltipDesc>
                Your NOM will become available for use 3 weeks after successful un-delegation.
              </TooltipDesc>
            </Hint>
          </Balance>
        </>
      ) : (
        <Message>View your NOM balance and manage staking after bridging.</Message>
      )}

      <ButtonWrapper>
        <Link to="/validators">
          <PrimaryButton style={{ width: '100%' }}>Manage Staking</PrimaryButton>
        </Link>
      </ButtonWrapper>
    </Balances>
  );
}
