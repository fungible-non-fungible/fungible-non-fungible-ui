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
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Slider } from '@components/ui/Slider';
import { SocialButton } from '@components/ui/SocialButton';
import { Author } from '@components/common/Author';
import { HoldersProgress } from '@components/common/NftCard/HoldersProgress';
import { Holder } from '@components/common/Holder';
import Twitter from '@icons/socials/Twitter.svg';
import Facebook from '@icons/socials/Facebook.svg';
import Telegram from '@icons/socials/Telegram.svg';
import Email from '@icons/socials/Email.svg';
import Link from '@icons/socials/Link.svg';

import s from '@styles/NftSingle.module.sass';
import { nftsArray } from '../content/nfts';

const NftSinglePage: React.FC = () => {
  const { t } = useTranslation(['common', 'nft-single']);
  const [sliderValue, setSliderValue] = useState(1);

  return (
    <BaseLayout className={s.container}>
      <NextSeo
        title={t('nft-single:Home page')}
        description={t('nft-single:Home page description. Couple sentences...')}
        openGraph={{
          title: t('nft-single:Home page'),
          description: t('nft-single:Home page description. Couple sentences...'),
        }}
      />
      <Container>
        <Row className={s.row}>
          <div className={s.item}>
            <div className={s.imageWrapper}>
              <img
                src="/images/nft.jpg"
                alt={nftsArray[2].title}
              />
            </div>
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
            <div className={s.inner}>
              <h1 className={s.header}>
                {nftsArray[2].title}
              </h1>
              <Author className={s.author} author={nftsArray[2].author} />
              <div className={s.infoItem}>
                <h2 className={s.infoHeader}>Total supply:</h2>
                <p className={cx(s.infoAmount, s.blue)}>
                  {nftsArray[2].totalSupply}
                  {' '}
                  <span className={s.infoCurrency}>{nftsArray[2].tokenSymbol}</span>
                </p>
              </div>
              <div className={s.infoItem}>
                <h2 className={s.infoHeader}>Token price:</h2>
                <p className={cx(s.infoAmount, s.green)}>
                  1
                  {' '}
                  <span className={s.infoCurrency}>{nftsArray[2].tokenSymbol}</span>
                  {' '}
                  -
                  {' '}
                  {nftsArray[2].tokenPrice}
                  {' '}
                  <span className={s.infoCurrency}>BNB</span>
                </p>
              </div>
              <HoldersProgress
                holders={nftsArray[2].holders}
                burnPercent={nftsArray[2].burnPercent}
                className={s.holdersProgress}
              />
              <div className={s.description}>
                {nftsArray[2].description}
              </div>
              <h2 className={cx(s.heading, s.purchaseHeader)}>Purchase:</h2>
              <div className={s.sliderAmounts}>
                <div className={s.currencies}>
                  <Input
                    className={s.sliderInput}
                    sizeT="small"
                    type="number"
                    value={
                      convertFromPercentToNumber(
                        sliderValue,
                        nftsArray[2].totalSupply,
                      ).toFixed(2)
                    }
                    onChange={
                      (e) => setSliderValue(
                        convertFromNumberToPercent(+e.target.value, nftsArray[2].totalSupply),
                      )
                    }
                    currency={nftsArray[2].tokenSymbol}
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
                      convertFromPercentToNumber(sliderValue, nftsArray[2].totalSupply)
                      / (1 / nftsArray[2].tokenPrice)
                    ).toFixed(2)}
                    onChange={
                      (e) => setSliderValue(
                        convertFromNumberToPercent(
                          +e.target.value * (1 / nftsArray[2].tokenPrice),
                          nftsArray[2].totalSupply,
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
                minValue={1}
                maxValue={100 - nftsArray[2].holders[0].percent}
                inputValue={sliderValue}
                className={s.slider}
                onDragEnd={(value) => setSliderValue(value)}
              />
              <Button
                className={s.button}
                theme="pink"
              >
                Buy
              </Button>
              <h2 className={cx(s.heading, s.holdersHeader)}>Top holders:</h2>
              <div className={s.holders}>
                {nftsArray[2].holders.map((holder, index) => (
                  <Holder
                    key={holder.accountPkh}
                    theme={index === 0 ? 'big' : ((index === 1 || index === 2) ? 'medium' : 'default')}
                    image={holder.image}
                    accountPkh={holder.accountPkh}
                    value={(holder.percent * nftsArray[2].totalSupply) / 100}
                    percent={holder.percent}
                    symbol={nftsArray[2].tokenSymbol}
                    className={s.holder}
                  />
                ))}
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </BaseLayout>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'nft-single']),
  },
});

export default NftSinglePage;
