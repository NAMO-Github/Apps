import { ReactComponent as IconPlus } from '@assets/images/common/ic_bx_plus.svg';
import { ReactComponent as IconBxX } from '@assets/images/common/ic_bx_x.svg';
import { ReactComponent as IcInfo } from '@assets/images/common/ic_info.svg';
import { ReactComponent as ICEtherium } from '@assets/images/ic-Etherium.svg';
import ModalWaitingMetamask from '@components/Modal/ModalWaitingMetamask';
import { MY_NFT_ROUTES, PROFILE_ROUTES, ROUTES } from '@constants/routes';
import { useAuth } from '@context/auth';
import {
  useNavigateWithoutPrompt,
  usePromptModal,
} from '@context/prompt-modal';
import { MetamaskError, useWalletAuth } from '@context/wallet-auth';
import useMediaQuery, { QUERY } from '@hooks/useMediaQuery';
import useToggle from '@hooks/useToggle';
import { environment } from '@namo-workspace/environments';
import {
  nftApi,
  STATUS_NFT,
  Unit,
  useGetNftDetail,
} from '@namo-workspace/services';
import { Colors } from '@namo-workspace/themes';
import Button from '@namo-workspace/ui/Button';
import InputNumberField from '@namo-workspace/ui/Form/InputNumberField';
import SingleSelectField, {
  SelectOption,
} from '@namo-workspace/ui/Form/SingleSelectField';
import TextField from '@namo-workspace/ui/Form/TextField';
import { Body2 } from '@namo-workspace/ui/Typography';
import { ERROR, parseWei, SUCCESS } from '@namo-workspace/utils';
import {
  setNftForRentSchemaWeb,
  SET_NFT_FOR_RENT_FIELDS,
} from '@namo-workspace/yupSchema/setNftForRentSchema';
import * as Sentry from '@sentry/react';
import tokenServices from '@services/token.services';
import { FieldArray, Formik } from 'formik';
import { toLower } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { List } from 'react-content-loader';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import NftActionLayout from '../../layout/NftAction.layout';
import ModalApprove from './ModalApprove';

export interface Package {
  duration: string;
  price: string;
  unit: string;
}
export interface ValuesType {
  packages: Package[];
}
interface Props {
  isEdit?: boolean;
  tokenId?: string;
  tokenAddress?: string;
  nftId?: string;
}

export default function SetNftForRent({
  isEdit = false,
  tokenId = '',
  tokenAddress = '',
}: Props) {
  const navigate = useNavigate();
  const navigateWithoutPrompt = useNavigateWithoutPrompt();
  const { userInfo } = useAuth();
  const { web3, account, metamask, chainId } = useWalletAuth();
  const { isOpen, open, close } = useToggle();

  const isDesktop = useMediaQuery(QUERY.DESKTOP);

  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isEdited, setIsEdited] = useState<boolean>(false);

  const [packageInfo, setPackageInfo] = useState<{
    durations: number[];
    prices: number[];
  }>({
    durations: [],
    prices: [],
  });

  const [formIsDirty, setFormIsDirty] = useState<boolean>(false);

  usePromptModal(
    {
      size: 'small',
      title: 'Information will not be saved',
      description: 'Are you sure? Information entered will not be saved.',
      okText: 'Leave',
    },
    formIsDirty
  );

  const {
    detailNft,
    isLoading: isLoadingGetDetail,
    error,
  } = useGetNftDetail({
    tokenAddress,
    tokenId,
  });

  const durationOption: SelectOption[] = useMemo(
    () => units.map((unit) => ({ label: unit.label, value: unit.id })),
    [units]
  );

  const initValue = useMemo(() => {
    if (isEdit && detailNft && detailNft.packages) {
      const { packages } = detailNft;

      return {
        packages: packages.map(
          (item) =>
            ({
              duration: item.unitId,
              unit: 'USDC',
              price: `${parseWei(item.price)}`,
            } as Package)
        ),
      };
    } else {
      return {
        packages: [{ duration: '', unit: 'USDC', price: '' }],
      };
    }
  }, [detailNft, isEdit]);

  useEffect(() => {
    if (
      detailNft?.status === STATUS_NFT.RENTED ||
      (detailNft?.status === STATUS_NFT.FOR_RENT && !isEdit)
    ) {
      navigate(`${ROUTES.PROFILE}/${PROFILE_ROUTES.FOR_RENT}`);
      return;
    }

    if (detailNft && detailNft.rentalAddress) {
      if (toLower(detailNft?.rentalAddress) !== toLower(userInfo?.address)) {
        toast.error(ERROR.ER_YOU_NOT_NFT_OWNER);
        navigate(`${ROUTES.NFT}/${tokenAddress}/${tokenId}`);
      }
    } else if (
      detailNft &&
      detailNft.ownerOf &&
      toLower(detailNft?.ownerOf) !== toLower(userInfo?.address)
    ) {
      toast.error(ERROR.ER_YOU_NOT_NFT_OWNER);
      navigate(`${ROUTES.NFT}/${tokenAddress}/${tokenId}`);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailNft]);

  useEffect(() => {
    nftApi.getUnits().then((units) => {
      setUnits(units);
    });
  }, []);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (isEdited) {
      toast.success(SUCCESS.UPDATED_INFO_RENTAL);
      navigateWithoutPrompt(`${ROUTES.NFT}/${tokenAddress}/${tokenId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdited]);

  const handleSetForRent = useCallback(
    async (values: ValuesType) => {
      const durations: number[] = [];
      const prices: number[] = [];
      values.packages.forEach((packageItem) => {
        prices.push(+packageItem.price);
        durations.push(
          units.find((unit) => unit.id === packageItem.duration)?.duration || 0
        );
      });
      if (!isEdit) {
        setPackageInfo({ durations, prices });
        open();
      } else {
        if (chainId && !environment.mainnetChainId.includes(chainId)) {
          toast.error(ERROR.ER_EDIT_RENTING);
          return;
        }
        if (web3 && account && metamask) {
          setIsLoading(true);
          try {
            if (!detailNft) throw new Error();

            await tokenServices.editRenting(
              web3,
              detailNft.contractAddress || environment.namoSmartContract,
              account,
              detailNft.marketItem || '',
              durations,
              prices,
              environment.namoTokenSC
            );

            setTimeout(() => {
              setIsEdited(true);
              setIsLoading(false);
            }, 3000);
            // wait for BE handle event
          } catch (error) {
            setIsLoading(false);
            Sentry.captureException(error);
            if ((error as MetamaskError).code === 4001) {
              toast.error(ERROR.ER_DENIED_METAMASK);
            } else if ((error as MetamaskError).message) {
              toast.error((error as MetamaskError).message);
            } else {
              toast.error(ERROR.ER_EDIT_RENTING);
            }
          }
        } else {
          toast.error(ERROR.ER_NO_METAMASK);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account, detailNft, isEdit, metamask, open, units, web3, chainId]
  );

  const handleOk = useCallback(() => {
    close();

    navigateWithoutPrompt(
      `${ROUTES.NFT}/${detailNft?.tokenAddress || ''}/${
        detailNft?.tokenId || 0
      }`,
      {
        state: { from: MY_NFT_ROUTES.SET_FOR_RENT },
      }
    );
  }, [close, detailNft, navigateWithoutPrompt]);

  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <>
      <NftActionLayout
        detailNft={detailNft}
        onNavigateBack={handleCancel}
        isLoading={isLoadingGetDetail}
      >
        <>
          {isLoadingGetDetail ? (
            <List className="mb-2" />
          ) : (
            <InfoS>
              <IcInfo className="me-2" />
              <InfoTextS>You can add up to 4 packages</InfoTextS>
            </InfoS>
          )}
          {isLoadingGetDetail ? (
            <>
              <List className="mb-2" />
              <List className="mb-2" />
              <List className="mb-2" />
            </>
          ) : (
            <Formik<ValuesType>
              initialValues={initValue}
              validationSchema={setNftForRentSchemaWeb}
              onSubmit={handleSetForRent}
              enableReinitialize
            >
              {({ handleSubmit, dirty, values }) => {
                setFormIsDirty(dirty);
                return (
                  <form onSubmit={handleSubmit}>
                    <FieldArray
                      name="packages"
                      render={({ remove, push }) => (
                        <div className="mb-4">
                          {values.packages &&
                            values.packages.length > 0 &&
                            values.packages.map((packageItem, index) => {
                              const duration =
                                units.find(
                                  (item) => item.id === packageItem.duration
                                )?.duration || 0;

                              const calculatedPrice = duration
                                ? (
                                    (+packageItem.price || 0) /
                                    Math.floor(duration / (3600 * 24))
                                  ).toFixed(8)
                                : '0';

                              return (
                                <PackageS key={index}>
                                  <PackageHeaderS>
                                    <PackageTitleS>
                                      Package {index + 1}
                                    </PackageTitleS>
                                    {values.packages &&
                                      values.packages.length > 1 && (
                                        <DeletePackageS
                                          type="button"
                                          onClick={() => remove(index)}
                                        >
                                          <IconBxX />
                                        </DeletePackageS>
                                      )}
                                  </PackageHeaderS>

                                  <SingleSelectField
                                    placeholder="Duration"
                                    name={`packages[${index}].${SET_NFT_FOR_RENT_FIELDS.DURATION}`}
                                    label="Rental Duration"
                                    size={isDesktop ? 'large' : 'medium'}
                                    require
                                    options={durationOption}
                                    isSearchable={false}
                                    isOptionDisabled={(durationItem) =>
                                      !values.packages.every(
                                        (_item) =>
                                          _item.duration !== durationItem.value
                                      )
                                    }
                                    hideOptionOnDisable
                                  />

                                  <div className="d-flex flex-row">
                                    <TextFieldS
                                      prefix={
                                        <ICEtherium width={20} height={20} />
                                      }
                                      name={`packages[${index}].${SET_NFT_FOR_RENT_FIELDS.UNIT}`}
                                      label="Price"
                                      require
                                      className="me-2 w-25"
                                      disabled
                                      size={isDesktop ? 'large' : 'medium'}
                                    />
                                    <InputNumberField
                                      name={`packages[${index}].${SET_NFT_FOR_RENT_FIELDS.PRICE}`}
                                      label="*"
                                      size={isDesktop ? 'large' : 'medium'}
                                      className="w-75"
                                      placeholder="Amount"
                                      allowNegative={false}
                                      maxLength={255}
                                      decimalScale={8}
                                      hiddenLabel
                                      thousandSeparator
                                    />
                                  </div>

                                  {+calculatedPrice > 0 && (
                                    <CalculatedPriceS>
                                      <ICEtherium width={16} height={16} />
                                      <CalculatedPriceValueS>
                                        {parseFloat(calculatedPrice)}
                                      </CalculatedPriceValueS>
                                      <CalculatedPriceUnitS>
                                        /day
                                      </CalculatedPriceUnitS>
                                    </CalculatedPriceS>
                                  )}
                                </PackageS>
                              );
                            })}
                          {values.packages && values.packages.length < 4 && (
                            <AddPackageS
                              type="button"
                              onClick={() =>
                                push({
                                  duration: '',
                                  unit: 'USDC',
                                  price: '',
                                  id: '',
                                })
                              }
                            >
                              <IconPlus className="me-2" />
                              <AddPackageTextS>Add Package</AddPackageTextS>
                            </AddPackageS>
                          )}
                        </div>
                      )}
                    />
                    <InfoS>
                      <IcInfo className="me-2" width={24} height={24} />
                      <InfoTextS>
                        There is a transaction fee of 2.5% when your NFT is
                        successfully rented.
                      </InfoTextS>
                    </InfoS>

                    <div className="d-flex flex-row w-100">
                      <Button
                        className="flex-fill me-4"
                        type="button"
                        color="white"
                        onClick={handleCancel}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="flex-fill"
                        type="submit"
                        isLoading={isLoading}
                      >
                        Submit
                      </Button>
                    </div>
                  </form>
                );
              }}
            </Formik>
          )}
        </>
      </NftActionLayout>
      <ModalApprove
        isOpen={isOpen}
        onClose={close}
        detailNft={detailNft}
        durations={packageInfo.durations}
        prices={packageInfo.prices}
        onOk={handleOk}
      />
      <ModalWaitingMetamask isOpen={isLoading} />
    </>
  );
}

const CalculatedPriceS = styled.div`
  width: 100%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 4px 0px;
  background: ${Colors.white};
  border-radius: 6px;
  margin-bottom: 0.5rem;
`;
const CalculatedPriceValueS = styled.span`
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${Colors.textLevel2};
  margin-left: 0.3rem;
`;
const CalculatedPriceUnitS = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: ${Colors.textLevel3};
`;

const PackageS = styled.div`
  padding: 1rem;
  /* General/G7 - Whitesmoke */
  background: #f5f5f5;
  border-radius: 16px;
  position: relative;
  margin-bottom: 1rem;
`;

const AddPackageS = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px 16px;
  background: ${Colors.white};
  /* General/G5 - Light Grey */
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  width: 100%;

  @media (max-width: 575.98px) {
    height: 40px;
  }
`;

const AddPackageTextS = styled(Body2)`
  color: ${Colors.textLevel3};
  font-weight: 600;
`;

const TextFieldS = styled(TextField)`
  min-width: 120px;
`;

const PackageHeaderS = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  border-bottom: 1px solid ${Colors.strokeLevel3};
  padding-bottom: 1rem;
  margin-bottom: 1rem;
`;
const PackageTitleS = styled(Body2)`
  font-weight: 700;
  color: ${Colors.textLevel1};
`;
const DeletePackageS = styled.button`
  border: none;
  outline: none;
  background: transparent;
  margin-left: auto;
`;

const InfoS = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  background: #eff5fe;
  border-radius: 8px;
  margin-bottom: 2rem;
`;
const InfoTextS = styled(Body2)`
  font-weight: 500;
  color: ${Colors.textLevel2};
  flex: 1;
`;
