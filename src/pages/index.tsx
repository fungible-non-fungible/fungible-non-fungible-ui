import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextSeo } from 'next-seo';

import { BaseLayout } from '@layouts/BaseLayout';
import { Container } from '@components/ui/Container';
import { Row } from '@components/ui/Row';
import { FirstScreen } from '@components/home/FirstScreen';
import { MarketplaceContainer } from '@containers/Marketplace';

import s from '@styles/Home.module.sass';

const Home: React.FC = () => {
  const { t } = useTranslation(['common', 'home']);

  return (
    <BaseLayout className={s.container}>
      <NextSeo
        title={t('home:Home page')}
        description={t('home:Home page description. Couple sentences...')}
        openGraph={{
          title: t('home:Home page'),
          description: t('home:Home page description. Couple sentences...'),
        }}
      />
      <FirstScreen />
      <Container>
        <Row>
          <MarketplaceContainer
            title="The most valuable items 🔥"
            buttonText="Show hottest items 🔥"
            className={s.block}
          />
          <MarketplaceContainer
            title="Latest tokenized NFTs ⏳"
            headingTheme="orange"
            buttonText="Show latest items"
            buttonTheme="orange"
            className={s.block}
          />
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
