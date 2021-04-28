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
import { utils, BigNumber as EthersBigNumber } from 'ethers';
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
import { WalletConnect } from '@containers/WalletConnect';
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
  const name = input.name || input.id;
  return name && getIn(errors, name);
});

const focusOnError = focusDecorator(undefined, findInput);

const tabs = [
  'Create & Tokenize',
  'Tokenize',
];

type FormValues = {
  nftAddress: string
  nftId: number
  asset: any
  name: string
  description: string
  symbol: string
  totalSupply: number
  liquidityAmount: number
  burnPercent: number
};

enum ModalStatuses {
  Default,
  Error,
  Pending,
}

const CreatePage: React.FC = () => {
  const { t } = useTranslation(['common', 'creating']);
  const { account } = useWallet();
  const provider = useWalletProvider();
  const marketplaceContract = useMarketplaceContract(true);

  // States
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [customSymbol, setCustomSymbol] = useState(false);
  const [modalState, setModalState] = useState<{
    status: ModalStatuses,
    message: string | null
  }>({
    status: ModalStatuses.Default,
    message: null,
  });
  const [showFullTokenizeForm, setShowFullTokenizeForm] = useState(false);

  const { Form } = withTypes<FormValues>();

  const onCreateAndTokenize = useCallback(async (
    values: FormValues,
    form: FormApi<FormValues>,
  ) => {
    if (!marketplaceContract || modalState.status !== ModalStatuses.Default) {
      return;
    }
    try {
      // Load file to ipfs and format it
      setModalState({
        status: ModalStatuses.Pending,
        message: 'Loading asset to IPFS',
      });
      const fileName = formatName(values.asset.name);
      const ipfsFile = await ipfs.add({
        path: fileName,
        content: values.asset,
      },
      {
        wrapWithDirectory: true,
      });
      const ipfsFileUrl = `ipfs://${ipfsFile.cid.string}/${fileName}`;

      // Load json to ipfs and format it
      setModalState({
        status: ModalStatuses.Pending,
        message: 'Loading NFT JSON to IPFS',
      });
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
      setModalState({
        status: ModalStatuses.Pending,
        message: 'Creating NFT',
      });

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
            gasLimit: 5_000_000,
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

      setModalState({
        status: ModalStatuses.Default,
        message: null,
      });

      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      setTimeout(form.restart);
    } catch (e) {
      setModalState({
        status: ModalStatuses.Error,
        message: `${e}`,
      });
    }
  }, [account, marketplaceContract, modalState.status]);

  const loadNftInfo = useCallback(async (
    address: string,
    id: number,
    callback: (name: string, description: string, symbol: string, image: string) => void,
  ) => {
    if (!address || !id || !provider || modalState.status !== ModalStatuses.Default) {
      return;
    }

    try {
      if (!utils.isAddress(address)) {
        throw new Error('Provide a valid contract address.');
      }

      setModalState({
        status: ModalStatuses.Pending,
        message: 'Connecting to contract',
      });
      const contracts = makeContracts(
        {
          addresses: [address], // 0xdf7952b35f24acf7fc0487d01c8d5690a60dba07
          abi: externalNFTAbi,
        },
        provider,
      );

      setModalState({
        status: ModalStatuses.Pending,
        message: 'Getting token URI by id',
      });
      const contractStorage = await contracts[0]?.tokenURI(EthersBigNumber.from(+id));
      const symbol = await contracts[0]?.symbol();

      setModalState({
        status: ModalStatuses.Pending,
        message: 'Fetching token metadata from IPFS',
      });
      const ipfsJson = await fetch(contractStorage.replace('ipfs://', 'https://ipfs.io/ipfs/'));
      const parsedJson = await ipfsJson.json();
      callback(
        parsedJson.name,
        parsedJson.description,
        symbol,
        parsedJson.image.replace('ipfs://', 'https://ipfs.io/ipfs/'),
      );

      setShowFullTokenizeForm(true);

      setModalState({
        status: ModalStatuses.Default,
        message: null,
      });
    } catch (e) {
      setModalState({
        status: ModalStatuses.Error,
        message: `${e}`,
      });
    }
  }, [modalState.status, provider]);

  const onTokenize = useCallback(async (
    values: FormValues,
    form: FormApi<FormValues>,
  ) => {
    if (!marketplaceContract || modalState.status !== ModalStatuses.Default) {
      return;
    }
    try {
      // Creating NFT
      setModalState({
        status: ModalStatuses.Pending,
        message: 'Tokenizing NFT',
      });
      const resultOfCreation = marketplaceContract
        .mint(
          values.nftAddress,
          EthersBigNumber.from(values.nftId),
          EthersBigNumber.from(values.totalSupply.toString()),
          values.symbol,
          EthersBigNumber.from(
            convertUnits(
              new BigNumber(values.totalSupply)
                .multipliedBy(new BigNumber(values.burnPercent).div(new BigNumber(100))),
              -8,
            ).toString(),
          ),
          true,
          {
            from: account,
            gasLimit: 5_000_000,
            value: EthersBigNumber.from(
              convertUnits(
                new BigNumber(+values.liquidityAmount + 0.05),
                -18,
              )
                .toString(),
            ),
          },
        );
      if (!resultOfCreation) {
        throw new Error('Something went wrong when creating NFT');
      }

      setModalState({
        status: ModalStatuses.Default,
        message: null,
      });

      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      setTimeout(form.restart);
    } catch (e) {
      setModalState({
        status: ModalStatuses.Error,
        message: `${e}`,
      });
    }
  }, [account, marketplaceContract, modalState.status]);

  return (
    <BaseLayout>
      <NextSeo
        title={t('creating:Home page')}
        description={t('creating:Home page description. Couple sentences...')}
        openGraph={{
          title: t('creating:Home page'),
          description: t('creating:Home page description. Couple sentences...'),
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
            onSubmit={selectedTab === tabs[0] ? onCreateAndTokenize : onTokenize}
            // @ts-ignore
            decorators={[focusOnError]}
            initialValues={{ symbol: 'FNFT', burnPercent: 50 }}
            mutators={{
              setInputValue: ([name, value], state, formUtils) => {
                formUtils.changeValue(state, name, () => value);
              },
            }}
            render={({
              form, handleSubmit, submitting, values,
            }) => (
              <div className={s.wrapper}>
                <form className={s.form} onSubmit={handleSubmit}>
                  {selectedTab === tabs[1] && (
                  <>
                    {!showFullTokenizeForm ? (
                      <>
                        <Field name="nftAddress">
                          {({ input, meta }) => (
                            <Input
                              {...input}
                              className={s.input}
                              label="NFT address"
                              placeholder="0x00...000"
                              error={(meta.touched && meta.error) || meta.submitError}
                              success={!meta.error && meta.touched && !meta.submitError}
                            />
                          )}
                        </Field>
                        <Field name="nftId">
                          {({ input, meta }) => (
                            <Input
                              {...input}
                              className={s.input}
                              label="NFT id"
                              placeholder="2"
                              error={(meta.touched && meta.error) || meta.submitError}
                              success={!meta.error && meta.touched && !meta.submitError}
                            />
                          )}
                        </Field>
                        <Button
                          theme="orange"
                          className={s.button}
                          onClick={() => loadNftInfo(
                            values.nftAddress,
                            values.nftId,
                            (name, description, symbol, image) => {
                              form.mutators.setInputValue('name', name);
                              form.mutators.setInputValue('description', description);
                              form.mutators.setInputValue('symbol', symbol);
                              form.mutators.setInputValue('asset', image);
                            },
                          )}
                        >
                          Load NFT&apos;s info
                        </Button>
                      </>
                    ) : (
                      <Button
                        theme="pink"
                        className={s.buttonReload}
                        onClick={() => {
                          form.mutators.setInputValue('nftAddress', '');
                          form.mutators.setInputValue('nftId', '');
                          form.mutators.setInputValue('name', '');
                          form.mutators.setInputValue('description', '');
                          form.mutators.setInputValue('symbol', 'FNFT');
                          form.mutators.setInputValue('asset', '');
                          setShowFullTokenizeForm(false);
                        }}
                      >
                        Reload NFT&apos;s info
                      </Button>
                    )}
                  </>
                  )}
                  {(selectedTab === tabs[0] || showFullTokenizeForm) && (
                  <>
                    <Field<File | string>
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
                          value={convertFromPercentToNumber(
                            values.burnPercent,
                            +values.totalSupply || 0,
                          ).toFixed(2)}
                          onChange={
                            (e) => form.mutators.setInputValue(
                              'burnPercent',
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
                      onDragEnd={(value) => form.mutators.setInputValue('burnPercent', value.toFixed(2))}
                    />
                    {account ? (
                      <Button
                        type="submit"
                        className={s.button}
                        disabled={submitting}
                      >
                        Create
                      </Button>
                    ) : (
                      <WalletConnect
                        theme="orange"
                        className={s.button}
                      />
                    )}
                  </>
                  )}
                </form>
                <NftCard
                  image={(selectedTab === tabs[0] || showFullTokenizeForm) ? values.asset : null}
                  title={
                    (selectedTab === tabs[0] || showFullTokenizeForm) && values.name
                      ? values.name
                      : 'Type NFT\'s name...'
                  }
                  symbol={values.symbol || 'FNFT'}
                  description={
                    (selectedTab === tabs[0] || showFullTokenizeForm) && values.description
                      ? values.description
                      : 'Type NFT\'s description...'
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
      <Modal
        isOpen={modalState.status !== ModalStatuses.Default}
        onRequestClose={
          () => modalState.status === ModalStatuses.Error
            && setModalState({
              status: ModalStatuses.Default,
              message: null,
            })
        }
        innerClassName={s.modal}
      >
        {modalState.status === ModalStatuses.Pending && (
          <Loader className={s.loader} />
        )}
        {modalState.status === ModalStatuses.Error && (
          <span className={s.errorHeader}>Ooops... Error!</span>
        )}
        <div className={s.modalMessage}>
          {modalState.message}
        </div>
        {modalState.status === ModalStatuses.Error && (
          <Button
            className={s.errorButton}
            theme="orange"
            onClick={() => setModalState({
              status: ModalStatuses.Default,
              message: null,
            })}
          >
            Try once more
          </Button>
        )}
      </Modal>
    </BaseLayout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...await serverSideTranslations(locale, ['common', 'creating']),
  },
});

export default CreatePage;
