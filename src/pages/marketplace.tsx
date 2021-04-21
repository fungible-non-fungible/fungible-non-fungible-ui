import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextSeo } from 'next-seo';

import { BaseLayout } from '@layouts/BaseLayout';
import { Container } from '@components/ui/Container';
import { Row } from '@components/ui/Row';
import { MarketplaceContainer } from '@containers/Marketplace';
import { Tabs } from '@components/ui/Tabs';

import s from '@styles/Marketplace.module.sass';

const tabs = [
  'Hottest 🔥',
  'Latest ⏳',
];

const MarketplacePage: React.FC = () => {
  const { t } = useTranslation(['common', 'marketplace']);

  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  return (
    <BaseLayout className={s.container}>
      <NextSeo
        title={t('marketplace:Home page')}
        description={t('marketplace:Home page description. Couple sentences...')}
        openGraph={{
          title: t('marketplace:Home page'),
          description: t('marketplace:Home page description. Couple sentences...'),
        }}
      />
      <Container>
        <Row>
          <Tabs
            className={s.tabs}
            tabs={tabs}
            selectedTab={selectedTab}
            onChangeTab={(tab) => setSelectedTab(tab)}
          />
          <MarketplaceContainer className={s.block} isPaginated />
        </Row>
      </Container>
    </BaseLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'marketplace']),
  },
});

export default MarketplacePage;
