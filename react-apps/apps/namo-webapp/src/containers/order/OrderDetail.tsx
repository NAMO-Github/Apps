import { ReactComponent as IcETHComponent } from '@assets/images/ic-Etherium.svg';
import { ReactComponent as IcCopy } from '@assets/images/profile/ic-bx-copy.svg';
import { ReactComponent as IcUserDefault } from '@assets/images/profile/ic_userDefault.svg';
import {
  InfoItemLabelS,
  InfoItemValueLinkS,
  InfoItemValueS,
} from '@components/DetailNFT/detailNFT.styled';
import { DETAIL_NFT_ROUTES, ROUTES } from '@constants/routes';
import { useWalletAuth } from '@context/wallet-auth';
import {
  InfoNFT,
  nftApi,
  Order,
  orderApi,
  OrderStatus,
  parseMetaDataToMoralis,
  RequestError,
  Resolution,
} from '@namo-workspace/services';
import { Colors } from '@namo-workspace/themes';
import Button from '@namo-workspace/ui/Button';
import {
  Collapse,
  CollapseBody,
  CollapseHeader,
  CollapseItem,
} from '@namo-workspace/ui/Collapse';
import { Body2, Body4 } from '@namo-workspace/ui/Typography';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { defaultAvatar, defaultNftImage } from '@assets/images';
import ImageNFT from '@components/ImageNFT';
import NavigationBar from '@components/NavigationBar';
import { DEFAULT_USERNAME } from '@constants/common';
import { useAuth } from '@context/auth';
import useMediaQuery, { QUERY } from '@hooks/useMediaQuery';
import useTypeLocation from '@hooks/useTypeLocation';
import { environment } from '@namo-workspace/environments';
import { MaxWidthContent } from '@namo-workspace/ui/MaxWidthContent.styled';
import {
  ellipsisCenter,
  ERROR,
  parseWei,
  SUCCESS,
} from '@namo-workspace/utils';
import { AxiosError } from 'axios';
import { add, format, parseISO } from 'date-fns';
import { toLower } from 'lodash';
import { Facebook, Instagram, List } from 'react-content-loader';
import { toast } from 'react-toastify';
import ReactTooltip from 'react-tooltip';
import { TagStatus, TextCenter } from './order-list/order.styled';

export const getColorByStatus = (status: OrderStatus | undefined) => {
  switch (status) {
    case OrderStatus.INPROGRESS:
      return Colors.primaryOrange;
    case OrderStatus.COMPLETED:
      return Colors.primaryGreen;
    case OrderStatus.EXPIRED:
      return Colors.primaryRed;
    case OrderStatus.FAILED:
      return Colors.primaryRed;
    default:
      return Colors.strokeLevel3;
  }
};
export default function OrderDetail() {
  const navigate = useNavigate();
  const { txHash } = useParams();
  const { state } = useTypeLocation<{ from: string }>();

  const isMobile = useMediaQuery(QUERY.ONLY_MOBILE);
  const isDesktop = useMediaQuery(QUERY.DESKTOP);
  const { account } = useWalletAuth();
  const { userInfo } = useAuth();

  const intervalRef = useRef<NodeJS.Timer>();
  const [orderDetail, setOrderDetail] = useState<Order>();

  const [infoNFT, setInfoNFT] = useState<InfoNFT>();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [requestCount, setRequestCount] = useState<number>(0);

  const [isCopy, setIsCopy] = useState<boolean>(false);

  const getOrder = useCallback(async () => {
    if (txHash) {
      setRequestCount((prev) => ++prev);
      try {
        const res = await orderApi.getOrderByTxHash(txHash);
        setOrderDetail(res.data);
        try {
          const nft = await nftApi.findNFT(res.data.nftId);
          const newNft = await parseMetaDataToMoralis(nft);
          setInfoNFT(newNft);
        } catch (err) {
          if ((err as AxiosError<RequestError>)?.response?.data?.message) {
            toast.error(
              (err as AxiosError<RequestError>)?.response?.data?.message
            );
          }
        }
      } catch (err) {
        if (
          (err as AxiosError<RequestError>)?.response?.data?.message &&
          !(state?.from === DETAIL_NFT_ROUTES.RENTING)
        ) {
          toast.error(
            (err as AxiosError<RequestError>)?.response?.data?.message
          );
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [txHash]);

  useEffect(() => {
    const effect = async () => {
      if (state?.from === DETAIL_NFT_ROUTES.RENTING) {
        getOrder();
        intervalRef.current = setInterval(() => {
          getOrder();
        }, environment.callLoopTime);
        return () => {
          if (intervalRef.current) clearInterval(intervalRef.current);
        };
      } else {
        await getOrder();
        setIsLoading(false);
      }
    };
    effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.from, getOrder]);

  useEffect(() => {
    if (
      (orderDetail &&
        orderDetail.status &&
        orderDetail.status !== OrderStatus.INPROGRESS &&
        intervalRef.current) ||
      requestCount > environment.maxRequestLoop
    ) {
      clearInterval(intervalRef.current);
      setIsLoading(false);
    }
    if (
      state?.from === DETAIL_NFT_ROUTES.RENTING &&
      orderDetail?.status === OrderStatus.COMPLETED
    ) {
      toast.success(SUCCESS.RENTED_NFT);
    }

    if (
      state?.from === DETAIL_NFT_ROUTES.RENTING &&
      orderDetail?.status === OrderStatus.FAILED
    ) {
      toast.error(ERROR.ER_PAYMENT_FAILED);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderDetail]);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [isLoading]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopy(true);
  };

  if (
    orderDetail &&
    orderDetail.renter &&
    userInfo &&
    userInfo.address &&
    toLower(orderDetail.renter.address) !== toLower(userInfo.address)
  ) {
    return (
      <MaxWidthContent>
        <Container className="container-fluid p-container py-3">
          <TextCenter>
            You don't have permission to view this information.
          </TextCenter>
        </Container>
      </MaxWidthContent>
    );
  }

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
            {isMobile &&
              (isLoading ? (
                <List className="mb-2" />
              ) : (
                <>
                  <WrapStatus>
                    <LabelStatus>Order status</LabelStatus>
                    <TagStatus color={getColorByStatus(orderDetail?.status)}>
                      {orderDetail?.status}
                    </TagStatus>
                  </WrapStatus>
                  {orderDetail?.status === OrderStatus.COMPLETED && (
                    <div className="d-flex flex-row">
                      <WrapFromTo>
                        <LabelFromTo>From:</LabelFromTo>
                        <DateFromTo>
                          {orderDetail?.receivingNftDate &&
                            format(
                              parseISO(orderDetail?.receivingNftDate),
                              'dd/MM/yyyy'
                            )}
                        </DateFromTo>
                      </WrapFromTo>
                      <WrapFromTo className="ms-auto">
                        <LabelFromTo>To:</LabelFromTo>
                        <DateFromTo>
                          {orderDetail?.receivingNftDate &&
                            orderDetail?.pickedDuration &&
                            format(
                              add(parseISO(orderDetail?.receivingNftDate), {
                                seconds: orderDetail?.pickedDuration,
                              }),
                              'dd/MM/yyyy'
                            )}
                        </DateFromTo>
                      </WrapFromTo>
                    </div>
                  )}
                </>
              ))}

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
                    size={!isDesktop ? Resolution.Low : Resolution.High}
                  />
                )}
                {isMobile &&
                  (isLoading ? (
                    <Facebook />
                  ) : (
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
                    </div>
                  ))}

                {!isMobile &&
                  (isLoading ? (
                    <List className="mb-2" />
                  ) : (
                    <WrapTransInfo>
                      <Collapse
                        defaultOpen={['collapse-transaction-information']}
                        stayOpen
                        open=""
                      >
                        <CollapseItem>
                          <CollapseHeader targetId="collapse-transaction-information">
                            Transaction Information
                          </CollapseHeader>

                          <CollapseBody accordionId="collapse-transaction-information">
                            <div className="d-flex flex-column">
                              <div className="d-flex flex-row mb-2">
                                <InfoItemLabelS>Order ID</InfoItemLabelS>
                                <InfoItemValueLinkS
                                  onClick={() =>
                                    handleCopy(orderDetail?.id || '')
                                  }
                                >
                                  {ellipsisCenter(orderDetail?.id || '')}
                                  <IcCopy
                                    data-tip=""
                                    data-place="top"
                                    data-effect="solid"
                                  />
                                </InfoItemValueLinkS>
                              </div>

                              <div className="d-flex flex-row mb-2">
                                <InfoItemLabelS>
                                  Transaction hash
                                </InfoItemLabelS>
                                <InfoItemValueLinkS
                                  onClick={() =>
                                    handleCopy(orderDetail?.txHash || '')
                                  }
                                >
                                  {ellipsisCenter(orderDetail?.txHash || '')}
                                  <IcCopy
                                    data-tip=""
                                    data-place="top"
                                    data-effect="solid"
                                  />
                                </InfoItemValueLinkS>
                              </div>

                              {orderDetail?.createdAt && (
                                <div className="d-flex flex-row mb-2">
                                  <InfoItemLabelS>Payment date</InfoItemLabelS>
                                  <InfoItemValueS>
                                    {format(
                                      parseISO(orderDetail.createdAt),
                                      'HH:mm - dd/MM/yyyy'
                                    )}
                                  </InfoItemValueS>
                                </div>
                              )}

                              {orderDetail?.receivingNftDate && (
                                <div className="d-flex flex-row mb-2">
                                  <InfoItemLabelS>
                                    Receiving NFT date
                                  </InfoItemLabelS>
                                  <InfoItemValueS>
                                    {format(
                                      parseISO(orderDetail.receivingNftDate),
                                      'HH:mm - dd/MM/yyyy'
                                    )}
                                  </InfoItemValueS>
                                </div>
                              )}

                              {orderDetail?.wrappedContractAddress && (
                                <div className="d-flex flex-row mb-2">
                                  <InfoItemLabelS>
                                    Wrapped Token Address
                                  </InfoItemLabelS>
                                  <InfoItemValueLinkS
                                    onClick={() =>
                                      handleCopy(
                                        orderDetail?.wrappedContractAddress ||
                                          ''
                                      )
                                    }
                                  >
                                    {ellipsisCenter(
                                      orderDetail?.wrappedContractAddress || ''
                                    )}
                                    <IcCopy
                                      data-tip=""
                                      data-place="top"
                                      data-effect="solid"
                                    />
                                  </InfoItemValueLinkS>
                                </div>
                              )}
                              {orderDetail?.wrappedTokenId && (
                                <div className="d-flex flex-row mb-2">
                                  <InfoItemLabelS>
                                    Wrapped Token Id
                                  </InfoItemLabelS>
                                  <InfoItemValueLinkS
                                    onClick={() =>
                                      handleCopy(
                                        orderDetail?.wrappedTokenId || ''
                                      )
                                    }
                                  >
                                    {ellipsisCenter(
                                      orderDetail?.wrappedTokenId || ''
                                    )}
                                    <IcCopy
                                      data-tip=""
                                      data-place="top"
                                      data-effect="solid"
                                    />
                                  </InfoItemValueLinkS>
                                </div>
                              )}
                            </div>
                          </CollapseBody>
                        </CollapseItem>
                      </Collapse>
                    </WrapTransInfo>
                  ))}
              </div>

              <div className="col col-12 col-md-6 col-lg-5 px-0 ps-md-2 ps-lg-3 mt-0">
                {isDesktop &&
                  (isLoading ? (
                    <Facebook />
                  ) : (
                    <WrapperUser
                      to={
                        account === infoNFT?.rentalAddress?.toLowerCase()
                          ? `${ROUTES.PROFILE}`
                          : `${ROUTES.PROFILE_PUBLIC}/${infoNFT?.rentalAddress}`
                      }
                    >
                      {infoNFT?.avatarOfOwner ? (
                        <AvatarS image={infoNFT?.avatarOfOwner} />
                      ) : (
                        <AvatarS>
                          <IcUserDefault />
                        </AvatarS>
                      )}

                      <NameUser>
                        {infoNFT?.ownerName || DEFAULT_USERNAME}
                      </NameUser>
                    </WrapperUser>
                  ))}

                {isDesktop &&
                  (isLoading ? (
                    <List className="mb-2" />
                  ) : (
                    <NameNTF>
                      {infoNFT?.metaData?.name ||
                        infoNFT?.name ||
                        DEFAULT_USERNAME}
                    </NameNTF>
                  ))}
                {isLoading ? (
                  <List className="mb-2" />
                ) : (
                  <WrapDuration>
                    Rental Duration:{' '}
                    <Duration className="ms-1">
                      {orderDetail?.pickedLabel || ''}
                    </Duration>
                  </WrapDuration>
                )}
                {!isMobile &&
                  (isLoading ? (
                    <List className="mb-2" />
                  ) : (
                    <div className="d-flex flex-row">
                      <WrapFromTo>
                        <LabelFromTo>From:</LabelFromTo>
                        <DateFromTo>
                          {orderDetail?.receivingNftDate &&
                            format(
                              parseISO(orderDetail?.receivingNftDate),
                              'dd/MM/yyyy'
                            )}
                        </DateFromTo>
                      </WrapFromTo>
                      <WrapFromTo className="ms-auto">
                        <LabelFromTo>To:</LabelFromTo>
                        <DateFromTo>
                          {orderDetail?.receivingNftDate &&
                            orderDetail?.pickedDuration &&
                            format(
                              add(parseISO(orderDetail?.receivingNftDate), {
                                seconds: orderDetail?.pickedDuration,
                              }),
                              'dd/MM/yyyy'
                            )}
                        </DateFromTo>
                      </WrapFromTo>
                    </div>
                  ))}
                {!isMobile &&
                  orderDetail?.status === OrderStatus.COMPLETED &&
                  (isLoading ? (
                    <List className="mb-2" />
                  ) : (
                    <WrapStatus>
                      <LabelStatus>Order status</LabelStatus>
                      <TagStatus color={getColorByStatus(orderDetail?.status)}>
                        {orderDetail?.status}
                      </TagStatus>
                    </WrapStatus>
                  ))}

                {isLoading ? (
                  <List className="mb-2" />
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
                                  {orderDetail &&
                                    orderDetail.pickedPrice &&
                                    parseWei(orderDetail.pickedPrice)}
                                </RentalPriceS>
                              </InfoItemValueS>
                            </div>
                          </div>
                        </CollapseBody>
                      </CollapseItem>
                    </Collapse>
                  </PaymentDetailS>
                )}
                {isMobile &&
                  (isLoading ? (
                    <List className="mb-2" />
                  ) : (
                    <WrapTransInfo>
                      <Collapse
                        defaultOpen={['collapse-transaction-information']}
                        stayOpen
                        open=""
                      >
                        <CollapseItem>
                          <CollapseHeader targetId="collapse-transaction-information">
                            Transaction Information
                          </CollapseHeader>

                          <CollapseBody accordionId="collapse-transaction-information">
                            <div className="d-flex flex-column">
                              <div className="d-flex flex-row mb-2">
                                <InfoItemLabelS>Order ID</InfoItemLabelS>
                                <InfoItemValueLinkS
                                  onClick={() =>
                                    handleCopy(orderDetail?.id || '')
                                  }
                                >
                                  {ellipsisCenter(orderDetail?.id || '')}
                                  <IcCopy
                                    data-tip=""
                                    data-place="top"
                                    data-effect="solid"
                                  />
                                </InfoItemValueLinkS>
                              </div>

                              <div className="d-flex flex-row mb-2">
                                <InfoItemLabelS>
                                  Transaction hash
                                </InfoItemLabelS>
                                <InfoItemValueLinkS
                                  onClick={() =>
                                    handleCopy(orderDetail?.txHash || '')
                                  }
                                >
                                  {ellipsisCenter(orderDetail?.txHash || '')}
                                  <IcCopy
                                    data-tip=""
                                    data-place="top"
                                    data-effect="solid"
                                  />
                                </InfoItemValueLinkS>
                              </div>

                              {orderDetail?.createdAt && (
                                <div className="d-flex flex-row mb-2">
                                  <InfoItemLabelS>Payment date</InfoItemLabelS>
                                  <InfoItemValueS>
                                    {format(
                                      parseISO(orderDetail.createdAt),
                                      'HH:mm - dd/MM/yyyy'
                                    )}
                                  </InfoItemValueS>
                                </div>
                              )}

                              {orderDetail?.receivingNftDate && (
                                <div className="d-flex flex-row mb-2">
                                  <InfoItemLabelS>
                                    Receiving NFT date
                                  </InfoItemLabelS>
                                  <InfoItemValueS>
                                    {format(
                                      parseISO(orderDetail.receivingNftDate),
                                      'HH:mm - dd/MM/yyyy'
                                    )}
                                  </InfoItemValueS>
                                </div>
                              )}

                              {orderDetail?.wrappedContractAddress && (
                                <div className="d-flex flex-row mb-2">
                                  <InfoItemLabelS>
                                    Wrapped Token Address
                                  </InfoItemLabelS>
                                  <InfoItemValueLinkS
                                    onClick={() =>
                                      handleCopy(
                                        orderDetail?.wrappedContractAddress ||
                                          ''
                                      )
                                    }
                                  >
                                    {ellipsisCenter(
                                      orderDetail?.wrappedContractAddress || ''
                                    )}
                                    <IcCopy
                                      data-tip=""
                                      data-place="top"
                                      data-effect="solid"
                                    />
                                  </InfoItemValueLinkS>
                                </div>
                              )}
                              {orderDetail?.wrappedTokenId && (
                                <div className="d-flex flex-row mb-2">
                                  <InfoItemLabelS>
                                    Wrapped Token Id
                                  </InfoItemLabelS>
                                  <InfoItemValueLinkS
                                    onClick={() =>
                                      handleCopy(
                                        orderDetail?.wrappedTokenId || ''
                                      )
                                    }
                                  >
                                    {ellipsisCenter(
                                      orderDetail?.wrappedTokenId || ''
                                    )}
                                    <IcCopy
                                      data-tip=""
                                      data-place="top"
                                      data-effect="solid"
                                    />
                                  </InfoItemValueLinkS>
                                </div>
                              )}
                            </div>
                          </CollapseBody>
                        </CollapseItem>
                      </Collapse>
                    </WrapTransInfo>
                  ))}

                {isLoading ? (
                  <List className="mb-2" />
                ) : (
                  <div className="d-flex flex-column w-100">
                    <Button
                      className="flex-fill"
                      disabled={orderDetail?.status === OrderStatus.INPROGRESS}
                      onClick={() => navigate(ROUTES.HOME)}
                    >
                      {orderDetail?.status === OrderStatus.INPROGRESS
                        ? 'Processing'
                        : 'Back to Home'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </MaxWidthContent>
      </div>

      <ReactTooltip
        getContent={() => <span>{isCopy ? 'Copied' : 'Copy'}</span>}
        afterHide={() => setIsCopy(false)}
      />
    </>
  );
}

const WrapTransInfo = styled.div``;

const WrapStatus = styled.div`
  display: inline-flex;
  align-items: center;
  margin-bottom: 1rem;
  @media (max-width: 575.98px) {
    width: 100%;
    justify-content: space-between;
    font-size: 14px;
  }
`;

const LabelStatus = styled(Body2)`
  display: inline-block;
  color: ${Colors.textLevel1};
  font-weight: 500;
  margin-right: 1rem;
  @media (max-width: 575.98px) {
    font-size: 14px;
  }
`;

interface Image {
  image?: string;
}

const Container = styled.div`
  padding: 1rem 9%;

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

const PaymentDetailS = styled.div`
  margin-bottom: 1rem;
  @media (max-width: 575.98px) {
    margin: 0;
  }
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

const WrapFromTo = styled.div`
  display: inline-flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const LabelFromTo = styled(Body2)`
  display: inline-block;
  color: ${Colors.textLevel1};
  font-weight: 500;
  margin-right: 1rem;

  @media (max-width: 575.98px) {
    font-size: 14px;
  }
`;
const DateFromTo = styled(Body2)`
  display: inline-block;
  color: ${Colors.textLevel1};
  font-weight: 400;

  @media (max-width: 575.98px) {
    font-size: 14px;
  }
`;
