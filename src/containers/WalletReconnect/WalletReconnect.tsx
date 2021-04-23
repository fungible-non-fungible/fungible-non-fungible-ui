import React from 'react';
import { useWallet } from 'use-wallet';

import {
  getAlreadyConnected,
  removeAlreadyConnected,
  setAlreadyConnected,
} from '@utils/wallet';

export const WalletReconnect: React.FC = () => {
  const {
    account,
    connect,
    connector,
    reset,
  } = useWallet();
  const triedRef = React.useRef(false);
  const accountRef = React.useRef(account);

  React.useEffect(() => {
    const prevAccount = accountRef.current;
    if (!prevAccount && account) {
      setAlreadyConnected(connector);
    } else if (prevAccount && !account) {
      removeAlreadyConnected();
    }

    accountRef.current = account;

    if (triedRef.current) {
      return;
    }
    triedRef.current = true;

    const connectorFromStorage = getAlreadyConnected();
    if (connectorFromStorage) {
      removeAlreadyConnected();
      connect(connectorFromStorage as any)
        .catch(() => reset());
      // @ts-ignore
    } else if (window?.ethereum) {
      connect('injected').catch(() => reset());
    }
  }, [connect, reset, connector, account]);

  return null;
};
