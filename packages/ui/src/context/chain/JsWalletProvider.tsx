export {};
/*
import React, { useCallback } from 'react';
import { WalletProvider } from '@onomy/react-wallet';
import { JsWalletBackend } from '@onomy/wallet-backend-js';
import { useAsyncValue } from '@onomy/react-utils';

import { KEPLR_CONFIG } from 'constants/env';

export function JsWalletProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  const [backend] = useAsyncValue(
    useCallback(async () => {
      const be = new JsWalletBackend();
      await be.loadMnemonic('');
      return be;
    }, []),
    null
  );

  if (!backend) return null;

  return (
    <WalletProvider backend={backend} onomyChainInfo={KEPLR_CONFIG}>
      {children}
    </WalletProvider>
  );
}
*/
