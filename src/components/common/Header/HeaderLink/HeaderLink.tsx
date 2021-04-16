import React from 'react';
import cx from 'classnames';
import { useRouter } from 'next/router';
import Link, { LinkProps } from 'next/link';

import s from './HeaderLink.module.sass';

type HeaderLinkProps = {
  className?: string
} & LinkProps;

export const HeaderLink: React.FC<HeaderLinkProps> = ({
  className,
  href,
  children,
}) => {
  const router = useRouter();

  const compoundClassname = cx(
    s.root,
    { [s.active]: router.pathname === href },
    className,
  );

  return (
    <Link href={href}>
      <a className={compoundClassname}>
        {children}
      </a>
    </Link>
  );
};
