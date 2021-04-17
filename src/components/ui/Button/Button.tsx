import React from 'react';
import Link, { LinkProps } from 'next/link';
import cx from 'classnames';
import { motion } from 'framer-motion';

import s from './Button.module.sass';

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset' | undefined
  theme?: keyof typeof themeClass
  sizeT?: keyof typeof sizeClass
  disabled?: boolean
  external?: boolean
  className?: string
} & (
  | React.HTMLProps<HTMLButtonElement>
  | LinkProps
  | React.HTMLProps<HTMLAnchorElement>
);

const themeClass = {
  purple: s.purple,
  pink: s.pink,
  green: s.green,
  blue: s.blue,
};

const sizeClass = {
  small: s.small,
  medium: s.medium,
};

export const Button: React.FC<ButtonProps> = ({
  type = 'button',
  theme = 'purple',
  sizeT = 'medium',
  external = false,
  disabled,
  className,
  children,
  ...props
}) => {
  const compoundClassName = cx(
    s.root,
    { [s.disabled]: disabled },
    themeClass[theme],
    sizeClass[sizeT],
    className,
  );

  if ('href' in props) {
    if (external) {
      return (
        <a
          target="_blank"
          rel="noreferrer noopener"
          className={compoundClassName}
          {...(props as React.HTMLProps<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    return (
      <Link {...(props as LinkProps)}>
        <motion.a
          className={compoundClassName}
          whileHover={{ scale: disabled ? 1 : 1.04 }}
          whileTap={{ scale: disabled ? 1 : 0.97 }}
        >
          {children}
        </motion.a>
      </Link>
    );
  }

  return (
    <motion.button
      // @ts-ignore
      type={type}
      {...(props as React.HTMLProps<HTMLButtonElement>)}
      className={compoundClassName}
      whileHover={{ scale: disabled ? 1 : 1.04 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};
