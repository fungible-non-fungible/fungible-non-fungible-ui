import React from 'react';
import { useWallet } from 'use-wallet';

import { convertToCrypto } from '@utils/helpers';
import { Button, themeClass } from '@components/ui/Button';
import { AccountButton } from '@components/common/AccountButton';
import { useAuth } from '@contracts/useAuth';

type WalletConnectProps = {
  theme?: keyof typeof themeClass
  className?: string
};

export const WalletConnect: React.FC<WalletConnectProps> = ({
  theme = 'purple',
  className,
}) => {
  const wallet = useWallet();

  const { manualLogin, logout } = useAuth();

  if (wallet.status === 'connected' && wallet.account) {
    return (
      <AccountButton
        className={className}
        balance={convertToCrypto(+wallet.balance)}
        accountPkh={wallet.account}
        onClick={logout}
      />
    );
  }

  return (
    <Button
      onClick={manualLogin}
      className={className}
      theme={theme}
    >
      Connect wallet
    </Button>
  );
};
