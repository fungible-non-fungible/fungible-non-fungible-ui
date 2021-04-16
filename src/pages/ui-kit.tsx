import React from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextSeo } from 'next-seo';

import { BaseLayout } from '@layouts/BaseLayout';
import { Row } from '@components/ui/Row';
import { Container } from '@components/ui/Container';

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
