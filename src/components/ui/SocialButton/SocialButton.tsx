import React, { ReactNode } from 'react';
import cx from 'classnames';
import { motion } from 'framer-motion';

import BlueBubbles from '@icons/socials/BlueBubbles.svg';
import PurpleBubbles from '@icons/socials/PurpleBubbles.svg';
import GreenBubbles from '@icons/socials/GreenBubbles.svg';
import OrangeBubbles from '@icons/socials/OrangeBubbles.svg';
import PinkBubbles from '@icons/socials/PinkBubbles.svg';

import s from './SocialButton.module.sass';

type SocialButtonProps = {
  icon: ReactNode
  theme?: keyof typeof themeClass
  className?: string
};

const themeClass = {
  blue: s.blue,
  purple: s.purple,
  green: s.green,
  orange: s.orange,
  pink: s.pink,
};

export const SocialButton: React.FC<SocialButtonProps> = ({
  icon,
  theme = 'blue',
  className,
}) => {
  let bubbles = <BlueBubbles className={s.bubbles} />;
  if (theme === 'purple') {
    bubbles = <PurpleBubbles className={s.bubbles} />;
  }
  if (theme === 'green') {
    bubbles = <GreenBubbles className={s.bubbles} />;
  }
  if (theme === 'orange') {
    bubbles = <OrangeBubbles className={s.bubbles} />;
  }
  if (theme === 'pink') {
    bubbles = <PinkBubbles className={s.bubbles} />;
  }

  return (
    <motion.a
      className={cx(s.root, themeClass[theme], className)}
      type="button"
      whileHover={{ scale: 1.3 }}
      whileTap={{ scale: 0.9 }}
    >
      {icon}
      {bubbles}
    </motion.a>
  );
};
