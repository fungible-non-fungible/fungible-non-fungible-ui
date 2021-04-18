import React from 'react';
import cx from 'classnames';
import { motion } from 'framer-motion';

import { Button } from '@components/ui/Button';

import s from './Tab.module.sass';

const spring = {
  type: 'spring',
  stiffness: 500,
  damping: 30,
};

type TabProps = {
  theme: keyof typeof themeClass
  isSelected: boolean
  onClick: () => void
  className?: string
};

const themeClass = {
  purple: s.purple,
  pink: s.pink,
  green: s.green,
  blue: s.blue,
};

export const Tab: React.FC<TabProps> = ({
  theme,
  children,
  isSelected,
  onClick,
  className,
}) => {
  const compoundClassName = cx(
    s.root,
    { [s.active]: isSelected },
    themeClass[theme],
    className,
  );

  return (
    <Button className={compoundClassName} theme="clean" onClick={onClick}>
      {children}
      {isSelected && (
        <motion.div
          layoutId="tabs-buttons"
          className={s.background}
          initial={false}
          transition={spring}
        />
      )}
    </Button>
  );
};
