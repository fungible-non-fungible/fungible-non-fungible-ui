import React from 'react';
import cx from 'classnames';

import { Container } from '@components/ui/Container';
import { Row } from '@components/ui/Row';
import MainIllustration from '@icons/MainIllustration.svg';

import s from './FirstScreen.module.sass';

type FirstScreenProps = {
  className?: string
};

export const FirstScreen: React.FC<FirstScreenProps> = ({ className }) => (
  <section className={cx(s.root, className)}>
    <Container>
      <Row>
        <div className={s.block}>
          <h1 className={s.header}>
            Fungible non fungible
          </h1>
          <p className={s.description}>
            Tokenize your NFT and give it
            <br />
            real value
          </p>
          <MainIllustration className={s.icon} />
        </div>
      </Row>
    </Container>
  </section>
);
