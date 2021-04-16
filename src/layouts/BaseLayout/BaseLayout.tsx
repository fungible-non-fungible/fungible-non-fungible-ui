import React from 'react';
import cx from 'classnames';

import { Header } from '@components/common/Header';
import { Footer } from '@components/common/Footer';

import s from './BaseLayout.module.sass';

interface BaseLayoutProps {
  className?: string;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({
  className,
  children,
}) => (
  <>
    <Header />
    <main className={cx(s.root, className)}>
      {children}
    </main>
    <Footer />
  </>
);
