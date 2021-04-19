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
import { Button } from '@components/ui/Button';
import { Tag } from '@components/ui/Tag';
import { Switcher } from '@components/ui/Switcher';
import { Slider } from '@components/ui/Slider';
import { Tabs } from '@components/ui/Tabs';
import { Input } from '@components/ui/Input';
import { SocialButton } from '@components/ui/SocialButton';
import { NftCard } from '@components/common/NftCard';
import Twitter from '@icons/socials/Twitter.svg';
import Facebook from '@icons/socials/Facebook.svg';
import Telegram from '@icons/socials/Telegram.svg';
import Email from '@icons/socials/Email.svg';
import Link from '@icons/socials/Link.svg';

import s from '../styles/UiKit.module.sass';
import { nftsArray } from '../content/nfts';

const exampleTotalSupply = 10000;
const exampleExchangeRate = 20;
const tabs = [
  'Create & Tokenize',
  'Tokenize',
];

const Home: React.FC = () => {
  const { t } = useTranslation(['common', 'home']);

  const [switcherState, setSwitcherState] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

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
            <Heading title="Colors" items={16} />
            <div className={s.colors}>
              <div className={s.colorsColumn}>
                <p className={s.colorsHeader}>Primary</p>
                <div className={cx(s.color, s.primary, s.primary100)}>100</div>
                <div className={cx(s.color, s.primary, s.primary80)}>80</div>
                <div className={cx(s.color, s.primary, s.primary60)}>60</div>
              </div>
              <div className={s.colorsColumn}>
                <p className={s.colorsHeader}>Light</p>
                <div className={cx(s.color, s.light)} />
              </div>
              <div className={s.colorsColumn}>
                <p className={s.colorsHeader}>Solid</p>
                <div className={cx(s.color, s.solidGreen)} />
                <div className={cx(s.color, s.solidPurple)} />
              </div>
              <div className={s.colorsColumn}>
                <p className={s.colorsHeader}>Gradients</p>
                <div className={cx(s.color, s.gradientGreen)} />
                <div className={cx(s.color, s.gradientGreenReverse)} />
                <div className={cx(s.color, s.gradientPurple)} />
                <div className={cx(s.color, s.gradientOrange)} />
                <div className={cx(s.color, s.gradientBlue)} />
                <div className={cx(s.color, s.gradientPink)} />
                <div className={cx(s.color, s.gradientPinkVertical)} />
                <div className={cx(s.color, s.gradientPink2)} />
                <div className={cx(s.color, s.gradientRed)} />
              </div>
            </div>
          </div>
          <div className={s.block}>
            <Heading theme="orange" title="Headings" items={3} />
            <Heading className={s.headingItem} title="Purple" items={2} />
            <Heading className={s.headingItem} theme="orange" title="Orange" items={148} />
            <Heading className={s.headingItem} title="No tag" />
          </div>
          <div className={s.block}>
            <Heading theme="orange" title="Buttons" items={8} />
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
          <div className={s.block}>
            <Heading title="Tags" items={2} />
            <Tag className={s.button}>12 items</Tag>
            <Tag className={s.button} theme="orange">129 items</Tag>
          </div>
          <div className={s.block}>
            <Heading title="Socials" theme="orange" items={5} />
            <div className={s.socials}>
              <SocialButton
                className={s.social}
                icon={<Twitter />}
              />
              <SocialButton
                theme="purple"
                className={s.social}
                icon={<Facebook />}
              />
              <SocialButton
                theme="green"
                className={s.social}
                icon={<Telegram />}
              />
              <SocialButton
                theme="orange"
                className={s.social}
                icon={<Email />}
              />
              <SocialButton
                theme="pink"
                className={s.social}
                icon={<Link />}
              />
            </div>
          </div>
          <div className={s.block}>
            <Heading title="Switcher" theme="orange" />
            <Switcher
              className={s.button}
              isOn={switcherState}
              onSwitch={() => setSwitcherState(!switcherState)}
            />
          </div>
          <div className={s.block}>
            <Heading title="Sliders" items={2} />
            <div className={s.sliderAmounts}>
              <div className={s.currencies}>
                <Input
                  className={s.sliderInput}
                  sizeT="small"
                  type="number"
                  value={convertFromPercentToNumber(sliderValue, exampleTotalSupply).toFixed(2)}
                  onChange={
                  (e) => setSliderValue(
                    convertFromNumberToPercent(+e.target.value, exampleTotalSupply),
                  )
                }
                  currency="FNFT"
                />
                <span className={s.equal}>
                  =
                </span>
                <Input
                  className={s.sliderInput}
                  sizeT="small"
                  theme="green"
                  type="number"
                  value={(
                    convertFromPercentToNumber(sliderValue, exampleTotalSupply)
                      / exampleExchangeRate
                  ).toFixed(2)}
                  onChange={
                  (e) => setSliderValue(
                    convertFromNumberToPercent(
                      +e.target.value * exampleExchangeRate,
                      exampleTotalSupply,
                    ),
                  )
                }
                  currency="BNB"
                />
              </div>

              <Input
                className={cx(s.sliderInput, s.inputPercent)}
                sizeT="small"
                theme="orange"
                type="number"
                value={sliderValue.toFixed(2)}
                onChange={(e) => setSliderValue(+e.target.value)}
                currency="%"
              />
            </div>
            <Slider
              minValue={10}
              maxValue={90}
              inputValue={sliderValue}
              className={s.slider}
              onDragEnd={(value) => setSliderValue(value)}
            />
            <div className={cx(s.sliderAmounts, s.sliderAmounts2)}>
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
                  value={convertFromPercentToNumber(sliderValue, exampleTotalSupply).toFixed(2)}
                  onChange={
                    (e) => setSliderValue(
                      convertFromNumberToPercent(+e.target.value, exampleTotalSupply),
                    )
                  }
                  currency="FNFT"
                />
              </div>
            </div>
            <Slider
              minValue={10}
              maxValue={90}
              inputValue={sliderValue}
              className={s.slider}
              onDragEnd={(value) => setSliderValue(value)}
            />
          </div>
          <div className={s.block}>
            <Heading title="Tabs" theme="orange" items={4} />
            <Tabs
              className={s.tabs}
              tabs={tabs}
              selectedTab={selectedTab}
              onChangeTab={(tab) => setSelectedTab(tab)}
            />
            <Tabs
              className={s.tabs}
              theme="pink"
              tabs={tabs}
              selectedTab={selectedTab}
              onChangeTab={(tab) => setSelectedTab(tab)}
            />
            <Tabs
              className={s.tabs}
              theme="green"
              tabs={tabs}
              selectedTab={selectedTab}
              onChangeTab={(tab) => setSelectedTab(tab)}
            />
            <Tabs
              className={s.tabs}
              theme="blue"
              tabs={tabs}
              selectedTab={selectedTab}
              onChangeTab={(tab) => setSelectedTab(tab)}
            />
          </div>
          <div className={s.block}>
            <Heading title="Inputs & Textarea" theme="orange" items={6} />
            <Input
              className={s.input}
              label="Total Supply"
              placeholder="12.345"
            />
            <Input
              className={s.input}
              label="Total Supply (error)"
              value="Some error value"
              placeholder="12.345"
              error="Some error message"
            />
            <Input
              className={s.input}
              label="Total Supply (success)"
              value="Some success value"
              placeholder="12.345"
              success
            />
            <Input
              className={s.input}
              label="Total Supply (currency)"
              placeholder="12.345"
              currency="BNB"
            />
            <Input
              className={s.input}
              label="Total Supply (currency)"
              placeholder="12.345"
              currency="BNB"
              theme="orange"
            />
            <Input
              className={s.input}
              label="Total Supply (currency)"
              placeholder="12.345"
              currency="BNB"
              theme="green"
            />
            <Input
              className={s.input}
              label="Total Supply (disabled)"
              placeholder="12.345"
              disabled
            />
            <Input
              className={s.input}
              label="Total Supply (textarea)"
              value="Some long message"
              placeholder="12.345"
              textarea
            />
          </div>
          <div className={s.block}>
            <Heading title="Cards" />
            <div className={s.cards}>
              {nftsArray.map((nft) => (
                <NftCard
                  key={nft.slug}
                  slug={nft.slug}
                  title={nft.title}
                  description={nft.description}
                  image={nft.image}
                  author={nft.author}
                  holders={nft.holders}
                  burnPercent={nft.burnPercent}
                  price={nft.price}
                />
              ))}
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
