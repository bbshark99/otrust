import React from 'react';
import { Link } from 'react-router-dom';

import { PrimaryButton } from 'components/Modals/styles';
import { EquivalentValue } from 'components/EquivalentValue';
import {
  Balances,
  Balance,
  BalancePrice,
  BalanceNumber,
  Hint,
  TooltipCaption,
  TooltipDesc,
  TrimmedApproved,
  WithdrawBtnWrapper,
} from './SidebarStyles';
import { SidebarBridgedBalance } from './SidebarBridgedBalance';
import { REACT_APP_SHOW_BRIDGED_NOM } from 'constants/env';

export default function SidebarBalances({
  strong,
  weak,
  strongBalance,
  weakBalance,
  allowance,
}: {
  strong: string;
  weak: string;
  strongBalance: string;
  weakBalance: string;
  allowance: string;
}) {
  return (
    <Balances>
      <Balance>
        <BalancePrice>
          <strong>{strong} Balance</strong>
          <BalanceNumber>
            {strongBalance}
            <small>
              <EquivalentValue amount={strongBalance} asset="ETH" />
            </small>
          </BalanceNumber>
        </BalancePrice>
        <Hint>
          <TooltipCaption>ETH Balance</TooltipCaption>
          <TooltipDesc>This is your connected wallet Ether balance.</TooltipDesc>
        </Hint>
      </Balance>
      <Balance>
        <BalancePrice>
          <strong>{weak} Balance</strong>
          <BalanceNumber strong>
            {weakBalance}
            <small>
              <EquivalentValue amount={weakBalance} asset="NOM" />
            </small>
            <TrimmedApproved value={allowance} />
            {/* <CloseIcon onClick={() => {}} /> */}
          </BalanceNumber>
        </BalancePrice>
        <Hint>
          <TooltipCaption>NOM Balance</TooltipCaption>
          <TooltipDesc>
            This shows your total bNOM balance and the amount approved for selling. You must approve
            bNOM for selling before it can be sold.
          </TooltipDesc>
        </Hint>
      </Balance>

      {REACT_APP_SHOW_BRIDGED_NOM && <SidebarBridgedBalance />}

      <WithdrawBtnWrapper>
        <Link to="/bridge">
          <PrimaryButton style={{ width: '100%' }}>Bridge bNOM to NOM</PrimaryButton>
        </Link>
      </WithdrawBtnWrapper>
    </Balances>
  );
}
