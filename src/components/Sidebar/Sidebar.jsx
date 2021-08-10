import React from 'react';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import BigNumber from 'bignumber.js';

import { Panel } from 'components/UI';
import { useChain } from 'context/chain/ChainContext';
import { useExchange } from 'context/exchange/ExchangeContext';
import { responsive } from 'theme/constants';
import { format18 } from 'utils/math';
import SidebarHeader from './SidebarHeader';
import SidebarBalances from './SidebarBalances';
import SidebarFooter from './SidebarFooter';
import SidebarConnection from './SidebarConnection';

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
    // grid-template-columns: 1fr 250px;
  }

  @media screen and (max-width: ${responsive.smartphoneLarge}) {
    display: flex;
    flex-direction: column;
  }
`;

export default function Sidebar() {
  const { active, error, chainId, account, deactivate } = useWeb3React();
  const { blockNumber, strongBalance, weakBalance, NOMallowance } = useChain();
  const { strong, weak } = useExchange();

  const handleLogout = () => {
    window.localStorage.removeItem('connectorId');
    deactivate();
  };

  return (
    <Panel>
      <SidebarLayout>
        <SidebarHeader account={account} onLogout={handleLogout} />
        <SidebarBalances
          strong={strong}
          weak={weak}
          allowance={BigNumber.isBigNumber(NOMallowance) ? `${format18(NOMallowance)}` : 'Loading'}
          strongBalance={BigNumber.isBigNumber(strongBalance) ? `${format18(strongBalance).toFixed(6)}` : 'Loading'}
          weakBalance={BigNumber.isBigNumber(weakBalance) ? `${format18(weakBalance).toFixed(6)}` : 'Loading'}
        />
        <SidebarConnection active={active} error={error} chainId={chainId} blockNumber={blockNumber} />
        <SidebarFooter />
      </SidebarLayout>
    </Panel>
  );
}
