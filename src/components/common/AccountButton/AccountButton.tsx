import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import cx from 'classnames';

import { Button } from '@components/ui/Button';

import s from './AccountButton.module.sass';

type AccountButtonProps = {
  balance: number
  accountPkh: string
  onClick: () => void
  className?: string
};

export const AccountButton: React.FC<AccountButtonProps> = ({
  balance,
  accountPkh,
  onClick,
  className,
}) => {
  const [openedWindow, setOpenedWindow] = useState(false);

  const openWindow = useCallback(() => {
    setOpenedWindow(true);
  }, []);
  const closeWindow = useCallback(() => {
    setOpenedWindow(false);
  }, []);

  return (
    <div className={s.wrapper} onMouseLeave={closeWindow}>
      <Link href="/profile">
        {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
        <a className={cx(s.root, className)} onMouseOver={openWindow}>
          <span className={s.balance}>
            {balance}
            {' '}
            BNB
          </span>
          <span className={s.icon} />
        </a>
      </Link>
      <div className={cx(s.windowWrapper, { [s.opened]: openedWindow })}>
        <div className={s.window}>
          <p className={s.header}>Your wallet:</p>
          <p className={s.amount}>{accountPkh}</p>
          <p className={s.header}>Your balance:</p>
          <p className={cx(s.amount, s.balance)}>
            {balance}
            {' '}
            BNB
          </p>
          <Button className={s.button} onClick={onClick}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};
