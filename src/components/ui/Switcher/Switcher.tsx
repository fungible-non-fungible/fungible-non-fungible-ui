import React from 'react';
import cx from 'classnames';
import { motion } from 'framer-motion';

import s from './Switcher.module.sass';

const spring = {
  type: 'spring',
  stiffness: 700,
  damping: 30,
};

type SwitcherProps = {
  isOn: boolean
  onSwitch?: () => void
  className?: string
};

export const Switcher: React.FC<SwitcherProps> = ({
  isOn,
  onSwitch,
  className,
}) => (
  <button
    type="button"
    className={cx(s.root, className, { [s.active]: isOn })}
    onClick={onSwitch}
  >
    <motion.div className={s.handle} layout transition={spring} />
  </button>
);
