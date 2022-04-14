import { useMemo } from 'react';
import { marketplaceAddress } from '@utils/defaults';
import marketplaceAbi from './abi/Marketplace.json';
import useContracts from './useContracts';

export default function useMarketplaceContract(
  useSigner?: boolean,
) {
  const contractsConfig = useMemo(() => ({
    addresses: [marketplaceAddress],
    abi: marketplaceAbi,
  }), []);
  return useContracts(contractsConfig, useSigner)[0];
}
