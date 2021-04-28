import { Connectors } from 'use-wallet';

export const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL as string;
export const chainId = +(process.env.NEXT_PUBLIC_CHAIN_ID as string);
export const chainName = 'Smart Chain - Testnet';
export const nativeCurrency = {
  name: 'BNB',
  symbol: 'bnb',
  decimals: 18,
};
export const blockExplorer = 'https://testnet.bscscan.com';

export const walletConnectors: Connectors = {
  walletconnect: { rpcUrl },
};

export const zeroAddress = '0x0000000000000000000000000000000000000000';

export const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS as string;
