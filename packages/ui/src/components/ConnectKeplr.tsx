import React, { useEffect } from 'react';
import { useOnomyHub } from '@onomy/react-hub';

export function ConnectKeplr() {
  const { hub } = useOnomyHub();

  useEffect(() => {
    hub?.chains.onomy.wallet.connect();
  }, [hub?.chains.onomy.wallet]);

  return <></>;
}
