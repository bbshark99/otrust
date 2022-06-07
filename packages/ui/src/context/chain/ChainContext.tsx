import React from 'react';

import { Web3WalletProvider } from './Web3WalletProvider';
// import { JsWalletProvider } from './JsWalletProvider';

export function AppProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  return <Web3WalletProvider>{children}</Web3WalletProvider>;
}

export default AppProvider;
