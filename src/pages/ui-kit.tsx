import React from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextSeo } from 'next-seo';

import { BaseLayout } from '@layouts/BaseLayout';
import { Container } from '@components/ui/Container';
import { Row } from '@components/ui/Row';
import { Button } from '@components/ui/Button';

import s from '../styles/UiKit.module.sass';

const Home: React.FC = () => {
  const { t } = useTranslation(['common', 'home']);

  return (
    <BaseLayout>
      <NextSeo
        title={t('home:Home page')}
        description={t('home:Home page description. Couple sentences...')}
        openGraph={{
          title: t('home:Home page'),
          description: t('home:Home page description. Couple sentences...'),
        }}
      />
      <Container>
        <Row className={s.row}>
          <h1>UI Kit</h1>
          <div className={s.block}>
            <h2 className={s.header}>Colors</h2>
            <div className={s.colors}>
              <div className={s.colorsColumn}>
                <p className={s.colorsHeader}>Primary</p>
                <div className={cx(s.color, s.primary, s.primary100)}>100</div>
                <div className={cx(s.color, s.primary, s.primary80)}>80</div>
              </div>
              <div className={s.colorsColumn}>
                <p className={s.colorsHeader}>Light</p>
                <div className={cx(s.color, s.light)}>100</div>
              </div>
              <div className={s.colorsColumn}>
                <p className={s.colorsHeader}>Solid</p>
                <div className={cx(s.color, s.solidGreen)} />
                <div className={cx(s.color, s.solidPurple)} />
              </div>
              <div className={s.colorsColumn}>
                <p className={s.colorsHeader}>Gradients</p>
                <div className={cx(s.color, s.gradientGreen)} />
                <div className={cx(s.color, s.gradientPurple)} />
                <div className={cx(s.color, s.gradientOrange)} />
                <div className={cx(s.color, s.gradientBlue)} />
                <div className={cx(s.color, s.gradientPink)} />
                <div className={cx(s.color, s.gradientPink2)} />
              </div>
            </div>
          </div>
          <div className={s.block}>
            <h2 className={s.header}>Buttons</h2>
            <div className={s.buttonsRow}>
              <h3 className={s.buttonsHeader}>Medium</h3>
              <Button className={s.button}>Purple</Button>
              <Button className={s.button} theme="pink">Pink</Button>
              <Button className={s.button} theme="green">Green</Button>
              <Button className={s.button} theme="blue">Blue</Button>
            </div>
            <div className={s.buttonsRow}>
              <h3 className={s.buttonsHeader}>Small</h3>
              <Button className={s.button} sizeT="small">Purple</Button>
              <Button className={s.button} sizeT="small" theme="pink">Pink</Button>
              <Button className={s.button} sizeT="small" theme="green">Green</Button>
              <Button className={s.button} sizeT="small" theme="blue">Blue</Button>
            </div>
            <div className={s.buttonsRow}>
              <h3 className={s.buttonsHeader}>Disabled</h3>
              <Button className={s.button} disabled>Purple</Button>
              <Button className={s.button} theme="pink" disabled>Pink</Button>
              <Button className={s.button} theme="green" disabled>Green</Button>
              <Button className={s.button} theme="blue" disabled>Blue</Button>
            </div>
          </div>
        </Row>
      </Container>
    </BaseLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'home']),
  },
});

export default Home;
