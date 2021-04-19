import React from 'react';
import cx from 'classnames';

import { Tag } from '@components/ui/Tag';
import BackgroundPurple from '@icons/HeadingPink.svg';
import BackgroundOrange from '@icons/HeadingOrange.svg';

import s from './Heading.module.sass';

type HeadingProps = {
  title: string
  items?: number
  theme?: keyof typeof themeClass
  className?: string
};

const themeClass = {
  pink: s.pink,
  orange: s.orange,
};

export const Heading: React.FC<HeadingProps> = ({
  theme = 'pink',
  title,
  items,
  className,
}) => {
  const compoundClassName = cx(
    s.root,
    themeClass[theme],
    className,
  );

  const background = theme === 'pink'
    ? <BackgroundPurple className={s.icon} />
    : <BackgroundOrange className={s.icon} />;

  return (
    <div className={compoundClassName}>
      {background}
      <h2>
        {title}
      </h2>
      {items && (
      <Tag theme={theme} className={s.tag}>
        {items}
        {' '}
        {items === 1 ? 'item' : 'items'}
      </Tag>
      )}
    </div>
  );
};
