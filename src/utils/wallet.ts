import { ethers, providers } from 'ethers';
import { useMemo } from 'react';
import { useWallet } from 'use-wallet';
import { WindowChain } from '@utils/types';
import {
  chainId as chain,
  rpcUrl,
  chainName,
  nativeCurrency,
  blockExplorer,
} from './defaults';

export const setAlreadyConnected = (connectorId: string) => {
  localStorage.setItem('wallet', connectorId);
};

export const getAlreadyConnected = () => localStorage.getItem('wallet');

export const removeAlreadyConnected = () => {
  localStorage.removeItem('wallet');
  localStorage.removeItem('walletconnect');
};

export const useWalletProvider = () => {
  const { ethereum } = useWallet<providers.ExternalProvider>();
  return useMemo(
    () => (ethereum ? new ethers.providers.Web3Provider(ethereum) : null),
    [ethereum],
  );
};

export const setupNetwork = async () => {
  console.log('setupNetwork');
  const provider = (window as WindowChain).ethereum;
  if (provider) {
    const chainId = parseInt(chain.toString(), 10);
    try {
      // @ts-ignore
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName,
            nativeCurrency,
            rpcUrls: [rpcUrl],
            blockExplorerUrls: [blockExplorer],
          },
        ],
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  } else {
    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined");
    return false;
  }
};
