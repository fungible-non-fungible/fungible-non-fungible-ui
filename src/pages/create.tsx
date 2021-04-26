import React, { useCallback, useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextSeo } from 'next-seo';
import BigNumber from 'bignumber.js';
import {
  Field,
  withTypes,
} from 'react-final-form';
import {
  FormApi,
  getIn,
} from 'final-form';
import { useWallet } from 'use-wallet';
import { BigNumber as EthersBigNumber } from 'ethers';
import focusDecorator from 'final-form-focus';

import { zeroAddress } from '@utils/defaults';
import {
  convertFromNumberToPercent,
  convertFromPercentToNumber,
  convertUnits,
  formatName,
} from '@utils/helpers';
import {
  composeValidators,
  required,
} from '@utils/validators';
import { ipfs } from '@utils/ipfs';
import { useWalletProvider } from '@utils/wallet';
import useMarketplaceContract from '@contracts/useMarketplaceContract';
import { makeContracts } from '@contracts/useContracts';
import externalNFTAbi from '@contracts/abi/ExternalNFT.json';
import { BaseLayout } from '@layouts/BaseLayout';
import { Container } from '@components/ui/Container';
import { Row } from '@components/ui/Row';
import { Heading } from '@components/ui/Heading';
import { Tabs } from '@components/ui/Tabs';
import { Input } from '@components/ui/Input';
import { MediaInput } from '@components/ui/MediaInput';
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
  liquidityAmount: number
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
  const [showFullTokenizeForm, setShowFullTokenizeForm] = useState(false);
  setShowFullTokenizeForm(false);

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
      const fileName = formatName(values.asset.name);
      const ipfsFile = await ipfs.add({
        path: fileName,
        content: values.asset.file,
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

      // Creating NFT
      setPendingMessage('Creating NFT');
      const resultOfCreation = marketplaceContract
        .createNFT(
          ipfsJsonUrl,
          EthersBigNumber.from(values.totalSupply.toString()),
          EthersBigNumber.from(
            convertUnits(
              new BigNumber(values.totalSupply)
                .multipliedBy(new BigNumber(values.burnPercent).div(new BigNumber(100))),
              -8,
            ).toString(),
          ),
          values.symbol,
          {
            from: account,
            gasLimit: 30000000,
            value: EthersBigNumber.from(
              convertUnits(
                new BigNumber(+values.liquidityAmount + 0.07),
                -18,
              )
                .toString(),
            ),
          },
        );
      if (!resultOfCreation) {
        throw new Error('Something went wrong when creating NFT');
      }
    } catch (e) {
      alert(`Error: ${e}`);
    } finally {
      setPendingMessage(undefined);
    }
  }, [account, marketplaceContract, pendingMessage]);

  const provider = useWalletProvider();
  const loadNftInfo = async (address: string, id: number) => {
    if (!address || !id || !provider) {
      return;
    }

    const contracts = makeContracts(
      {
        addresses: ['0xdf7952b35f24acf7fc0487d01c8d5690a60dba07'],
        abi: externalNFTAbi,
      },
      provider,
    );

    const resultOfInformation = await contracts[0]?.tokenURI(EthersBigNumber.from('1'));
    const jsonResult = await fetch(`https://ipfs.infura.io:5001/api/v0/object/get?arg=${resultOfInformation.replace('ipfs://', '')}`);
    console.log('jsonReslut', jsonResult);
    const jsonResult2 = await fetch(`https://ipfs.io/ipfs/${resultOfInformation.replace('ipfs://', '')}`);
    console.log('jsonReslut2', jsonResult2);
  };

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
              setAsset: ([value], state, utils) => {
                utils.changeValue(state, 'asset', () => value);
              },
              setName: ([value], state, utils) => {
                utils.changeValue(state, 'name', () => value);
              },
              setDescription: ([value], state, utils) => {
                utils.changeValue(state, 'description', () => value);
              },
              setSymbol: ([value], state, utils) => {
                utils.changeValue(state, 'symbol', () => value);
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
                    {!showFullTokenizeForm && (
                      <Button
                        theme="orange"
                        className={s.button}
                        onClick={() => loadNftInfo('123', 1)}
                      >
                        Load NFT&apos;s info
                      </Button>
                    )}
                  </>
                  )}
                  {(selectedTab === tabs[0] || showFullTokenizeForm) && (
                  <>
                    <Field<File>
                      name="asset"
                    >
                      {({ input: { value, onChange, ...input }, meta }) => (
                        <MediaInput
                          {...input}
                          className={s.input}
                          label="Upload file"
                          value={value}
                          onChange={(file) => onChange(file)}
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
                    <Field
                      name="liquidityAmount"
                      validate={composeValidators(
                        required,
                      )}
                    >
                      {({ input, meta }) => (
                        <Input
                          {...input}
                          type="text"
                          label="Liquidity amount"
                          placeholder="1200329"
                          currency="BNB"
                          className={s.input}
                          error={(meta.touched && meta.error) || meta.submitError}
                          success={!meta.error && meta.touched && !meta.submitError}
                        />
                      )}
                    </Field>
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
                  </>
                  )}
                </form>
                <NftCard
                  image={(selectedTab === tabs[0] || showFullTokenizeForm) ? values.asset : null}
                  title={
                    (selectedTab === tabs[0] || showFullTokenizeForm) && values.name
                      ? values.name
                      : 'Print NFT\'s name'
                  }
                  description={
                    (selectedTab === tabs[0] || showFullTokenizeForm) && values.description
                      ? values.description
                      : 'Print NFT\'s description'
                  }
                  className={s.card}
                  author={{
                    accountPkh: account || zeroAddress,
                  }}
                  burnPercent={+(+values.burnPercent).toFixed(0)}
                  price={
                    (selectedTab === tabs[0] || showFullTokenizeForm)
                    && values.totalSupply
                    && values.liquidityAmount
                      ? Number(
                        new BigNumber(values.liquidityAmount)
                          .div(new BigNumber(values.totalSupply))
                          .toFormat(8, BigNumber.ROUND_FLOOR, { decimalSeparator: '.' }),
                      )
                      : 0
                  }
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
