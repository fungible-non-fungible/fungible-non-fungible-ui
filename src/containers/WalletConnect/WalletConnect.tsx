import React from 'react';
import { useWallet } from 'use-wallet';

import { convertToCrypto } from '@utils/helpers';
import { Button } from '@components/ui/Button';
import { AccountButton } from '@components/common/AccountButton';

type WalletConnectProps = {
  className?: string
};

export const WalletConnect: React.FC<WalletConnectProps> = ({
  className,
}) => {
  const wallet = useWallet();

  if (wallet.status === 'connected' && wallet.account) {
    return (
      <AccountButton
        className={className}
        balance={convertToCrypto(+wallet.balance)}
        accountPkh={wallet.account}
        onClick={wallet.reset}
      />
    );
  }

  return (
    <Button
      onClick={() => wallet.connect('injected')}
      className={className}
    >
      Connect wallet
    </Button>
  );
};
