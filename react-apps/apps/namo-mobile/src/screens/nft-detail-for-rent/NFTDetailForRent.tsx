import { NAMO_SC, NFT_STATUS, STATUS } from '@constants/rent';
import ImageNFT from '@containers/common/ImageNFT';
import PopupLoadingMetamask from '@containers/common/PopupLoadingMetamask';
import { Button, Visibility } from '@containers/search/NFTDetail.style';
import { useAuth } from '@context/auth';
import { useUserInfo } from '@context/auth/UserInfoContext';
import Images from '@images';
import {
  convertPricePerDay,
  formDateWithoutTime,
  InfoNFT,
  LOAN_NFT,
  nftApi,
  parseMetaDataToMoralis,
  STATUS_NFT,
} from '@namo-workspace/services';
import { Colors } from '@namo-workspace/themes';
import Popup from '@namo-workspace/ui/Popup';
import { Body2, Body3 } from '@namo-workspace/ui/Typography';
import View from '@namo-workspace/ui/view/View';
import { ERROR, SUCCESS } from '@namo-workspace/utils';
import Clipboard from '@react-native-clipboard/clipboard';
import {
  ParamListBase,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Sentry from '@sentry/react-native';
import { showMessageError, showMessageSuccess } from '@services/showMessage';
import { getWeb3Instance } from '@services/web3';
import {
  formatWalletServiceUrl,
  WalletConnectContext,
} from '@walletconnect/react-native-dapp';
import { toLower, upperCase } from 'lodash';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';
import {
  Dimensions,
  Linking,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import environment from 'react-native-config';
import { AbiItem } from 'web3-utils';
import {
  MainTab,
  ProfileRouter,
  SearchRouter,
} from '../../routes/routes.constants';
import { ProfileStackParams } from '../../routes/routes.model';
import {
  Avatar,
  ContentContainer,
  CopyField,
  CopyToast,
  DetailContainer,
  Duration,
  DurationText,
  DurationValue,
  FooterContainer,
  GroupNFTAction,
  HistoryBox,
  ImageAvatar,
  LenderContainer,
  LenderName,
  NFTAction,
  NFTActionName,
  NFTActionTitle,
  NFTHeader,
  NFTHeaderText,
  NFTItem,
  NFTLabel,
  NFTName,
  NFTValue,
  NFTValueInfo,
  NFTValueText,
  Price,
  PriceLabel,
  PricePerDay,
  Status,
  StatusText,
  styles,
  SwitchContainer,
  Total,
  WrapPrice,
} from './NFTDetailForRent.style';

const { IcArrowUp, IcArrowDown, IcCopy, IcEthereum } = Images;

export type NFTDetailForRentProp = NativeStackNavigationProp<
  ProfileStackParams,
  'NFT_DETAIL_FOR_RENT'
>;

export interface Popup {
  title: string;
  desc: string;
  titleHandle: string;
  titleCancel: string;
}

const handleTail = (val: string) => {
  if (!val || val?.length < 15) return val;
  return `${val.slice(0, 6)}...${val?.slice(val.length - 4, val.length)}`;
};

const { width } = Dimensions.get('window');
const margin = 16;
const IMAGE_SIZE = width - margin * 2;

const NFTDetailForRent = () => {
  const { address, isLoggedIn } = useAuth();
  const { userInfo } = useUserInfo();
  const navigation = useNavigation<NFTDetailForRentProp>();
  const popUpRef = useRef(null);
  const [popUpValue, setPopUpValue] = useState<Popup>({
    title: '',
    desc: '',
    titleCancel: '',
    titleHandle: '',
  });
  const { params } = useRoute<RouteProp<ParamListBase & InfoNFT>>();
  const [detail, setDetail] = useState<InfoNFT>();

  const tokenAddress: string = params['tokenAddress'];
  const tokenId: string = params['tokenId'];
  const shouldUpdateStatus: boolean = !!params['shouldUpdateStatus'] ?? false;
  // const fromEdit: boolean = params['fromEdit'] ?? false;

  const [chooseDuration, setChooseDuration] = useState<string>('');
  const { walletServices, connector } = useContext(WalletConnectContext);
  const [handleLoading, setHandleLoading] = useState<boolean>(false);
  const [isEnabled, setIsEnabled] = useState(detail?.isVisible);
  const [copy, setCopy] = useState(false);
  const [addressCopied, setAddressCopied] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCollapse, setIsCollapse] = useState({
    info: false,
    property: false,
    description: false,
    rent: false,
    transactions: false,
  });

  const metaMaskCheck = async () => {
    const connectionUrl = `${formatWalletServiceUrl(walletServices[3])}/wc`;
    const metaMaskExist = await Linking.canOpenURL(connectionUrl);
    return metaMaskExist;
  };
  const handleFindNFT = useCallback(async () => {
    try {
      setIsLoading(true);
      const nft = await nftApi.getNftDetail({
        chainId: +environment.mainnetChainIdNumber,
        tokenAddress: tokenAddress,
        tokenId: tokenId,
      });
      const nftDetail = await parseMetaDataToMoralis(nft.data);

      setDetail(nftDetail);
      setIsLoading(false);
    } catch (e) {
      setDetail({});
    } finally {
      setIsLoading(false);
    }
  }, [tokenAddress, tokenId]);

  const handleStopRenting = async () => {
    if (!(await metaMaskCheck())) {
      showMessageError(ERROR.ER_NO_METAMASK);
    } else {
      if (isLoggedIn) {
        setPopUpValue({
          title: 'Stop Renting',
          desc: 'This process will stop your NFT renting and delete the price you set',
          titleCancel: 'Cancel',
          titleHandle: 'Stop',
        });
        popUpRef?.current?.open();
      } else
        navigation.navigate(MainTab.PROFILE_STACK, {
          screen: ProfileRouter.PROFILE,
          params: {
            previousRoute: 'NFT_DETAIL_FOR_RENT',
            tokenId: detail.tokenId,
            tokenAddress: detail.tokenAddress,
            prevUser: detail.rentalAddress,
            title: detail.metaData?.name
              ? detail.metaData?.name
              : detail.metadata
              ? JSON.parse(detail.metadata)?.name
              : 'Unnamed',
          },
        });
    }
  };

  const handleEdit = useCallback(() => {
    if (isLoggedIn) {
      JSON.stringify(detail) &&
        navigation.navigate(ProfileRouter.NFT_FOR_RENT, {
          detail: JSON.stringify(detail),
          isEdit: true,
        });
    } else
      navigation.navigate(MainTab.PROFILE_STACK, {
        screen: ProfileRouter.PROFILE,
        params: {
          previousRoute: 'NFT_DETAIL_FOR_RENT',
          tokenId: detail.tokenId,
          tokenAddress: detail.tokenAddress,
          prevUser: detail.rentalAddress,
          title: detail.metaData?.name
            ? detail.metaData?.name
            : detail.metadata
            ? JSON.parse(detail.metadata)?.name
            : 'Unnamed',
        },
      });
  }, [detail, isLoggedIn, navigation]);

  useFocusEffect(
    useCallback(() => {
      handleFindNFT();
    }, [handleFindNFT])
  );

  useEffect(() => {
    if (copy) {
      const timer = setTimeout(() => {
        setCopy(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [copy]);

  useEffect(() => {
    setIsEnabled(detail?.isVisible);
  }, [detail]);
  const refetchInterval = useRef(null);
  useEffect(() => {
    if (shouldUpdateStatus) {
      handleFindNFT();
      refetchInterval.current = setInterval(() => {
        handleFindNFT();
      }, +environment.callLoopTime);
      return () => {
        if (refetchInterval.current) clearInterval(refetchInterval.current);
      };
    }
  }, [handleFindNFT, shouldUpdateStatus]);

  useEffect(() => {
    if (shouldUpdateStatus) {
      if (detail?.status === STATUS_NFT.FOR_RENT) {
        // if (!fromEdit) {
        //   showMessageSuccess('Your NFT is successfully set up for rent');
        // }
        clearTimeout(refetchInterval.current);
      }
    }
  }, [detail, shouldUpdateStatus]);

  useEffect(() => {
    if (
      detail &&
      detail.rentalAddress &&
      (!userInfo ||
        toLower(detail.rentalAddress) !== toLower(userInfo?.address))
    ) {
      navigation.replace(SearchRouter.NFT_DETAIL, {
        tokenId: detail.tokenId,
        tokenAddress: detail.tokenAddress,
        title: detail.metaData?.name
          ? detail.metaData?.name
          : detail.metadata
          ? JSON.parse(detail.metadata)?.name
          : 'Unnamed',
      });
    }
  }, [detail, navigation, userInfo]);

  const GroupNFTAttributes = useMemo(() => {
    if (!detail) {
      return undefined;
    }
    const attributesMetaData = detail.metaData?.attributes;
    if (!attributesMetaData) return;
    if (attributesMetaData && Array.isArray(attributesMetaData)) {
      return attributesMetaData.map((item, index) => {
        return (
          <NFTAction key={index}>
            <NFTActionTitle fontWeight="500">
              {upperCase(item.trait_type)}
            </NFTActionTitle>
            <NFTActionName fontWeight="600">{item.value}</NFTActionName>
          </NFTAction>
        );
      });
    } else if (typeof attributesMetaData === 'object') {
      return Object.entries(attributesMetaData).map(([key, value], index) => {
        return (
          <NFTAction key={index}>
            <NFTActionTitle fontWeight="500">{upperCase(key)}</NFTActionTitle>
            <NFTActionName fontWeight="600">{value}</NFTActionName>
          </NFTAction>
        );
      });
    }
  }, [detail]);

  const handleVisible = async () => {
    nftApi.updateVisible([
      {
        // id: detail.id,
        isVisible: !isEnabled,
        tokenAddress: detail.tokenAddress,
        tokenId: detail.tokenId,
      },
    ]);
    setIsEnabled(!isEnabled);
  };

  const handleSetForSent = () => {
    if (isLoggedIn) {
      JSON.stringify(detail) &&
        navigation.navigate(ProfileRouter.NFT_FOR_RENT, {
          detail: JSON.stringify(detail),
        });
    } else
      navigation.navigate(MainTab.PROFILE_STACK, {
        screen: ProfileRouter.PROFILE,
        params: {
          previousRoute: 'NFT_DETAIL_FOR_RENT',
          tokenId: detail.tokenId,
          tokenAddress: detail.tokenAddress,
          prevUser: detail.rentalAddress,
          title: detail.metaData?.name
            ? detail.metaData?.name
            : detail.metadata
            ? JSON.parse(detail.metadata)?.name
            : 'Unnamed',
        },
      });
  };
  const renderGroupActions = () => {
    if (detail?.status === STATUS_NFT.PROCESSING) {
      return null;
    } else if (
      address?.toLowerCase() === detail?.ownerOf?.toLowerCase() ||
      address?.toLowerCase() === detail?.rentalAddress?.toLowerCase()
    ) {
      if (detail?.status === STATUS_NFT.UNAVAILABLE || !detail?.status) {
        return (
          <FooterContainer>
            <Visibility>
              <Body3 color={Colors.textLevel1} fontSize={14} fontWeight="700">
                Set Visibility
              </Body3>
              <SwitchContainer
                style={
                  isEnabled
                    ? { backgroundColor: Colors.primaryOrange }
                    : { backgroundColor: Colors.border }
                }
              >
                <Switch
                  trackColor={{
                    false: Colors.border,
                    true: Colors.primaryOrange,
                  }}
                  thumbColor={Colors.white}
                  onValueChange={handleVisible}
                  value={isEnabled}
                  disabled={
                    address?.toLowerCase() !== detail?.ownerOf?.toLowerCase() &&
                    address?.toLowerCase() !==
                      detail?.rentalAddress?.toLowerCase()
                  }
                />
              </SwitchContainer>
            </Visibility>
            <Button
              style={[
                styles.btn_edit,
                { width: '100%', backgroundColor: Colors.primaryOrange },
              ]}
              onPress={handleSetForSent}
            >
              <Body2 color={Colors.white} fontSize={16} fontWeight="600">
                Set for Rent
              </Body2>
            </Button>
          </FooterContainer>
        );
      } else {
        return (
          <FooterContainer style={styles.btn_group}>
            <Visibility>
              <Body3 color={Colors.textLevel1} fontSize={14} fontWeight="700">
                Set Visibility
              </Body3>
              <SwitchContainer
                style={
                  isEnabled
                    ? { backgroundColor: Colors.primaryOrange }
                    : { backgroundColor: Colors.border }
                }
              >
                <Switch
                  trackColor={{
                    false: Colors.border,
                    true: Colors.primaryOrange,
                  }}
                  thumbColor={Colors.white}
                  onValueChange={handleVisible}
                  value={isEnabled}
                  disabled={
                    address?.toLowerCase() !== detail?.ownerOf?.toLowerCase() &&
                    address?.toLowerCase() !==
                      detail?.rentalAddress?.toLowerCase()
                  }
                />
              </SwitchContainer>
            </Visibility>
            <Visibility style={{ marginBottom: 0 }}>
              <Button
                onPress={handleStopRenting}
                style={[styles.btn_stop, { backgroundColor: Colors.white }]}
                disabled={
                  detail?.status === STATUS_NFT.ORDERED ||
                  detail?.status === STATUS_NFT.RENTED
                }
              >
                <Body2
                  fontSize={16}
                  fontWeight="600"
                  color={
                    detail?.status === STATUS_NFT.ORDERED ||
                    detail?.status === STATUS_NFT.RENTED
                      ? Colors.primaryOrangeMinus5
                      : Colors.primaryOrange
                  }
                >
                  Stop Renting
                </Body2>
              </Button>
              <Button
                style={[
                  styles.btn_edit,
                  detail?.status === STATUS_NFT.ORDERED ||
                  detail?.status === STATUS_NFT.RENTED
                    ? { backgroundColor: Colors.primaryOrangeMinus5 }
                    : { backgroundColor: Colors.primaryOrange },
                ]}
                onPress={handleEdit}
                disabled={
                  detail?.status === STATUS_NFT.ORDERED ||
                  detail?.status === STATUS_NFT.RENTED
                }
              >
                <Body2 color={Colors.white} fontSize={16} fontWeight="600">
                  Edit
                </Body2>
              </Button>
            </Visibility>
          </FooterContainer>
        );
      }
    }
  };

  const nftInfo = useMemo(() => {
    if (!detail) {
      return undefined;
    }
    return [
      {
        id: '1',
        label: 'Contract Address',
        value: detail.tokenAddress || '',
      },
      { id: '2', label: 'Token ID', value: detail.tokenId || '' },
      { id: '3', label: 'Token Standard', value: detail.contractType || '' },
      { id: '4', label: 'Blockchain', value: detail.chain },
    ];
  }, [detail]);
  const handleCollapse = (type: string) => {
    const isCollapseTemp = {};
    isCollapseTemp[type] = !isCollapse[type];
    setIsCollapse({ ...isCollapse, ...isCollapseTemp });
  };

  const handleConfirmStop = async () => {
    const web3 = getWeb3Instance({ connector });
    const NamoContract = new web3.eth.Contract(
      LOAN_NFT.abi as unknown as AbiItem,
      NAMO_SC
    );
    popUpRef?.current?.close();
    setHandleLoading(true);
    try {
      await NamoContract.methods
        .delistItem(+detail.marketItem)
        .send({ from: address });
      setHandleLoading(false);
      showMessageSuccess(SUCCESS.STOP_RENTING);
      navigation.reset({
        index: 0,
        routes: [
          {
            name: MainTab.PROFILE_STACK,
            state: {
              routes: [
                {
                  name: ProfileRouter.PROFILE,
                  params: {
                    index: 2,
                  },
                },
              ],
            },
          },
        ],
      });
    } catch (error) {
      setHandleLoading(false);
      Sentry.captureException(error);
      if (error.toString().includes('rejected')) {
        showMessageError(ERROR.ER_DENIED_METAMASK);
      } else if (error.toString()) {
        showMessageError(error.toString());
      } else {
        showMessageError(ERROR.ER_STOP_RENTING);
      }
    }
  };

  const handleCopyAddress = (value: string) => {
    Clipboard.setString(value);
    setAddressCopied(value);
    setCopy(!copy);
  };

  const handleNavigateProfile = () => {
    if (isLoggedIn && address === detail.rentalAddress) {
      navigation.navigate(MainTab.PROFILE_STACK, {
        screen: ProfileRouter.PROFILE,
      });
    } else {
      navigation.navigate(SearchRouter.PUBLIC_PROFILE, {
        rentalAddress: detail.rentalAddress,
      });
    }
  };

  return isLoading ? (
    <ContentLoader
      speed={1}
      height="100%"
      backgroundColor="#f3f3f3"
      foregroundColor="#ffffff"
      style={{ marginTop: 20, marginHorizontal: 16 }}
    >
      <Rect y="56" rx="6" ry="6" width="100%" height="360" />
      <Rect y="450" rx="4" ry="4" width="100%" height="60" />
      <Circle cx="15" cy="30" r="15" />
    </ContentLoader>
  ) : (
    <DetailContainer>
      <Popup
        handleLoading={handleLoading}
        ref={popUpRef}
        title={popUpValue.title}
        description={popUpValue.desc}
        buttonCancel={popUpValue.titleCancel}
        buttonHandle={popUpValue.titleHandle}
        handleFunction={handleConfirmStop}
      />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={handleNavigateProfile}>
          <LenderContainer>
            {detail?.avatarOfOwner ? (
              <Avatar
                source={{ uri: detail?.avatarOfOwner }}
                resizeMode="cover"
              />
            ) : (
              <ImageAvatar
                source={require('../../assets/images/img_avatar.png')}
              />
            )}
            <LenderName fontWeight="700">
              {detail?.ownerName || 'Unnamed'}
            </LenderName>
          </LenderContainer>
        </TouchableOpacity>
        <ImageNFT
          detailNft={detail}
          size={IMAGE_SIZE}
          borderRadius={16}
          style={{ marginHorizontal: 16 }}
        />

        <Total>
          <WrapPrice />
          {!!detail?.status && detail.status !== NFT_STATUS.PROCESSING ? (
            <Status status={STATUS[detail?.status]}>
              <StatusText fontWeight="600" status={STATUS[detail?.status]}>
                {STATUS[detail?.status]}
              </StatusText>
            </Status>
          ) : null}
        </Total>

        {detail?.packages && Array.isArray(detail?.packages)
          ? detail?.packages.map((item) => (
              <Duration
                key={item.id}
                onPress={() => setChooseDuration(item.id)}
                style={
                  item.id === chooseDuration
                    ? {
                        borderColor: Colors.primaryOrange,
                        backgroundColor: Colors.secondary,
                      }
                    : {
                        backgroundColor: Colors.white,
                        borderColor: Colors.strokeLevel3,
                      }
                }
              >
                <WrapPrice style={{ marginBottom: 4 }}>
                  <IcEthereum width={20} height={20} />
                  <Price fontWeight="600">
                    {' '}
                    {item?.price / Math.pow(10, 18)}
                  </Price>
                  <PricePerDay>
                    (
                    {convertPricePerDay(
                      item?.price / Math.pow(10, 18),
                      item?.duration
                    )}
                    /day)
                  </PricePerDay>
                </WrapPrice>
                <DurationText>
                  Rental Duration:{' '}
                  <DurationValue fontWeight="600">{item.label}</DurationValue>
                </DurationText>
              </Duration>
            ))
          : null}

        <NFTName fontWeight="700" mt={2}>
          {detail?.metaData?.name || 'Unnamed'}
        </NFTName>
        <NFTHeader
          onPress={() => handleCollapse('info')}
          isCollapse={isCollapse.info}
        >
          <NFTHeaderText fontWeight="700">Information</NFTHeaderText>
          {isCollapse.info ? <IcArrowDown /> : <IcArrowUp />}
        </NFTHeader>
        <Collapsible collapsed={isCollapse.info}>
          <ContentContainer>
            {nftInfo
              ? nftInfo.map((item, index) => (
                  <NFTItem key={item.id}>
                    <NFTLabel ellipsizeMode="tail" fontWeight="500">
                      {item.label}
                    </NFTLabel>
                    <NFTValue onPress={() => handleCopyAddress(item.value)}>
                      <NFTValueText isBlue={index < 2}>
                        {handleTail(item.value)}
                      </NFTValueText>
                      {index < 2 && item?.value?.length ? <IcCopy /> : null}
                      {index < 2 &&
                      item?.value?.length &&
                      copy &&
                      item.value === addressCopied ? (
                        <View
                          style={{
                            backgroundColor: Colors.foreground,
                            right: 20,
                            padding: 8,
                            borderRadius: 8,
                            position: 'absolute',
                          }}
                        >
                          <Body3
                            fontWeight="400"
                            fontSize={14}
                            color={Colors.white}
                          >
                            Copied
                          </Body3>
                        </View>
                      ) : null}
                    </NFTValue>
                  </NFTItem>
                ))
              : null}
          </ContentContainer>
        </Collapsible>

        <NFTHeader
          onPress={() => handleCollapse('property')}
          isCollapse={isCollapse.property}
        >
          <NFTHeaderText fontWeight="700">Properties</NFTHeaderText>
          {isCollapse.property ? <IcArrowDown /> : <IcArrowUp />}
        </NFTHeader>

        <Collapsible collapsed={isCollapse.property}>
          {detail?.metaData?.attributes ? (
            <GroupNFTAction>{GroupNFTAttributes}</GroupNFTAction>
          ) : (
            <NFTValueInfo>No Properties</NFTValueInfo>
          )}
        </Collapsible>

        <NFTHeader
          onPress={() => handleCollapse('description')}
          isCollapse={isCollapse.description}
        >
          <NFTHeaderText fontWeight="700">Description</NFTHeaderText>
          {isCollapse.description ? <IcArrowDown /> : <IcArrowUp />}
        </NFTHeader>
        <Collapsible collapsed={isCollapse.description}>
          <NFTValueInfo>
            {detail?.metaData?.description || 'No Description'}
          </NFTValueInfo>
        </Collapsible>

        <NFTHeader
          onPress={() => handleCollapse('transactions')}
          isCollapse={isCollapse.description}
        >
          <NFTHeaderText fontWeight="700">Rental History</NFTHeaderText>
          {isCollapse.transactions ? <IcArrowDown /> : <IcArrowUp />}
        </NFTHeader>

        <Collapsible collapsed={isCollapse.transactions}>
          {detail &&
          detail?.transactions &&
          Array.isArray(detail?.transactions) &&
          detail?.transactions?.length !== 0 ? (
            <ContentContainer>
              {detail?.transactions
                .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
                .map((item) => (
                  <HistoryBox key={item.id}>
                    <NFTItem>
                      <NFTLabel fontWeight="500">Rental Period</NFTLabel>
                      <CopyField disabled={true}>
                        <PriceLabel
                          color={Colors.textLevel3}
                          style={{ textAlign: 'right' }}
                        >
                          {formDateWithoutTime(item.startDate)} -{' '}
                          {formDateWithoutTime(item.endDate)}
                        </PriceLabel>
                      </CopyField>
                    </NFTItem>
                    <NFTItem>
                      <NFTLabel fontWeight="500">Renter</NFTLabel>
                      <PriceLabel
                        color={Colors.textLevel3}
                        style={{ textAlign: 'right' }}
                      >
                        {item.renterName ?? 'Unnamed'}
                      </PriceLabel>
                    </NFTItem>
                    <NFTItem>
                      <NFTLabel fontWeight="500">Price</NFTLabel>
                      <CopyField disabled={true}>
                        <IcEthereum width={20} height={20} />
                        <PriceLabel fontWeight="600" color={Colors.textLevel2}>
                          {' '}
                          {item?.price / Math.pow(10, 18)}
                        </PriceLabel>
                      </CopyField>
                    </NFTItem>
                    <NFTItem>
                      <NFTLabel fontWeight="500">Transaction Hash</NFTLabel>
                      <CopyField onPress={() => handleCopyAddress(item.txHash)}>
                        <PriceLabel
                          fontWeight="400"
                          color={Colors.blue}
                          style={{ textAlign: 'right' }}
                        >
                          {handleTail(item.txHash)}{' '}
                        </PriceLabel>
                        <IcCopy />
                      </CopyField>
                      {copy && item.txHash === addressCopied ? (
                        <CopyToast>
                          <PriceLabel
                            fontWeight="400"
                            fontSize={14}
                            color={Colors.white}
                          >
                            Copied
                          </PriceLabel>
                        </CopyToast>
                      ) : null}
                    </NFTItem>
                    {isLoggedIn &&
                    address?.toLowerCase() ===
                      detail?.rentalAddress?.toLowerCase() &&
                    item.txHashReturn ? (
                      <NFTItem>
                        <NFTLabel fontWeight="500">
                          Return Transaction Hash
                        </NFTLabel>
                        <CopyField
                          onPress={() => handleCopyAddress(item.txHashReturn)}
                        >
                          <PriceLabel
                            fontWeight="400"
                            color={Colors.blue}
                            style={{ textAlign: 'right' }}
                          >
                            {handleTail(item.txHashReturn)}{' '}
                          </PriceLabel>
                          <IcCopy />
                        </CopyField>
                        {copy && item.txHashReturn === addressCopied ? (
                          <CopyToast>
                            <PriceLabel
                              fontWeight="400"
                              fontSize={14}
                              color={Colors.white}
                            >
                              Copied
                            </PriceLabel>
                          </CopyToast>
                        ) : null}
                      </NFTItem>
                    ) : null}
                  </HistoryBox>
                ))}
            </ContentContainer>
          ) : (
            <NFTValueInfo>This NFT has not been rented before.</NFTValueInfo>
          )}
        </Collapsible>
      </ScrollView>
      {renderGroupActions()}
      <PopupLoadingMetamask visible={handleLoading} />
    </DetailContainer>
  );
};
export default NFTDetailForRent;
