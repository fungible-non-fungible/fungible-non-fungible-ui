import React, { useCallback, useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextSeo } from 'next-seo';
import { Field, withTypes } from 'react-final-form';
import { FormApi, getIn } from 'final-form';
import { useWallet } from 'use-wallet';
import { BigNumber as EthersBigNumber } from 'ethers';
import focusDecorator from 'final-form-focus';

import { zeroAddress } from '@utils/defaults';
import {
  convertFromNumberToPercent,
  convertFromPercentToNumber,
  formatName,
} from '@utils/helpers';
import {
  composeValidators,
  required,
} from '@utils/validators';
import { ipfs } from '@utils/ipfs';
import useMarketplaceContract from '@contracts/useMarketplaceContract';
import { BaseLayout } from '@layouts/BaseLayout';
import { Container } from '@components/ui/Container';
import { Row } from '@components/ui/Row';
import { Heading } from '@components/ui/Heading';
import { Tabs } from '@components/ui/Tabs';
import { Input } from '@components/ui/Input';
import { Switcher } from '@components/ui/Switcher';
import { Slider } from '@components/ui/Slider';
import { Button } from '@components/ui/Button';
import { Modal } from '@components/ui/Modal';
import { Loader } from '@components/ui/Loader';
import { NftCard } from '@components/common/NftCard';

import s from '@styles/Create.module.sass';

const findInput = (inputs: any, errors: any) => inputs.find((input: any) => {
  const name = input.name || input.id; // <------------ THERE
  return name && getIn(errors, name);
});

const focusOnError = focusDecorator(undefined, findInput);

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
  const { account } = useWallet();
  const marketplaceContract = useMarketplaceContract(true);

  // States
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [customSymbol, setCustomSymbol] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string>();

  const { Form } = withTypes<FormValues>();

  const onSubmit = useCallback(async (
    values: FormValues,
    form: FormApi<FormValues>,
  ) => {
    console.log('form', form);
    if (!marketplaceContract || pendingMessage) {
      return;
    }
    try {
      // Load file to ipfs and format it
      setPendingMessage('Loading asset to IPFS');
      const fileName = formatName(values.asset[0].name);
      const ipfsFile = await ipfs.add({
        path: fileName,
        content: values.asset[0].file,
      },
      {
        wrapWithDirectory: true,
      });
      const ipfsFileUrl = `ipfs://${ipfsFile.cid.string}/${fileName}`;

      // Load json to ipfs and format it
      setPendingMessage('Loading NFT JSON to IPFS');
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
        amount: EthersBigNumber.from(values.totalSupply.toString()),
        minLevel: EthersBigNumber.from(values.burnPercent.toString()),
        symbol: values.symbol,
      });

      // Allowance for fee
      // setPendingMessage('Setting allowance for BNB');
      // await ensureAllowance(
      //   marketplaceContract,
      //   {
      //     owner: account!,
      //     spender: marketplaceAddress,
      //     expense: convertUnits(new BigNumber(0.007), -8),
      //   },
      // );

      // Creating NFT
      setPendingMessage('Creating NFT');
      const resultOfCreation = marketplaceContract.createNFT(
        ipfsJsonUrl,
        EthersBigNumber.from(values.totalSupply.toString()),
        EthersBigNumber.from(+values.burnPercent.toFixed(0).toString()),
        values.symbol,
      );
      if (!resultOfCreation) {
        throw new Error('Something went wrong when creating NFT');
      }
    } catch (e) {
      alert(`Error: ${e}`);
    } finally {
      setPendingMessage(undefined);
    }
  }, [marketplaceContract, pendingMessage]);

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
            // @ts-ignore
            decorators={[focusOnError]}
            initialValues={{ symbol: 'FNFT', burnPercent: 50 }}
            mutators={{
              setBurnPercent: ([value], state, utils) => {
                utils.changeValue(state, 'burnPercent', () => value);
              },
            }}
            render={({
              form, handleSubmit, submitting, values,
            }) => (
              <div className={s.wrapper}>
                <form className={s.form} onSubmit={handleSubmit}>
                  {selectedTab === tabs[1] && (
                  <>
                    <Input
                      type="text"
                      className={s.input}
                      label="NFT address"
                      placeholder="0x00...000"
                    />
                    <Input
                      type="text"
                      className={s.input}
                      label="NFT id"
                      placeholder="2"
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
                          inputClassName={s.symbolInput}
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
                          currency={values.symbol || 'FNFT'}
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
                            value={(+input.value).toFixed(2)}
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
                        value={convertFromPercentToNumber(
                          values.burnPercent,
                          +values.totalSupply || 0,
                        ).toFixed(2)}
                        onChange={
                          (e) => form.mutators.setBurnPercent(
                            convertFromNumberToPercent(
                              +e.target.value,
                              +values.totalSupply || 0,
                            ),
                          )
                        }
                        currency={values.symbol || 'FNFT'}
                      />
                    </div>
                  </div>
                  <Slider
                    minValue={50}
                    maxValue={90}
                    inputValue={values.burnPercent}
                    className={cx(s.input, s.slider)}
                    onDragEnd={(value) => form.mutators.setBurnPercent(value.toFixed(2))}
                  />
                  <Button
                    type="submit"
                    className={s.button}
                    disabled={submitting}
                  >
                    Create
                  </Button>
                </form>
                <NftCard
                  title={values.name || 'Print NFT\'s name'}
                  description={values.description || 'Print NFT\'s description'}
                  className={s.card}
                  author={{
                    accountPkh: account || zeroAddress,
                  }}
                  burnPercent={values.burnPercent}
                  price={(+values.totalSupply).toFixed(0) || 0}
                  symbol={values.symbol || 'FNFT'}
                />
              </div>
            )}
          />
        </Row>
      </Container>
      <Modal isOpen={!!pendingMessage} innerClassName={s.modal}>
        <Loader className={s.loader} />
        <div className={s.modalMessage}>
          {pendingMessage}
        </div>
      </Modal>
    </BaseLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'create']),
  },
});

export default Create;
