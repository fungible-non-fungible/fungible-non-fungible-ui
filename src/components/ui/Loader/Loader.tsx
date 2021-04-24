import React from 'react';
import cx from 'classnames';

import s from './Loader.module.scss';

type LoaderProps = {
  className?: string
};

export const Loader: React.FC<LoaderProps> = ({
  className,
}) => {
  const content = [];
  for (let i = 0; i < 16; i++) {
    content.push(<li />);
  }

  return (
    <div className={cx(s.boxes, className)}>
      <div className={s.box}>
        <div />
        <div />
        <div />
        <div />
      </div>
      <div className={s.box}>
        <div />
        <div />
        <div />
        <div />
      </div>
      <div className={s.box}>
        <div />
        <div />
        <div />
        <div />
      </div>
      <div className={s.box}>
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};
