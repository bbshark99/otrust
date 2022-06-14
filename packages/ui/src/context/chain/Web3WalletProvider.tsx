import React, { useMemo } from 'react';
import { useWebWalletBackend, WebWalletBackendProvider } from '@onomy/wallet-backend-web';
import { BondingCurveProvider, OnomyHubProvider } from '@onomy/react-hub';

import Landing from 'pages/Landing';
import {
  KEPLR_CONFIG,
  REACT_APP_BONDING_NOM_CONTRACT_ADDRESS,
  REACT_APP_ETH_WS_URL,
  REACT_APP_GRAVITY_CONTRACT_ADDRESS,
  REACT_APP_ONOMY_RPC_URL,
  REACT_APP_WNOM_CONTRACT_ADDRESS,
} from 'constants/env';

function Web3WalletChild({ children }: { children: JSX.Element | JSX.Element[] }) {
  const backend = useWebWalletBackend();
  const chainId = useMemo(() => {
    return KEPLR_CONFIG.chainId;
    const pieces = KEPLR_CONFIG.chainId.split('-');
    pieces.pop();
    return pieces.join('-');
  }, []);

  if (!backend) return null;

  return (
    <OnomyHubProvider
      backend={backend}
      onomyChainId={chainId}
      onomyChainInfo={KEPLR_CONFIG}
      onomyRpcUrl={REACT_APP_ONOMY_RPC_URL}
      ethWsUrl={REACT_APP_ETH_WS_URL}
      nomContractAddress={REACT_APP_WNOM_CONTRACT_ADDRESS}
      bondContractAddress={REACT_APP_BONDING_NOM_CONTRACT_ADDRESS}
      gravityContractAddress={REACT_APP_GRAVITY_CONTRACT_ADDRESS}
    >
      <BondingCurveProvider>{children}</BondingCurveProvider>
    </OnomyHubProvider>
  );
}

export function Web3WalletProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  return (
    <WebWalletBackendProvider Landing={Landing}>
      <Web3WalletChild>{children}</Web3WalletChild>
    </WebWalletBackendProvider>
  );
}
