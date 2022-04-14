import React from 'react';
import cx from 'classnames';

import s from './HoldersProgress.module.sass';

export type HolderProps = {
  accountPkh: string
  image: string
  percent: number
};

type HolderCardProps = {
  className?: string
  zIndex: number
} & HolderProps;

export const HolderCard: React.FC<HolderCardProps> = ({
  className,
  accountPkh,
  image,
  percent,
  zIndex,
}) => {
  const compoundClassName = cx(
    s.holderProgress,
    { [s.blue]: percent > 0 && percent <= 10 },
    { [s.green]: percent > 10 && percent <= 20 },
    { [s.orange]: percent > 20 && percent <= 40 },
    { [s.pink]: percent > 40 },
  );

  return (
    <>
      <span
        className={compoundClassName}
        style={{ width: `${percent}%` }}
      />
      <div
        className={cx(s.holder, className)}
        style={{ left: `${percent}%`, zIndex }}
      >
        <img
          src={image}
          alt={accountPkh}
        />
        <span className={s.holderPercent}>
          {percent}
          %
        </span>
      </div>
    </>
  );
};

type HoldersProgressProps = {
  className?: string
  holders?: HolderProps[]
  burnPercent: number
};

export const HoldersProgress: React.FC<HoldersProgressProps> = ({
  className,
  holders,
  burnPercent,
}) => (
  <div className={cx(s.root, className)}>
    <div className={s.progress}>
      <div
        className={s.burnPercent}
        style={{ left: `${burnPercent}%` }}
      >
        {burnPercent}
        %
      </div>
      {holders?.slice(0, 3).map((holder, index) => (
        <HolderCard
          key={holder.accountPkh}
          accountPkh={holder.accountPkh}
          image={holder.image}
          percent={holder.percent}
          zIndex={holders?.slice(0, 3).length - index + 2}
        />
      ))}
    </div>
  </div>
);
