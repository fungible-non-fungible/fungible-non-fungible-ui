import React, { ReactNode } from 'react';
import cx from 'classnames';
import { motion } from 'framer-motion';

import BlueBubbles from '@icons/socials/BlueBubbles.svg';
import PurpleBubbles from '@icons/socials/PurpleBubbles.svg';
import GreenBubbles from '@icons/socials/GreenBubbles.svg';
import OrangeBubbles from '@icons/socials/OrangeBubbles.svg';
import PinkBubbles from '@icons/socials/PinkBubbles.svg';
import GreenBubblesBig from '@icons/socials/GreenBubblesBig.svg';
import OrangeBubblesBig from '@icons/socials/OrangeBubblesBig.svg';
import PinkBubblesBig from '@icons/socials/PinkBubblesBig.svg';

import s from './SocialButton.module.sass';

type SocialButtonProps = {
  icon: ReactNode
  href?: string
  theme?: keyof typeof themeClass
  sizeT?: keyof typeof sizeClass
  className?: string
};

const themeClass = {
  blue: s.blue,
  purple: s.purple,
  green: s.green,
  orange: s.orange,
  pink: s.pink,
};

const sizeClass = {
  default: s.default,
  big: s.big,
};

export const SocialButton: React.FC<SocialButtonProps> = ({
  icon,
  href,
  theme = 'blue',
  sizeT = 'default',
  className,
}) => {
  let bubbles = <BlueBubbles className={s.bubbles} />;
  if (theme === 'purple') {
    bubbles = <PurpleBubbles className={s.bubbles} />;
  }
  if (theme === 'green') {
    bubbles = sizeT === 'big'
      ? <GreenBubblesBig className={s.bubbles} />
      : <GreenBubbles className={s.bubbles} />;
  }
  if (theme === 'orange') {
    bubbles = sizeT === 'big'
      ? <OrangeBubblesBig className={s.bubbles} />
      : <OrangeBubbles className={s.bubbles} />;
  }
  if (theme === 'pink') {
    bubbles = sizeT === 'big'
      ? <PinkBubblesBig className={s.bubbles} />
      : <PinkBubbles className={s.bubbles} />;
  }

  return (
    <motion.a
      className={cx(s.root, themeClass[theme], sizeClass[sizeT], className)}
      href={href}
      target="_blank"
      rel="nofollow noopener"
      whileHover={{ scale: sizeT === 'big' ? 1.2 : 1.3 }}
      whileTap={{ scale: 0.9 }}
    >
      {icon}
      {bubbles}
    </motion.a>
  );
};
