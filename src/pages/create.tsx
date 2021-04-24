import React, { useCallback, useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextSeo } from 'next-seo';
import { Field, withTypes } from 'react-final-form';
import { FormApi } from 'final-form';

import {
  convertFromNumberToPercent,
  convertFromPercentToNumber, formatName,
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
import { composeValidators, required } from '@utils/validators';
import { ipfs } from '@utils/ipfs';
import BigNumber from 'bignumber.js';

const tabs = [
  'Create & Tokenize',
  'Tokenize',
];

type FormValues = {
  asset: any
  name: string
  description: string
  symbol: string
  totalSupply: number
  burnPercent: number
};

const Create: React.FC = () => {
  const { t } = useTranslation(['common', 'create']);
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [customSymbol, setCustomSymbol] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [pendingMessage, setPendingMessage] = useState<string>();

  // const [image, setImage] = useState<File | null>(null);
  //
  // const captureFile = (event) => {
  //   event.preventDefault();
  //   const file = event.target.files[0];
  //   setImage(file);
  // };
  //
  // const onSubmit = async (event) => {
  //   event.preventDefault();
  //   const file = await ipfs.add({
  //     path: image?.name,
  //     content: image,
  //   },
  //   {
  //     wrapWithDirectory: true,
  //   });
  //   console.log(`https://ipfs.io/ipfs/${file.cid.string}/${image?.name}`);
  // };

  const { Form } = withTypes<FormValues>();

  const onSubmit = useCallback(async (
    values: FormValues,
    form: FormApi<FormValues>,
  ) => {
    setPendingMessage('Loading asset to IPFS');
    // Load file to ipfs and format it
    const fileName = formatName(values.asset[0].name);
    const ipfsFile = await ipfs.add({
      path: fileName,
      content: values.asset[0].file,
    },
    {
      wrapWithDirectory: true,
    });
    const ipfsFileUrl = `ipfs://${ipfsFile.cid.string}/${fileName}`;

    setPendingMessage('Loading NFT JSON to IPFS');
    // Load json to ipfs and format it
    const nftData = {
      name: values.name,
      description: values.description,
      image: ipfsFileUrl,
    };
    const nftJSON = JSON.stringify(nftData);
    const jsonPath = `${formatName(values.name)}.json`;
    const json = await ipfs.add({
      path: jsonPath,
      content: nftJSON,
    },
    {
      wrapWithDirectory: true,
    });
    const ipfsJsonUrl = `ipfs://${json.cid.string}/${jsonPath}`;

    console.log({
      _tokenURI: ipfsJsonUrl,
      amount: new BigNumber(values.totalSupply),
      minLevel: new BigNumber(values.burnPercent),
      symbol: values.symbol,
    });
  }, []);

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
          <Form
            onSubmit={onSubmit}
            initialValues={{ symbol: 'FNFT', burnPercent: 50 }}
            render={({
              handleSubmit, submitting,
            }) => (
              <form onSubmit={handleSubmit}>
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
                <Field<FileList>
                  name="asset"
                >
                  {({ input: { value, onChange, ...input }, meta }) => (
                    <Input
                      {...input}
                      type="file"
                      className={s.input}
                      label="Upload file"
                      required
                      onChange={({ target }) => onChange(target.files)}
                      disabled={selectedTab === tabs[1]}
                      error={(meta.touched && meta.error) || meta.submitError}
                      success={!meta.error && meta.touched && !meta.submitError}
                    />
                  )}
                </Field>
                <Field
                  name="name"
                  validate={composeValidators(
                    required,
                  )}
                >
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      type="text"
                      className={s.input}
                      label="Name"
                      placeholder="e.g. My Awesome NFT"
                      required
                      disabled={selectedTab === tabs[1]}
                      error={(meta.touched && meta.error) || meta.submitError}
                      success={!meta.error && meta.touched && !meta.submitError}
                    />
                  )}
                </Field>
                <Field
                  name="description"
                  validate={composeValidators(
                    required,
                  )}
                >
                  {({ input, meta }) => (
                    <Input
                      {...input}
                      textarea
                      className={s.input}
                      label="Description"
                      placeholder="e.g. Some words about my token"
                      required
                      disabled={selectedTab === tabs[1]}
                      error={(meta.touched && meta.error) || meta.submitError}
                      success={!meta.error && meta.touched && !meta.submitError}
                    />
                  )}
                </Field>
                <div className={cx(s.input, s.symbol)}>
                  {selectedTab === tabs[0] && (
                  <Switcher
                    isOn={customSymbol}
                    onSwitch={() => setCustomSymbol(!customSymbol)}
                    className={s.switcher}
                  />
                  )}
                  <Field
                    name="symbol"
                    validate={composeValidators(
                      required,
                    )}
                  >
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        type="text"
                        label={selectedTab === tabs[0] ? 'Custom token symbol' : 'Token symbol'}
                        placeholder="FNFT"
                        disabled={!customSymbol || selectedTab === tabs[1]}
                        required={customSymbol}
                        error={(meta.touched && meta.error) || meta.submitError}
                        success={!meta.error && meta.touched && !meta.submitError}
                      />
                    )}
                  </Field>
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
                  <Field
                    name="totalSupply"
                    validate={composeValidators(
                      required,
                    )}
                  >
                    {({ input, meta }) => (
                      <Input
                        {...input}
                        type="text"
                        label="Total supply"
                        placeholder="1200329"
                        currency="FNFT"
                        error={(meta.touched && meta.error) || meta.submitError}
                        success={!meta.error && meta.touched && !meta.submitError}
                      />
                    )}
                  </Field>
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
                    <Field
                      name="burnPercent"
                      validate={composeValidators(
                        required,
                      )}
                    >
                      {({ input, meta }) => (
                        <Input
                          {...input}
                          className={cx(s.sliderInput, s.inputPercent)}
                          sizeT="small"
                          theme="green"
                          type="number"
                          value={sliderValue.toFixed(2)}
                          onChange={(e) => setSliderValue(+e.target.value)}
                          currency="%"
                          error={(meta.touched && meta.error) || meta.submitError}
                          success={!meta.error && meta.touched && !meta.submitError}
                        />
                      )}
                    </Field>
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
                  type="submit"
                  className={s.button}
                  disabled={submitting}
                >
                  Create
                </Button>
              </form>
            )}
          />
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
