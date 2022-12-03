import { NAMO_SC, NAMO_Token } from '@constants/rent';
import PopupLoadingMetamask from '@containers/common/PopupLoadingMetamask';
import NavigationBackBlocker from '@containers/navigator/NavigationBackBlocker';
import NavigationGestureBlocker from '@containers/navigator/NavigationGestureBlocker';
import { useAuth } from '@context/auth';
import { Images } from '@images';
import { ERC_721, InfoNFT, LOAN_NFT, nftApi } from '@namo-workspace/services';
import Button from '@namo-workspace/ui/Button';
import InputField from '@namo-workspace/ui/form/InputField';
import SelectField from '@namo-workspace/ui/form/SelectField';
import Input from '@namo-workspace/ui/Input';
import PopupExtra from '@namo-workspace/ui/PopupExtra';
import { ERROR, parseWei, SUCCESS, WARNING } from '@namo-workspace/utils';
import setNftForRentSchema from '@namo-workspace/yupSchema/setNftForRentSchema';
import {
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTab, ProfileRouter } from '@routes/routes.constants';
import * as Sentry from '@sentry/react-native';
import { showMessageError, showMessageSuccess } from '@services/showMessage';
import { getWeb3Instance } from '@services/web3';
import {
  formatWalletServiceUrl,
  WalletConnectContext,
} from '@walletconnect/react-native-dapp';
import { FieldArray, Formik, FormikProps } from 'formik';
import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Linking } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AbiItem } from 'web3-utils';
import { AppRootParams } from '../../routes/routes.model';
import {
  AddPackageBtn,
  AddPackageText,
  DetailContainer,
  PackageClear,
  PackageContent,
  PackageHeader,
  PackageTitle,
  Price,
  PricePerDay,
  PriceText,
  styles,
  ToastMessage,
  ToastNotification,
  WrapButtons,
} from './NFTForRent.style';

const { IcEthereum, IcNotification, IcPlus, IcClear } = Images;

export type NFTForRentProp = NativeStackNavigationProp<
  AppRootParams,
  'NFT_DETAIL_FOR_RENT'
>;

type OptionType = {
  label: string;
  value: string;
  duration?: number;
  id?: string;
};

interface Package {
  duration: OptionType;
  price: string;
}

interface Values {
  packages: Package[];
}

const NFTForRent: FC = () => {
  const { params } = useRoute<RouteProp<ParamListBase & InfoNFT>>();
  const detail: InfoNFT = JSON.parse(params['detail']);
  const isEdit: boolean = params['isEdit'];
  const { address } = useAuth();
  const { walletServices, connector } = useContext(WalletConnectContext);
  const [duration, setDuration] = useState<OptionType[]>([]);
  const navigation = useNavigation<NFTForRentProp>();
  const canBypassNavigate = useRef(false);
  const formikRef = useRef<FormikProps<Values>>(null);

  const [approved, setApproved] = useState<boolean>(false);
  const [approveLoading, setApproveLoading] = useState<boolean>(false);
  const [transferLoading, setTransferLoading] = useState<boolean>(false);
  const { tokenAddress, tokenId } = detail;
  const [visible, setVisible] = useState<boolean>(false);
  const web3 = getWeb3Instance({ connector });

  const [isUpdated, setIsUpdated] = useState<boolean>(false);

  const initialValue: Values = useMemo(() => {
    if (!detail) {
      return null;
    }
    if (!isEdit) {
      return {
        packages: [
          {
            duration: { label: '', value: '', duration: 0, id: '' },
            price: '',
          },
        ],
      };
    } else {
      return {
        packages: detail.packages.map((item) => ({
          duration: {
            label: item.label,
            value: item.unitId,
            duration: item.duration,
            id: item.id,
          },
          price: `${parseWei(item.price)}`,
        })),
      };
    }
  }, [detail, isEdit]);

  const getUnits = async () => {
    const units = await nftApi.getUnits();
    setDuration(
      units.map((item) => ({
        label: item.label,
        value: item.id,
        duration: item.duration,
      }))
    );
  };

  const handleUnsave = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const metaMaskCheck = async () => {
    const connectionUrl = `${formatWalletServiceUrl(walletServices[3])}/wc`;
    const metaMaskExist = await Linking.canOpenURL(connectionUrl);

    return metaMaskExist;
  };

  useEffect(() => {
    getUnits();
  }, []);

  useEffect(() => {
    const effect = async () => {
      const ERC721Contract = new web3.eth.Contract(
        ERC_721 as unknown as AbiItem,
        tokenAddress
      );
      const isApproved = await ERC721Contract.methods
        .isApprovedForAll(address, NAMO_SC)
        .call();
      setApproved(!!isApproved);
    };
    effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const approveSetNFT = useCallback(
    async (tokenAddress: string, tokenId: string, values: Values) => {
      setApproveLoading(true);
      setVisible(false);
      try {
        if (values.packages.length < 1 || values.packages.length > 4) {
          throw new Error('Packages are required and less than four items!');
        }

        if (detail.contractType !== 'ERC721') {
          canBypassNavigate.current = true;
          navigation.navigate(MainTab.PROFILE_STACK, {
            screen: ProfileRouter.PROFILE,
          });
          throw new Error('Contract type is not supported!');
        }

        const connectionUrl = `${formatWalletServiceUrl(walletServices[3])}/wc`;

        if (!(await Linking.canOpenURL(connectionUrl)) || !address) {
          canBypassNavigate.current = true;
          navigation.navigate(MainTab.PROFILE_STACK);
          throw new Error(
            'We can’t connect to Metamask. Please check your Metamask account.'
          );
        }
        const ERC721Contract = new web3.eth.Contract(
          ERC_721 as unknown as AbiItem,
          tokenAddress
        );
        const isApproved = await ERC721Contract.methods
          .isApprovedForAll(address, NAMO_SC)
          .call();

        if (!isApproved) {
          await ERC721Contract.methods
            .setApprovalForAll(NAMO_SC, true)
            .send({ from: address, gasPrice: 0x2540be400 });
        }
        setApproveLoading(false);
        setVisible(true);
        setApproved(true);
      } catch (error) {
        setApproveLoading(false);
        setVisible(false);
        setApproved(false);
        Sentry.captureException(error);
        if (error.toString().includes('rejected')) {
          showMessageError(ERROR.ER_DENIED_METAMASK);
        } else if (error.toString()) {
          showMessageError(error.toString());
        } else {
          showMessageError(ERROR.ER_SET_FOR_RENT);
        }
      }
    },
    [address, detail, navigation, walletServices, web3]
  );

  const updateNft = async (values: Values) => {
    setVisible(false);
    setTransferLoading(true);
    try {
      const NamoContract = new web3.eth.Contract(
        LOAN_NFT.abi as unknown as AbiItem,
        NAMO_SC
      );

      await NamoContract.methods
        .editItem(
          detail.marketItem,
          values.packages.map((item: Package) => item.duration.duration),
          values.packages.map((item: Package) =>
            web3.utils.toWei(`${+item.price}`)
          ),
          NAMO_Token
        )
        .send({ from: address })
        .on('receipt', () => {
          setIsUpdated(true);
        });
    } catch (error) {
      setTransferLoading(false);
      Sentry.captureException(error);
      if (error.toString().includes('rejected')) {
        showMessageError(ERROR.ER_DENIED_METAMASK);
      } else if (error.toString()) {
        showMessageError(error.toString());
      } else {
        showMessageError(ERROR.ER_EDIT_RENTING);
      }
      setTransferLoading(false);
    }
  };

  useEffect(() => {
    if (isUpdated) {
      const timer = setTimeout(() => {
        canBypassNavigate.current = true;
        setTransferLoading(false);
        if (isEdit) {
          navigation.navigate(ProfileRouter.NFT_DETAIL_FOR_RENT, {
            shouldUpdateStatus: true,
            fromEdit: true,
            tokenAddress: tokenAddress,
            tokenId: tokenId,
            title: detail?.name,
          });
          showMessageSuccess(SUCCESS.UPDATED_INFO_RENTAL);
        } else {
          setVisible(false);
          navigation.navigate(ProfileRouter.NFT_DETAIL_FOR_RENT, {
            shouldUpdateStatus: true,
            tokenAddress: tokenAddress,
            tokenId: tokenId,
            title: detail?.name,
          });
          showMessageSuccess(SUCCESS.SETUP_FOR_RENT_NFT);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [detail?.name, isEdit, isUpdated, navigation, tokenAddress, tokenId]);

  const handleSubmit = async (values: Values) => {
    if (!(await metaMaskCheck())) {
      showMessageError(ERROR.ER_NO_METAMASK);
    } else {
      if (isEdit) updateNft(values);
      else {
        setVisible(true);
      }
    }
  };

  const handleTransfer = useCallback(
    async (values: Values) => {
      setVisible(false);
      setTransferLoading(true);
      try {
        const NamoContract = new web3.eth.Contract(
          LOAN_NFT.abi as unknown as AbiItem,
          NAMO_SC
        );
        await NamoContract.methods
          .listItem(
            tokenAddress,
            tokenId,
            values.packages.map((item: Package) => item.duration.duration),
            values.packages.map((item: Package) =>
              web3.utils.toWei(`${+item.price}`)
            ),
            NAMO_Token
          )
          .send({ from: address })
          .on('transactionHash', async function (hash) {
            // showMessageInfo(WARNING.NFT_RENTAL_PROCESSING);
          })
          .on('receipt', () => {
            setIsUpdated(true);
          });
      } catch (error) {
        setTransferLoading(false);
        Sentry.captureException(error);
        if (error.toString().includes('rejected')) {
          showMessageError(ERROR.ER_DENIED_METAMASK);
        } else if (error.toString()) {
          showMessageError(error.toString());
        } else {
          showMessageError(ERROR.ER_SET_FOR_RENT);
        }
      }
    },
    [address, tokenAddress, tokenId, web3.eth.Contract, web3.utils]
  );

  const buttons = useMemo(
    () => [
      {
        title: approved ? 'Approved' : 'Approve',
        type: 'approve',
        loading: approveLoading,
        disabled: approved || approveLoading,
        onPress: () =>
          approveSetNFT(tokenAddress, tokenId, formikRef?.current?.values),
      },
      {
        title: 'Send to the vault',
        type: 'transfer',
        loading: transferLoading,
        disabled: !approved || transferLoading,
        onPress: () => handleTransfer(formikRef?.current?.values),
      },
    ],
    [
      approveLoading,
      approveSetNFT,
      approved,
      handleTransfer,
      tokenAddress,
      tokenId,
      transferLoading,
    ]
  );

  return (
    <DetailContainer>
      <Formik
        initialValues={initialValue}
        validationSchema={setNftForRentSchema}
        enableReinitialize
        onSubmit={handleSubmit}
        innerRef={formikRef}
      >
        {({ values, handleSubmit, dirty }) => {
          const packageLength = values.packages.length,
            isDisableAddPack = packageLength >= 4;
          return (
            <>
              <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <NavigationGestureBlocker when={dirty} />
                <NavigationBackBlocker
                  when={dirty}
                  getCanByPass={() => canBypassNavigate.current}
                />
                <ToastNotification>
                  <IcNotification />
                  <ToastMessage>You can add up to 4 packages</ToastMessage>
                </ToastNotification>
                <FieldArray name="packages">
                  {({ remove, push }) => (
                    <>
                      {values.packages.map((item: Package, i: number) => {
                        const getPricePerDay = (price: number) => {
                          return (
                            price /
                            (values.packages[i].duration.duration /
                              (24 * 60 * 60))
                          ).toFixed(8);
                        };
                        return (
                          <PackageContent key={i}>
                            <PackageHeader>
                              <PackageTitle>Package {i + 1}</PackageTitle>
                              {packageLength > 1 ? (
                                <PackageClear onPress={() => remove(i)}>
                                  <IcClear />
                                </PackageClear>
                              ) : null}
                            </PackageHeader>
                            <SelectField
                              options={duration}
                              name={`packages.[${i}].duration`}
                              type="full"
                              placeholder="Duration"
                              label="Rental Duration"
                              isRequired={true}
                              disabledOptions={values.packages.map(
                                (pack: Package) => pack.duration.value
                              )}
                            />

                            <Price>
                              <Input
                                label="Price"
                                isRequired
                                prefix={<IcEthereum width={16} height={16} />}
                                placeholder="USDC"
                                style={{ width: 115 }}
                                editable={false}
                              />
                              <InputField
                                label="&ensp;"
                                placeholder="Amount"
                                name={`packages.[${i}].price`}
                                comma
                                style={{ flex: 1, marginLeft: 10 }}
                              />
                            </Price>

                            {!!item.price &&
                            !!values.packages[i].duration.value ? (
                              <PricePerDay>
                                <IcEthereum width={20} height={20} />
                                <PriceText>
                                  {' '}
                                  {parseFloat(
                                    getPricePerDay(Number(item.price))
                                  )}
                                  /day
                                </PriceText>
                              </PricePerDay>
                            ) : null}
                          </PackageContent>
                        );
                      })}

                      {packageLength < 4 ? (
                        <AddPackageBtn
                          activeOpacity={isDisableAddPack}
                          onPress={() =>
                            !isDisableAddPack
                              ? push({
                                  duration: {
                                    label: '',
                                    value: '',
                                    duration: 0,
                                    id: '',
                                  },
                                  price: '',
                                })
                              : null
                          }
                        >
                          <IcPlus />
                          <AddPackageText>Add Package</AddPackageText>
                        </AddPackageBtn>
                      ) : null}
                    </>
                  )}
                </FieldArray>

                <ToastNotification>
                  <IcNotification />
                  <ToastMessage>
                    There is a transaction fee of 2.5% when your NFT is
                    successfully rented.
                  </ToastMessage>
                </ToastNotification>
              </KeyboardAwareScrollView>

              <WrapButtons>
                <Button
                  size="medium"
                  style={styles.btn_edit}
                  color="white"
                  onPress={handleUnsave}
                  disabled={transferLoading}
                >
                  Cancel
                </Button>
                <Button
                  size="medium"
                  style={styles.btn_edit}
                  onPress={() => handleSubmit()}
                  disabled={transferLoading}
                >
                  Submit
                </Button>
              </WrapButtons>
              <PopupExtra
                isVisible={visible}
                title="Set NFT For Rent"
                onClose={() => setVisible(false)}
                buttons={buttons}
              />
              <PopupLoadingMetamask
                visible={transferLoading || approveLoading}
              />
            </>
          );
        }}
      </Formik>
    </DetailContainer>
  );
};

export default NFTForRent;
