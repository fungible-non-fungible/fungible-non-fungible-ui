import React, { useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextSeo } from 'next-seo';

import {
  convertFromNumberToPercent,
  convertFromPercentToNumber,
} from '@utils/helpers';
import { BaseLayout } from '@layouts/BaseLayout';
import { Container } from '@components/ui/Container';
import { Row } from '@components/ui/Row';
import { Heading } from '@components/ui/Heading';
import { Tabs } from '@components/ui/Tabs';
import { Input } from '@components/ui/Input';
import { Switcher } from '@components/ui/Switcher';
import { Slider } from '@components/ui/Slider';
import { Button } from '@components/ui/Button';

import s from '@styles/Create.module.sass';

const tabs = [
  'Create & Tokenize',
  'Tokenize',
];

const Create: React.FC = () => {
  const { t } = useTranslation(['common', 'create']);
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [customSymbol, setCustomSymbol] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <BaseLayout>
      <NextSeo
        title={t('create:Home page')}
        description={t('create:Home page description. Couple sentences...')}
        openGraph={{
          title: t('create:Home page'),
          description: t('create:Home page description. Couple sentences...'),
        }}
      />
      <Container>
        <Row className={s.row}>
          <Heading
            title="Create & Tokenize NFT"
            className={s.header}
            theme="orange"
          />
          <Tabs
            className={s.tabs}
            tabs={tabs}
            selectedTab={selectedTab}
            onChangeTab={(tab) => setSelectedTab(tab)}
          />
          {selectedTab === tabs[1] && (
            <>
              <Input
                type="text"
                className={s.input}
                label="NFT address"
                placeholder="0x00...000"
                required
              />
              <Input
                type="text"
                className={s.input}
                label="NFT id"
                placeholder="2"
                required
              />
            </>
          )}
          <Input
            type="file"
            className={s.input}
            label="Upload file"
            required
            disabled={selectedTab === tabs[1]}
          />
          <Input
            type="text"
            className={s.input}
            label="Name"
            placeholder="e.g. My Awesome NFT"
            required
            disabled={selectedTab === tabs[1]}
          />
          <Input
            textarea
            className={s.input}
            label="Description"
            placeholder="e.g. Some words about my token"
            required
            disabled={selectedTab === tabs[1]}
          />
          <div className={cx(s.input, s.symbol)}>
            {selectedTab === tabs[0] && (
              <Switcher
                isOn={customSymbol}
                onSwitch={() => setCustomSymbol(!customSymbol)}
                className={s.switcher}
              />
            )}
            <Input
              type="text"
              label={selectedTab === tabs[0] ? 'Custom token symbol' : 'Token symbol'}
              placeholder="FNFT"
              disabled={!customSymbol || selectedTab === tabs[1]}
              defaultValue={!customSymbol ? 'FNFT' : ''}
              required={customSymbol}
            />
            {selectedTab === tabs[0] && (
              <p className={cx(
                s.inputDescription,
                s.symbolDescription,
                { [s.active]: customSymbol },
              )}
              >
                Service Fee
                {' '}
                <span className={s.inputDescriptionBold}>0.005 BNB</span>
              </p>
            )}
          </div>
          <div className={s.input}>
            <Input
              type="text"
              label="Total supply"
              placeholder="1200329"
              currency="FNFT"
              required
            />
            <p className={s.inputDescription}>
              Service Fee
              {' '}
              <span className={s.inputDescriptionBold}>0.07 BNB</span>
            </p>
          </div>
          <div className={cx(s.sliderAmounts)}>
            <p className={s.burn}>
              Burn percent
            </p>
            <div className={s.currencies}>
              <Input
                className={cx(s.sliderInput, s.inputPercent)}
                sizeT="small"
                theme="green"
                type="number"
                value={sliderValue.toFixed(2)}
                onChange={(e) => setSliderValue(+e.target.value)}
                currency="%"
              />
              <span className={s.equal}>
                =
              </span>

              <Input
                className={s.sliderInput}
                sizeT="small"
                theme="orange"
                type="number"
                value={convertFromPercentToNumber(sliderValue, 100).toFixed(2)}
                onChange={
                  (e) => setSliderValue(
                    convertFromNumberToPercent(+e.target.value, 100),
                  )
                }
                currency="FNFT"
              />
            </div>
          </div>
          <Slider
            minValue={50}
            maxValue={90}
            inputValue={sliderValue}
            className={cx(s.input, s.slider)}
            onDragEnd={(value) => setSliderValue(value)}
          />
          <Button
            className={s.button}
          >
            Create
          </Button>
        </Row>
      </Container>
    </BaseLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'create']),
  },
});

export default Create;
