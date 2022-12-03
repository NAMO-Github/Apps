import { defaultAvatar, defaultNftImage } from '@assets/images';
import IcETH, {
  ReactComponent as IcETHComponent,
} from '@assets/images/ic-Etherium.svg';
import {
  InfoItemLabelS,
  InfoItemValueS,
} from '@components/DetailNFT/detailNFT.styled';
import ImageNFT from '@components/ImageNFT';
import ModalWaitingMetamask from '@components/Modal/ModalWaitingMetamask';
import NavigationBar from '@components/NavigationBar';
import { DEFAULT_USERNAME } from '@constants/common';
import { DETAIL_NFT_ROUTES, ROUTES } from '@constants/routes';
import { useAuth } from '@context/auth';
import { MetamaskError, useWalletAuth } from '@context/wallet-auth';
import useMediaQuery, { QUERY } from '@hooks/useMediaQuery';
import { environment } from '@namo-workspace/environments';
import {
  convertPricePerDay,
  orderApi,
  Resolution,
  STATUS_NFT,
  useGetNftDetail,
} from '@namo-workspace/services';
import { Colors } from '@namo-workspace/themes';
import Button from '@namo-workspace/ui/Button';
import {
  Collapse,
  CollapseBody,
  CollapseHeader,
  CollapseItem,
} from '@namo-workspace/ui/Collapse';
import { MaxWidthContent } from '@namo-workspace/ui/MaxWidthContent.styled';
import { Body4 } from '@namo-workspace/ui/Typography';
import { ERROR, parseWei, WARNING } from '@namo-workspace/utils';
import tokenServices, { RentNftResponse } from '@services/token.services';
import { toLower } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { Facebook, Instagram, List } from 'react-content-loader';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import * as Sentry from '@sentry/react';

export default function RentNft() {
  const { tokenId, tokenAddress, packageId } = useParams();
  const { account, web3, metamask, chainId } = useWalletAuth();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const isMobile = useMediaQuery(QUERY.ONLY_MOBILE);
  const isSmallMobile = useMediaQuery(QUERY.SMALL_MOBILE);
  const isDesktop = useMediaQuery(QUERY.DESKTOP);

  const [isAllowed, setIsAllowed] = useState(false);
  const [isLoadingAllow, setIsLoadingAllow] = useState(false);
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const [rentNftResponse, setRentNftResponse] = useState<RentNftResponse>();

  const { detailNft: infoNFT, isLoading } = useGetNftDetail({
    tokenId: tokenId || '',
    tokenAddress: tokenAddress || '',
  });

  const packageItem = useMemo(
    () =>
      infoNFT?.packages?.find((packageItem) => packageItem.id === packageId),
    [infoNFT?.packages, packageId]
  );

  useEffect(() => {
    if (infoNFT && infoNFT.rentalAddress) {
      if (toLower(infoNFT?.rentalAddress) === toLower(userInfo?.address)) {
        navigate(`${ROUTES.NFT}/${tokenAddress}/${tokenId}`);
      }
    } else if (
      infoNFT &&
      infoNFT.ownerOf &&
      toLower(infoNFT?.ownerOf) === toLower(userInfo?.address)
    ) {
      navigate(`${ROUTES.NFT}/${tokenAddress}/${tokenId}`);
    }

    if (infoNFT?.status === STATUS_NFT.RENTED) {
      navigate(`${ROUTES.NFT}/${tokenAddress}/${tokenId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoNFT, userInfo]);

  useEffect(() => {
    const effect = async () => {
      if (web3 && account && packageItem && infoNFT) {
        try {
          const allowances = await tokenServices.getApprovedERC20(
            web3,
            environment.namoTokenSC,
            account,
            infoNFT.contractAddress || environment.namoSmartContract
          );

          const allowanceNumber = parseWei(+allowances);

          setIsAllowed(allowanceNumber >= parseWei(packageItem.price || 0));
        } catch (error) {
          Sentry.captureException(error);
        }
      }
    };
    effect();
  }, [account, packageItem, web3, infoNFT]);

  useEffect(() => {
    if (rentNftResponse) {
      navigate(`/order/${rentNftResponse.transactionHash || ''}`, {
        state: { from: DETAIL_NFT_ROUTES.RENTING },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rentNftResponse]);

  const handleCheckout = async () => {
    if (!infoNFT || !packageItem) {
      return;
    }
    if (chainId && !environment.mainnetChainId.includes(chainId)) {
      toast.error(ERROR.ER_RENT);
      return;
    }
    if (web3 && account && metamask) {
      setIsLoadingCheckout(true);

      try {
        const { data } = await orderApi.getProxyWalletByNft(infoNFT.id || '');

        const balance = await tokenServices.getBalanceERC20(
          web3,
          environment.namoTokenSC,
          account
        );

        if (balance < parseWei(packageItem.price || 0)) {
          toast.error(ERROR.ER_NO_BALANCE);
          setIsLoadingCheckout(false);
          return;
        }
        const res = await tokenServices.rentNft(
          web3,
          infoNFT.contractAddress || environment.namoSmartContract,
          account,
          data.proxyAddress,
          infoNFT.marketItem || '',
          packageItem?.orderNumber || '0',
          data.deadlineSignature,
          data.signature
        );

        setRentNftResponse(res);
        setIsLoadingCheckout(false);
      } catch (error) {
        setIsLoadingCheckout(false);
        Sentry.captureException(error);
        if ((error as MetamaskError).code === 4001) {
          toast.error(ERROR.ER_DENIED_METAMASK);
        } else if ((error as MetamaskError).message) {
          toast.error((error as MetamaskError).message);
        } else {
          toast.error(ERROR.ER_RENT);
        }
      }
    } else {
      toast.error(ERROR.ER_NO_METAMASK);
    }
  };

  const handleAllow = async () => {
    setIsLoadingAllow(true);
    if (web3 && account && metamask && infoNFT) {
      try {
        const allowances = await tokenServices.getApprovedERC20(
          web3,
          environment.namoTokenSC,
          account,
          infoNFT.contractAddress || environment.namoSmartContract
        );
        const allowanceNumber = parseWei(+allowances);

        if (allowanceNumber < (packageItem?.price || 0)) {
          await tokenServices.approveERC20(
            web3,
            account,
            environment.namoTokenSC,
            infoNFT.contractAddress || environment.namoSmartContract,
            10000000
          );
        }
        setIsAllowed(true);
      } catch (error) {
        Sentry.captureException(error);
        if ((error as MetamaskError).code === 4001) {
          toast.error(ERROR.ER_DENIED_METAMASK);
        } else if ((error as MetamaskError).message) {
          toast.error((error as MetamaskError).message);
        } else {
          toast.error(ERROR.ER_RENT);
        }
      }
    } else {
      toast.error(ERROR.ER_NO_METAMASK);
    }
    setIsLoadingAllow(false);
  };

  return (
    <>
      <div className="d-flex flex-column">
        <NavigationBar
          isLoading={isLoading}
          name={infoNFT?.metaData?.name || infoNFT?.name || DEFAULT_USERNAME}
          avatar={
            infoNFT?.metaData?.image || infoNFT?.tokenUri || defaultNftImage
          }
          onBack={() => navigate(-1)}
        />

        <MaxWidthContent className="p-container">
          <Container className="container-fluid px-0">
            <div className="row">
              <div
                className={`col col-12 col-md-6 col-lg-7 px-0 pe-md-2 pe-lg-3 mt-0 ${
                  isMobile && 'd-flex flex-row'
                }`}
              >
                {isLoading ? (
                  <Instagram />
                ) : (
                  <ImageNFTS
                    className="mb-4"
                    infoNFT={infoNFT}
                    size={
                      !isDesktop && !isSmallMobile
                        ? Resolution.Low
                        : Resolution.High
                    }
                  />
                )}
                {isLoading ? (
                  <Facebook />
                ) : (
                  isMobile && (
                    <div className="d-flex flex-column p-2">
                      <WrapperUser
                        to={
                          account === infoNFT?.rentalAddress?.toLowerCase()
                            ? `${ROUTES.PROFILE}`
                            : `${ROUTES.PROFILE_PUBLIC}/${infoNFT?.rentalAddress}`
                        }
                      >
                        <AvatarS
                          image={infoNFT?.avatarOfOwner || defaultAvatar}
                        />

                        <NameUser>
                          {infoNFT?.ownerName || DEFAULT_USERNAME}
                        </NameUser>
                      </WrapperUser>
                      <NameNTF>
                        {infoNFT?.metaData?.name ||
                          infoNFT?.name ||
                          DEFAULT_USERNAME}
                      </NameNTF>
                      <WrapperPrice>
                        <Image src={IcETH} width={20} height={20} />
                        <Price>
                          {packageItem?.price && parseWei(packageItem.price)}
                        </Price>
                        <TextDay>
                          (
                          {packageItem &&
                            packageItem.price &&
                            packageItem.duration &&
                            convertPricePerDay(
                              parseWei(packageItem.price),
                              packageItem.duration
                            )}
                          /Day)
                        </TextDay>
                      </WrapperPrice>
                    </div>
                  )
                )}
              </div>

              <div className="col col-12 col-md-6 col-lg-5 px-0 ps-md-2 ps-lg-3 mt-0">
                {isLoading ? (
                  <List />
                ) : (
                  !isMobile && (
                    <WrapperUser
                      to={
                        account === infoNFT?.rentalAddress?.toLowerCase()
                          ? `${ROUTES.PROFILE}`
                          : `${ROUTES.PROFILE_PUBLIC}/${infoNFT?.rentalAddress}`
                      }
                    >
                      <AvatarS
                        image={infoNFT?.avatarOfOwner || defaultAvatar}
                      />

                      <NameUser>
                        {infoNFT?.ownerName || DEFAULT_USERNAME}
                      </NameUser>
                    </WrapperUser>
                  )
                )}

                {isLoading ? (
                  <List />
                ) : (
                  !isMobile && (
                    <NameNTF>
                      {infoNFT?.metaData?.name ||
                        infoNFT?.name ||
                        DEFAULT_USERNAME}
                    </NameNTF>
                  )
                )}
                {isLoading ? (
                  <List />
                ) : (
                  !isMobile && (
                    <WrapperPrice>
                      <Image src={IcETH} width={20} height={20} />
                      <Price>
                        {packageItem?.price && parseWei(packageItem.price)}
                      </Price>
                      <TextDay>
                        (
                        {packageItem &&
                          packageItem.price &&
                          packageItem.duration &&
                          convertPricePerDay(
                            parseWei(packageItem.price),
                            packageItem.duration
                          )}
                        /Day)
                      </TextDay>
                    </WrapperPrice>
                  )
                )}

                {isLoading ? (
                  <List />
                ) : (
                  <WrapDuration>
                    Rental Duration:{' '}
                    <Duration className="ms-1">
                      {packageItem?.label || ''}
                    </Duration>
                  </WrapDuration>
                )}

                {isLoading ? (
                  <List />
                ) : (
                  <PaymentDetailS>
                    <Collapse
                      defaultOpen={['collapse-payment-details']}
                      stayOpen
                      open=""
                    >
                      <CollapseItem>
                        <CollapseHeader targetId="collapse-payment-details">
                          Payment Details
                        </CollapseHeader>

                        <CollapseBody accordionId="collapse-payment-details">
                          <div className="d-flex flex-column">
                            <div className="d-flex flex-row mb-2">
                              <InfoItemLabelS>Rental Price</InfoItemLabelS>
                              <InfoItemValueS>
                                <RentalPriceS>
                                  <IcETHComponent
                                    width={16}
                                    height={16}
                                    className="me-1"
                                  />
                                  {packageItem?.price &&
                                    parseWei(packageItem?.price)}
                                </RentalPriceS>
                              </InfoItemValueS>
                            </div>
                          </div>
                        </CollapseBody>
                      </CollapseItem>
                    </Collapse>
                  </PaymentDetailS>
                )}
                {/*
              <InfoS>
                <IcInfo className="me-2" width={24} height={24} />
                <InfoTextS>
                  You will have to pay an additional 30% of the gas price at the
                  time of rental
                </InfoTextS>
              </InfoS> */}

                {isLoading ? (
                  <List />
                ) : (
                  <div className="d-flex flex-column w-100">
                    <Button
                      className="flex-fill mb-3"
                      onClick={handleAllow}
                      disabled={isAllowed}
                      isLoading={isLoadingAllow}
                    >
                      {isAllowed
                        ? 'You can rent now'
                        : 'Allow NAMO to use your USDC'}
                    </Button>

                    <Button
                      className="flex-fill"
                      onClick={handleCheckout}
                      disabled={!isAllowed}
                      isLoading={isLoadingCheckout}
                    >
                      Checkout
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </MaxWidthContent>
      </div>
      <ModalWaitingMetamask isOpen={isLoadingAllow || isLoadingCheckout} />
    </>
  );
}

interface Image {
  image?: string;
}

const Container = styled.div`
  padding: 2rem 9%;

  .row {
    margin-left: 0;
    margin-right: 0;
  }
`;

const ImageNFTS = styled(ImageNFT)`
  @media (max-width: 575.98px) {
    width: 88px;
    height: 88px;
    margin-right: 0.5rem;
  }
`;

const Image = styled.img`
  width: 100%;
  object-fit: contain;
  border-radius: 16px;
`;

const AvatarS = styled.div<Image>`
  width: 48px;
  height: 48px;
  max-width: 48px;
  max-height: 48px;
  object-fit: contain;
  border-radius: 50%;
  background: #e2dcab url(${({ image }) => image}) no-repeat center;
  background-size: cover;

  svg {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 575.98px) {
    width: 24px;
    height: 24px;
    max-width: 24px;
    max-height: 24px;
  }
`;

const WrapperUser = styled(Link)`
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  margin-bottom: 2rem;

  img {
    width: 48px;
    height: 48px;
    background: #fdfafa;
    border-radius: 50%;
    overflow: hidden;
  }

  @media (max-width: 575.98px) {
    margin-bottom: 0.5rem;
    display: inline-flex;
    align-items: center;
    img {
      width: 24px;
      height: 24px;
    }
  }
`;

const NameUser = styled.span`
  font-weight: 700;
  font-size: 1rem;
  line-height: 24px;
  color: ${Colors.textLevel1};
  margin-left: 0.5rem;
  @media (max-width: 575.98px) {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: ${Colors.textLevel2};
  }
`;

const NameNTF = styled.p`
  margin-bottom: 2rem;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  color: ${Colors.textLevel1};
  overflow-wrap: break-word;
  @media (max-width: 575.98px) {
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: #242424;
    margin-bottom: 0.5rem;
  }
`;

const WrapperPrice = styled.div`
  width: 100%;
  height: 160px;
  background: ${Colors.background};
  border-radius: 16px;
  margin-bottom: 20px;
  border: 1px solid ${Colors.strokeLevel3};

  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;

  img {
    width: 38px;
    height: 38px;
  }

  @media (max-width: 575.98px) {
    height: unset;
    background: none;
    border-radius: none;
    margin-bottom: none;
    border: none;
    img {
      width: 16px;
      height: 16px;
    }
  }
`;

const Price = styled.span`
  font-weight: 700;
  font-size: 30px;
  line-height: 38px;
  color: ${Colors.foreground1};
  margin-left: 0.5rem;
  @media (max-width: 575.98px) {
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
  }
`;

const TextDay = styled.span`
  margin-left: 2px;
  font-weight: 400;
  font-size: 30px;
  line-height: 38px;
  color: ${Colors.textLevel4};

  @media (max-width: 575.98px) {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
  }
`;

const PaymentDetailS = styled.div`
  margin: 2rem 0;
`;

const RentalPriceS = styled(Body4)`
  line-height: 24px;
  font-weight: 600;
  color: ${Colors.textLevel2};
  display: flex;
  align-items: center;
  flex-flow: row;
  margin-left: auto;
`;

const WrapDuration = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 24px;
  color: ${Colors.textLevel3};
  height: 24px;
  background: ${Colors.background2};
  border-radius: 6px;
  text-align: center;
  margin-bottom: 1rem;

  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 575.98px) {
    height: 32px;
  }
`;

const Duration = styled(Body4)`
  display: inline-block;
  font-weight: 600;
  color: ${Colors.textLevel2};
`;

// const InfoS = styled.div`
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   padding: 12px 16px;
//   background: #eff5fe;
//   border-radius: 8px;
//   margin-bottom: 2rem;
// `;
// const InfoTextS = styled(Body2)`
//   font-weight: 500;
//   color: ${Colors.textLevel2};
//   flex: 1;

//   @media (max-width: 575.98px) {
//     font-size: 14px;
//   }
// `;
