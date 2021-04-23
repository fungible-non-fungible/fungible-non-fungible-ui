import { ethers, providers } from 'ethers';
import { useMemo } from 'react';
import { useWallet } from 'use-wallet';

export function setAlreadyConnected(connectorId: string) {
  localStorage.setItem('wallet', connectorId);
}

export function getAlreadyConnected() {
  return localStorage.getItem('wallet');
}

export function removeAlreadyConnected() {
  localStorage.removeItem('wallet');
  localStorage.removeItem('walletconnect');
}

export function useWalletProvider() {
  const { ethereum } = useWallet<providers.ExternalProvider>();
  return useMemo(
    () => (ethereum ? new ethers.providers.Web3Provider(ethereum) : null),
    [ethereum],
  );
}
