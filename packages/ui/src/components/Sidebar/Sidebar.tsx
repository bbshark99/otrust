import React from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { useBondingCurve } from '@onomy/react-hub';

import { Panel } from 'components/UI';
import { useExchange } from 'context/exchange/ExchangeContext';
import { responsive } from 'theme/constants';
import { format18 } from 'utils/math';
import SidebarHeader from './SidebarHeader';
import SidebarBalances from './SidebarBalances';
import SidebarFooter from './SidebarFooter';
// import SidebarConnection from './SidebarConnection';
import NOMBalances from './NOMBalances';

const PanelLayout = styled(Panel)`
  height: 100%;
`;

const SidebarLayout = styled.div`
  display: flex;
  flex-direction: column;

  height: 100%;

  @media screen and (max-width: ${responsive.tablet}) {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: 100px 100px;
    justify-content: space-between;
  }

  @media screen and (max-width: ${responsive.tabletSmall}) {
    /* grid-template-columns: 1fr 250px; */
  }

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    display: flex;
    flex-direction: column;
  }
`;

const DarkWrapper = styled.div`
  margin-top: auto;

  background-color: ${props => props.theme.colors.bgDarken};
  border-radius: 4px;
`;

export default function Sidebar() {
  const { strongBalance, weakBalance, NOMallowance, logout, ethAddress } = useBondingCurve();
  const { strong, weak } = useExchange();

  const handleLogout = () => {
    window.localStorage.removeItem('connectorId');
    if (logout) logout();
  };

  return (
    <div id="tour-sidebar">
      <PanelLayout>
        <SidebarLayout>
          <SidebarHeader account={ethAddress} onLogout={handleLogout} />
          <SidebarBalances
            strong={strong}
            weak={weak}
            allowance={
              BigNumber.isBigNumber(NOMallowance) ? `${format18(NOMallowance)}` : 'Loading'
            }
            strongBalance={
              BigNumber.isBigNumber(strongBalance)
                ? `${format18(strongBalance).toFixed(6)}`
                : 'Loading'
            }
            weakBalance={
              BigNumber.isBigNumber(weakBalance) ? `${format18(weakBalance).toFixed(6)}` : 'Loading'
            }
          />
          {/* <SidebarConnection
            active={active}
            error={error}
            chainId={chainId}
            blockNumber={blockNumber}
          /> */}
          <DarkWrapper>
            <NOMBalances />
            <SidebarFooter />
          </DarkWrapper>
        </SidebarLayout>
      </PanelLayout>
    </div>
  );
}
