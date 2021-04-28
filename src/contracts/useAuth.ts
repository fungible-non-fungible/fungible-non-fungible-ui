import { useWallet } from 'use-wallet';
import React, { useEffect } from 'react';
import {
  getAlreadyConnected,
  removeAlreadyConnected,
  setAlreadyConnected,
  setupNetwork,
} from '@utils/wallet';

export const useAuth = () => {
  const {
    error,
    account,
    connect,
    connector,
    reset,
  } = useWallet();
  const triedRef = React.useRef(false);
  const triedSwitchNetworkRef = React.useRef(false);

  useEffect(() => {
    const oldAcc = getAlreadyConnected();
    if (connector !== oldAcc) {
      if (connector) {
        setAlreadyConnected(connector);
      }
    }
  }, [connector]);

  const connectToWallet = async () => {
    if (!account) {
      const connectorFromStorage = getAlreadyConnected();
      try {
        if (connectorFromStorage) {
          await connect(connectorFromStorage as any);
          // @ts-ignore
        } else if (window?.ethereum) {
          await connect('injected');
        }
      } catch (e) {
        reset();
      }
    }
  };

  const login = async () => {
    if (!triedSwitchNetworkRef.current && error?.name === 'ChainUnsupportedError') {
      try {
        await setupNetwork();
        triedRef.current = false;
      } catch (e) {
        return;
      } finally {
        triedSwitchNetworkRef.current = true;
      }
    }

    if (triedRef.current) return;
    triedRef.current = true;
    await connectToWallet();
  };

  useEffect(() => {
    if (error?.name || getAlreadyConnected()) {
      login();
    }
  }, [error?.name]);

  const manualLogin = () => {
    triedRef.current = false;
    triedSwitchNetworkRef.current = false;
    login();
  };

  const logout = () => {
    removeAlreadyConnected();
    reset();
  };

  return { manualLogin, logout };
};
