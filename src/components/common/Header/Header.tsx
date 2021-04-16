import React, { useMemo } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

import { HeaderLink } from '@components/common/Header/HeaderLink';

import s from './Header.module.sass';

type HeaderProps = {
  className?: string
};

export const Header: React.FC<HeaderProps> = ({
  className,
}) => {
  const { t } = useTranslation(['common']);

  const content = useMemo(() => ([
    {
      href: '/',
      label: t('common:Home'),
    },
  ]), [t]);

  return (
    <header className={cx(s.root, className)}>
      <nav>
        {content.map((navLink) => (
          <HeaderLink
            key={navLink.href}
            href={navLink.href}
            className={s.link}
          >
            {navLink.label}
          </HeaderLink>
        ))}
      </nav>
    </header>
  );
};
