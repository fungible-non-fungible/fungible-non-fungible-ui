import React from 'react';
import cx from 'classnames';

import { shortize } from '@utils/helpers';

import s from './Holder.module.sass';

type HolderProps = {
  image: string
  accountPkh: string
  value: number
  symbol: string
  percent: number
  theme?: keyof typeof themeClass
  className?: string
};

const themeClass = {
  default: s.default,
  big: s.big,
  medium: s.medium,
};

export const Holder: React.FC<HolderProps> = ({
  image,
  accountPkh,
  value,
  symbol,
  percent,
  theme = 'default',
  className,
}) => {
  const compoundClassName = cx(
    s.root,
    themeClass[theme],
    className,
  );

  return (
    <div className={compoundClassName}>
      <div className={s.image}>
        <img src={image} alt={accountPkh} />
      </div>
      <div className={s.content}>
        <h5 className={s.accountPkh}>
          {theme === 'big' ? accountPkh : shortize(accountPkh)}
        </h5>
        <div className={s.info}>
          <span className={s.infoItem}>
            {value}
            {' '}
            {symbol}
          </span>
          <span className={s.seperator}>✵</span>
          <span className={s.infoItem}>
            {percent}
            {' '}
            %
          </span>
        </div>
      </div>
    </div>
  );
};
