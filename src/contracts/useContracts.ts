import {
  Contract,
  ContractInterface,
  providers,
  Signer,
} from 'ethers';
import { useMemo } from 'react';
import { zeroAddress } from '@utils/defaults';
import { useWalletProvider } from '@utils/wallet';

export interface ContractsConfig {
  addresses: string[];
  abi: ContractInterface;
}

export function makeContracts(
  { addresses, abi }: ContractsConfig,
  signerOrProvider: providers.Web3Provider | Signer,
) {
  try {
    return addresses.map((address) => (address === zeroAddress
      ? undefined
      : new Contract(address, abi, signerOrProvider)
    ));
  } catch {
    return [];
  }
}

export default function useContracts(
  {
    addresses,
    abi,
  }: ContractsConfig,
  useSigner?: boolean,
) {
  const provider = useWalletProvider();

  const contracts = useMemo(() => {
    if (!provider) {
      return [];
    }

    return makeContracts(
      {
        addresses,
        abi,
      },
      useSigner ? provider.getSigner() : provider,
    );
  }, [provider, useSigner, addresses, abi]);

  return contracts;
}
