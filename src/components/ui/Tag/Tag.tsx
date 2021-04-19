import React from 'react';
import cx from 'classnames';

import s from './Tag.module.sass';

type TagProps = {
  theme?: keyof typeof themeClass
  className?: string
};

const themeClass = {
  pink: s.pink,
  orange: s.orange,
};

export const Tag: React.FC<TagProps> = ({
  theme = 'pink',
  children,
  className,
}) => {
  const compoundClassName = cx(
    s.root,
    themeClass[theme],
    className,
  );

  return (
    <span className={compoundClassName}>
      {children}
    </span>
  );
};
