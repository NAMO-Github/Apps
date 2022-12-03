import { defaultAvatar } from '@assets/images';
import { ReactComponent as IcError } from '@assets/images/common/ic_error_red.svg';
import { ReactComponent as IcCopy } from '@assets/images/profile/ic-bx-copy.svg';
import Duration from '@components/DetailNFT/Duration';
import HistoryRentedNFT from '@components/DetailNFT/HistoryRentedNFT';
import PropertiesNft from '@components/DetailNFT/PropertiesNft';
import ImageNFT from '@components/ImageNFT';
import ModalConfirm from '@components/Modal/ModalConfirm';
import ModalWaitingMetamask from '@components/Modal/ModalWaitingMetamask';
import { DEFAULT_USERNAME } from '@constants/common';
import { MY_NFT_ROUTES, ROUTES } from '@constants/routes';
import { useAuth } from '@context/auth';
import { MetamaskError, useWalletAuth } from '@context/wallet-auth';
import useMediaQuery, { QUERY } from '@hooks/useMediaQuery';
import useToggle from '@hooks/useToggle';
import { environment } from '@namo-workspace/environments';
import {
  InfoNFT,
  nftApi,
  NftVisible,
  Resolution,
  STATUS,
  STATUS_NFT,
} from '@namo-workspace/services';
import { Colors } from '@namo-workspace/themes';
import Button from '@namo-workspace/ui/Button';
import {
  Collapse,
  CollapseBody,
  CollapseHeader,
  CollapseItem,
} from '@namo-workspace/ui/Collapse';
import Label from '@namo-workspace/ui/Label';
import { MaxWidthContent } from '@namo-workspace/ui/MaxWidthContent.styled';
import SwitchC from '@namo-workspace/ui/Switch';
import { ellipsisCenter, ERROR, SUCCESS } from '@namo-workspace/utils';
import * as Sentry from '@sentry/react';
import tokenServices from '@services/token.services';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Facebook, Instagram, List } from 'react-content-loader';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactTooltip from 'react-tooltip';

import {
  AvatarS,
  ButtonS,
  Container,
  Descriptions,
  ErrorNoPackageS,
  ErrorNoPackageTextS,
  InfoItemLabelS,
  InfoItemValueLinkS,
  InfoItemValueS,
  NameNTF,
  NameUser,
  Tag,
  WrapButton,
  WrapDuration,
  WrapHistoryRented,
  WrapperUser,
  WrapProperties,
  WrapSwitch,
} from './detailNFT.styled';

interface Props {
  isLoading?: boolean;
  infoNFT: InfoNFT | undefined;
  renderCustomAction?: React.ReactNode;
  refetchNft?: () => void;
}

const DetailNFT = ({ isLoading, infoNFT, renderCustomAction }: Props) => {
  const navigate = useNavigate();

  const { account, web3, chainId, metamask } = useWalletAuth();
  const { userInfo } = useAuth();

  const { isOpen, open, close } = useToggle();
  const [isCopy, setIsCopy] = useState<boolean>(false);
  const [durationSelected, setDurationSelected] = useState<string>();
  const [errorNoPackage, setErrorNoPackage] = useState<boolean>(false);
  const [loadingStopRenting, setLoadingStopRenting] = useState(false);
  const isSmallMobile = useMediaQuery(QUERY.SMALL_MOBILE);
  const isDesktop = useMediaQuery(QUERY.DESKTOP);
  const refMess = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (infoNFT?.packages?.length === 1) {
      setDurationSelected(infoNFT.packages[0].id);
    }
  }, [infoNFT]);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [isLoading]);

  //sort DESC
  const sortHistoryTransaction = useMemo(
    () =>
      infoNFT?.transactions?.length &&
      infoNFT.transactions.sort((item, itemNext) => {
        const timeItem: number = new Date(item.updatedAt).getTime();
        const timeItemNext: number = new Date(itemNext.updatedAt).getTime();

        return timeItemNext - timeItem;
      }),
    [infoNFT]
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopy(true);
  };

  const triggerValidateDuration = () => {
    if (durationSelected) {
      setErrorNoPackage(false);
      return true;
    }
    setErrorNoPackage(true);
    setTimeout(
      () => refMess.current && isSmallMobile && refMess.current.scrollIntoView()
    );

    return false;
  };

  const handleRentNow = () => {
    if (triggerValidateDuration()) {
      navigate(
        `${ROUTES.NFT}/${infoNFT?.tokenAddress}/${infoNFT?.tokenId}/renting/${durationSelected}`
      );
      // } else {
      //   navigate(ROUTES.LOGIN);
      // }
    }
  };

  const handleSetVisibility = useCallback(
    (checked: boolean) => {
      const params: NftVisible = {
        tokenAddress: infoNFT?.tokenAddress,
        tokenId: infoNFT?.tokenId,
        isVisible: checked,
      };

      nftApi.updateVisible([params]);
    },
    [infoNFT]
  );

  const handleStopRenting = useCallback(async () => {
    if (chainId && !environment.mainnetChainId.includes(chainId)) {
      toast.error(ERROR.ER_STOP_RENTING);
      return;
    }
    if (!infoNFT) {
      toast.error(ERROR.ER_STOP_RENTING);
      return;
    }
    if (web3 && account && metamask) {
      try {
        setLoadingStopRenting(true);
        await tokenServices.stopRenting(
          web3,
          infoNFT.contractAddress || environment.namoSmartContract,
          account,
          infoNFT.marketItem || '0'
        );
        setLoadingStopRenting(false);
        navigate('/profile/gallery');
        toast.success(SUCCESS.STOP_RENTING);
      } catch (error) {
        setLoadingStopRenting(false);
        Sentry.captureException(error);
        if ((error as MetamaskError).code === 4001) {
          toast.error(ERROR.ER_DENIED_METAMASK);
        } else if ((error as MetamaskError).message) {
          toast.error((error as MetamaskError).message);
        } else {
          toast.error(ERROR.ER_STOP_RENTING);
        }
      }
    } else {
      toast.error(ERROR.ER_NO_METAMASK);
    }
  }, [account, chainId, infoNFT, navigate, web3, metamask]);

  const RenderImageNFT = () =>
    isLoading ? (
      <Instagram className="mb-2" />
    ) : (
      <ImageNFT
        className="mb-3 mb-sm-4"
        infoNFT={infoNFT}
        size={!isDesktop && !isSmallMobile ? Resolution.Low : Resolution.High}
      />
    );

  const RenderCollInfoNFT = () =>
    isLoading ? (
      <List className="mb-2" />
    ) : (
      <CollapseItem>
        <CollapseHeader targetId="collapse-information">
          Information
        </CollapseHeader>

        <CollapseBody accordionId="collapse-information">
          <div className="d-flex flex-column">
            {infoNFT?.tokenAddress && (
              <div className="d-flex flex-row mb-2 mb-md-3">
                <InfoItemLabelS>Contract Address</InfoItemLabelS>
                <InfoItemValueLinkS
                  onClick={() => handleCopy(infoNFT.tokenAddress || '')}
                >
                  {ellipsisCenter(infoNFT.tokenAddress || '')}
                  <IcCopy
                    data-tip="Copy"
                    data-place="top"
                    data-effect="solid"
                  />
                </InfoItemValueLinkS>
              </div>
            )}

            {infoNFT?.tokenId && (
              <div className="d-flex flex-row mb-2 mb-md-3">
                <InfoItemLabelS>Token ID</InfoItemLabelS>
                <InfoItemValueLinkS
                  onClick={() => handleCopy(infoNFT.tokenId || '')}
                >
                  {ellipsisCenter(infoNFT.tokenId || '')}
                  <IcCopy
                    data-tip="Copy"
                    data-place="top"
                    data-effect="solid"
                  />
                </InfoItemValueLinkS>
              </div>
            )}

            {infoNFT?.contractType && (
              <div className="d-flex flex-row mb-2 mb-md-3">
                <InfoItemLabelS>Token Standard</InfoItemLabelS>
                <InfoItemValueS>{infoNFT.contractType}</InfoItemValueS>
              </div>
            )}

            {infoNFT?.chain && (
              <div className="d-flex flex-row mb-2 mb-md-3">
                <InfoItemLabelS>Blockchain</InfoItemLabelS>
                <InfoItemValueS>{infoNFT.chain}</InfoItemValueS>
              </div>
            )}

            {!infoNFT?.tokenAddress &&
              !infoNFT?.tokenId &&
              !infoNFT?.contractType &&
              !infoNFT?.chain &&
              'No Information'}
          </div>
        </CollapseBody>
      </CollapseItem>
    );

  const RenderProperties = () =>
    isLoading ? (
      <List className="mb-2" />
    ) : (
      <CollapseItem>
        <CollapseHeader targetId="collapse-properties">
          Properties
        </CollapseHeader>

        <CollapseBody accordionId="collapse-properties">
          {infoNFT?.metaData?.attributes?.length ? (
            <WrapProperties>
              {infoNFT.metaData.attributes.map((item) => {
                return (
                  <PropertiesNft
                    properties={item}
                    key={`${item.trait_type}${item.value}`}
                  />
                );
              })}
            </WrapProperties>
          ) : (
            'No Properties'
          )}
        </CollapseBody>
      </CollapseItem>
    );

  const RenderAvatarName = () =>
    isLoading ? (
      <Facebook className="mb-2" />
    ) : (
      <WrapperUser
        className="mb-3 mb-sm-4"
        to={
          userInfo?.address ===
          (infoNFT?.rentalAddress || infoNFT?.ownerOf)?.toLowerCase()
            ? `${ROUTES.PROFILE}`
            : `${ROUTES.PROFILE_PUBLIC}/${infoNFT?.rentalAddress}`
        }
      >
        <AvatarS image={infoNFT?.avatarOfOwner || defaultAvatar} />

        <NameUser>{infoNFT?.ownerName || DEFAULT_USERNAME}</NameUser>
      </WrapperUser>
    );

  const RenderNameNFT = () =>
    isLoading ? (
      <List className="mb-2" />
    ) : (
      <NameNTF className="mb-3 mb-md-4">
        {infoNFT?.metaData?.name || infoNFT?.name || DEFAULT_USERNAME}
      </NameNTF>
    );

  const RenderStatusNFT = () => {
    if (isLoading) return <List className="mb-2" />;

    if (infoNFT?.status && infoNFT?.status !== STATUS_NFT.PROCESSING) {
      return (
        <Tag
          className="mb-3 mb-md-4"
          colorBg={
            infoNFT.status === STATUS_NFT.FOR_RENT
              ? Colors.primaryGreen
              : infoNFT.status === STATUS_NFT.UNAVAILABLE
              ? Colors.background2
              : Colors.primaryRed
          }
          color={
            infoNFT.status === STATUS_NFT.UNAVAILABLE
              ? Colors.textLevel4
              : Colors.white
          }
          colorBr={
            infoNFT.status === STATUS_NFT.FOR_RENT
              ? Colors.primaryGreen
              : infoNFT.status === STATUS_NFT.UNAVAILABLE
              ? Colors.strokeLevel3
              : Colors.primaryRed
          }
        >
          {STATUS[infoNFT.status as STATUS_NFT]}
        </Tag>
      );
    }

    return null;
  };

  const RenderDuration = () => {
    if (isLoading) return <List className="mb-2" />;
    if (infoNFT?.packages?.length) {
      return (
        <WrapDuration className="mb-3 mb-md-4">
          {infoNFT.packages.map((item) => (
            <Duration
              key={item.id}
              duration={item}
              isSelected={durationSelected === item.id}
              onChange={(isSelected) => {
                if (isSelected) {
                  setDurationSelected(item.id);
                  setErrorNoPackage(false);
                } else {
                  setDurationSelected(undefined);
                }
              }}
              disabled={
                infoNFT?.status !== STATUS_NFT.FOR_RENT ||
                userInfo?.address === infoNFT?.rentalAddress?.toLowerCase()
              }
            />
          ))}
        </WrapDuration>
      );
    }

    return null;
  };

  const RenderGBtnRent = () => {
    if (isLoading) return <List className="mb-2" />;
    if (
      userInfo?.address !==
      (infoNFT?.rentalAddress?.toLowerCase() || infoNFT?.ownerOf?.toLowerCase())
    ) {
      if (
        !infoNFT?.status ||
        infoNFT?.status === STATUS_NFT.PROCESSING ||
        infoNFT?.status === STATUS_NFT.UNAVAILABLE
      ) {
        return null;
      }
      return (
        <div className="mb-3 mb-md-4 w-100 d-flex flex-column">
          <ButtonS
            className="mt-3 w-100"
            disabled={infoNFT?.status !== STATUS_NFT.FOR_RENT}
            onClick={handleRentNow}
          >
            Rent now
          </ButtonS>
          {errorNoPackage && (
            <ErrorNoPackageS ref={refMess}>
              <IcError className="me-2" />
              <ErrorNoPackageTextS>
                Please choose a package to rent
              </ErrorNoPackageTextS>
            </ErrorNoPackageS>
          )}
        </div>
      );
    } else {
      if (infoNFT?.status === STATUS_NFT.PROCESSING) {
        return null;
      }

      if (!infoNFT?.status || infoNFT?.status === STATUS_NFT.UNAVAILABLE) {
        return (
          <WrapButton className="my-3 mt-md-0 mb-md-4">
            <Button
              onClick={() =>
                navigate(
                  ROUTES.MY_NFT +
                    `/${infoNFT?.tokenAddress}/${infoNFT?.tokenId}/${MY_NFT_ROUTES.SET_FOR_RENT}`
                )
              }
            >
              Set For Rent
            </Button>
          </WrapButton>
        );
      }
      return (
        <WrapButton className="my-3 mt-md-0 mb-md-4">
          <ButtonS
            color="white"
            disabled={infoNFT?.status === STATUS_NFT.RENTED}
            onClick={open}
          >
            Stop Renting
          </ButtonS>

          <ButtonS
            disabled={infoNFT?.status === STATUS_NFT.RENTED}
            onClick={() =>
              navigate(
                ROUTES.MY_NFT +
                  `/${infoNFT?.tokenAddress}/${infoNFT?.tokenId}/edit`
              )
            }
          >
            Edit
          </ButtonS>
        </WrapButton>
      );
    }
  };

  const RenderDescription = () => {
    if (isLoading) return <List className="mb-2" />;
    return (
      <CollapseItem>
        <CollapseHeader targetId="collapse-description">
          Description
        </CollapseHeader>
        <CollapseBody accordionId="collapse-description">
          <Descriptions>
            {infoNFT?.metaData?.description ||
              infoNFT?.description ||
              'No Description'}
          </Descriptions>
        </CollapseBody>
      </CollapseItem>
    );
  };

  const RenderHistoryRent = () => {
    if (isLoading) return <List className="mb-2" />;

    return (
      <CollapseItem>
        <CollapseHeader targetId="collapse-history-rented">
          Rental History
        </CollapseHeader>

        <CollapseBody accordionId="collapse-history-rented">
          <WrapHistoryRented>
            {sortHistoryTransaction ? (
              sortHistoryTransaction.map((item) => (
                <HistoryRentedNFT
                  onSetIsCopy={setIsCopy}
                  history={item}
                  key={item.id}
                />
              ))
            ) : (
              <Descriptions>This NFT has not been rented before.</Descriptions>
            )}
          </WrapHistoryRented>
        </CollapseBody>
      </CollapseItem>
    );
  };

  const RenderVisibility = () => {
    if (isLoading) return <List className="mb-2" />;
    if (
      userInfo?.address ===
      (infoNFT?.rentalAddress || infoNFT?.ownerOf)?.toLowerCase()
    ) {
      return (
        <WrapSwitch className="mt-3 mt-md-4">
          <Label label="Set visibility" />
          <SwitchC
            className="d-inline"
            name="isVisibility"
            defaultChecked={infoNFT?.isVisible}
            onClick={handleSetVisibility}
          ></SwitchC>
        </WrapSwitch>
      );
    }

    return null;
  };

  return (
    <>
      <MaxWidthContent>
        <Container className="container-fluid p-container py-3">
          {isSmallMobile ? (
            <>
              <div className="px-3">
                {RenderAvatarName()}
                {RenderImageNFT()}
                <div className="d-flex justify-content-end">
                  {RenderStatusNFT()}
                </div>
                {RenderDuration()}
                {RenderNameNFT()}
              </div>

              <Collapse
                defaultOpen={[
                  'collapse-description',
                  'collapse-history-rented',
                  'collapse-information',
                  'collapse-properties',
                ]}
                stayOpen
                open=""
              >
                {RenderCollInfoNFT()}
                {RenderProperties()}
                {RenderDescription()}
                {RenderHistoryRent()}
              </Collapse>
              <div className="px-3">
                {RenderVisibility()}
                {renderCustomAction ? renderCustomAction : RenderGBtnRent()}
              </div>
            </>
          ) : (
            <div className="row g-5">
              <div className="col col-12 col-md-6 col-lg-7 px-0 pe-md-2 pe-lg-3 mt-0">
                {RenderImageNFT()}

                <Collapse
                  defaultOpen={['collapse-information', 'collapse-properties']}
                  stayOpen
                  open=""
                >
                  {RenderCollInfoNFT()}
                  {RenderProperties()}
                </Collapse>
              </div>

              <div className="col col-12 col-md-6 col-lg-5 px-0 ps-md-2 ps-lg-3 mt-0">
                {renderCustomAction ? (
                  // eslint-disable-next-line react/jsx-no-useless-fragment
                  <>
                    {RenderAvatarName()}
                    {renderCustomAction}
                  </>
                ) : (
                  <>
                    {RenderAvatarName()}
                    {RenderNameNFT()}
                    {RenderStatusNFT()}
                    {RenderDuration()}
                    {RenderGBtnRent()}
                  </>
                )}

                <Collapse
                  defaultOpen={[
                    'collapse-description',
                    'collapse-history-rented',
                  ]}
                  stayOpen
                  open=""
                >
                  {RenderDescription()}

                  {RenderHistoryRent()}
                </Collapse>

                {RenderVisibility()}
              </div>
            </div>
          )}

          <ReactTooltip
            getContent={() => <span>{isCopy ? 'Copied' : 'Copy'}</span>}
            afterHide={() => setIsCopy(false)}
          />
        </Container>
      </MaxWidthContent>
      <ModalConfirm
        size="small"
        isOpen={isOpen}
        okText="Stop"
        title="Stop Renting"
        description="This process will stop your NFT renting and delete the price you set"
        onOk={handleStopRenting}
        onClose={close}
        isLoading={loadingStopRenting}
      />
      <ModalWaitingMetamask isOpen={loadingStopRenting} />
    </>
  );
};

export default DetailNFT;
