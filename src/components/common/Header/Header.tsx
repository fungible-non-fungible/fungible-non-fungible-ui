import React, { useMemo } from 'react';
import cx from 'classnames';
import Link from 'next/link';

import { Container } from '@components/ui/Container';
import { Row } from '@components/ui/Row';
import { Button } from '@components/ui/Button';
import { HeaderLink } from '@components/common/Header/HeaderLink';
import FungibleNonFungible from '@icons/FungibleNonFungible.svg';

import s from './Header.module.sass';

type HeaderProps = {
  className?: string
};

export const Header: React.FC<HeaderProps> = ({
  className,
}) => {
  const content = useMemo(() => ([
    {
      href: '/',
      label: 'Home',
    },
    {
      href: '/marketplace',
      label: 'Marketplace',
    },
    {
      href: '/account',
      label: 'My account',
    },
    {
      href: '/ui-kit',
      label: 'UI-Kit [Dev]',
    },
  ]), []);

  return (
    <header className={cx(s.root, className)}>
      <Container>
        <Row>
          <Link href="/">
            <a>
              <FungibleNonFungible className={s.logo} />
            </a>
          </Link>
          <nav className={s.navigation}>
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
          <div className={s.buttons}>
            <Button theme="green" href="/create">
              Create
            </Button>
            <Button className={s.button}>
              Connect wallet
            </Button>
          </div>
        </Row>
      </Container>
    </header>
  );
};
