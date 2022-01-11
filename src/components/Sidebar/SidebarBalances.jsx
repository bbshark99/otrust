import React, { useState } from 'react';

// import ModalComponent from 'components/Modals/components/ModalComponent';
import BridgeSwapMain from 'components/Modals/components/BridgeSwapMain';
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

export default function SidebarBalances({ strong, weak, strongBalance, weakBalance, allowance }) {
  // const { handleModal } = useModal();
  const [showBridge, setShowBridge] = useState(false);

  return (
    <>
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
              This shows your total wNOM balance and the amount approved for selling. You must
              approve wNOM for selling before it can be sold.
            </TooltipDesc>
          </Hint>
        </Balance>

        {REACT_APP_SHOW_BRIDGED_NOM && <SidebarBridgedBalance />}

        <WithdrawBtnWrapper>
          <PrimaryButton style={{ width: '100%' }} onClick={() => setShowBridge(true)}>
            Bridge wNOM to NOM
          </PrimaryButton>
        </WithdrawBtnWrapper>
      </Balances>
      {showBridge && <BridgeSwapMain closeBridgeModal={() => setShowBridge(false)} />}
    </>
  );
}
