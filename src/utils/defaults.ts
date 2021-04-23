import { Connectors } from 'use-wallet';

export const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL as string;
export const chainId = +(process.env.NEXT_PUBLIC_CHAIN_ID as string);
export const walletConnectors: Connectors = {
  walletconnect: { rpcUrl },
};
