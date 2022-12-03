import { NAMO_SC, NAMO_Token } from '@constants/rent';
import ImageNFT from '@containers/common/ImageNFT';
import PopupLoadingMetamask from '@containers/common/PopupLoadingMetamask';
import { Avatar } from '@containers/search/NFTDetail.style';
import { useAuth } from '@context/auth';
import Images from '@images';
import { Portal } from 'react-native-portalize';
import {
  convertPricePerDay,
  ERC_20,
  InfoNFT,
  LOAN_NFT,
  Order,
  orderApi,
  Packages,
  parseMetaDataToMoralis,
} from '@namo-workspace/services';
import { Colors } from '@namo-workspace/themes';
import Button from '@namo-workspace/ui/Button';
import Popup from '@namo-workspace/ui/Popup';
import { Body2, Body3, Body4 } from '@namo-workspace/ui/Typography';
import View from '@namo-workspace/ui/view/View';
import { ERROR } from '@namo-workspace/utils';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase } from '@react-navigation/routers';
import { MainTab, ProfileRouter, SearchRouter } from '@routes/routes.constants';
import { ProfileStackParams } from '@routes/routes.model';
import * as Sentry from '@sentry/react-native';
import { showMessageError } from '@services/showMessage';
import { getWeb3Instance } from '@services/web3';
import {
  formatWalletServiceUrl,
  WalletConnectContext,
} from '@walletconnect/react-native-dapp';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Linking, TouchableOpacity } from 'react-native';
import environment from 'react-native-config';
import styled from 'styled-components/native';
import { AbiItem } from 'web3-utils';

const { IcAppNamo } = Images;

export type CheckoutProps = NativeStackNavigationProp<
  ProfileStackParams,
  'PROFILE'
>;

export interface MetamaskError {
  code: number;
  message: string;
  stack: string;
}

const Checkout = () => {
  const popUpRef = useRef(null);
  const navigation = useNavigation<CheckoutProps>();
  const { params } = useRoute<RouteProp<ParamListBase & InfoNFT>>();
  const [detail, setDetail] = useState<InfoNFT>();
  const chooseDuration: Packages = params['chooseDuration'];

  const { address, isLoggedIn } = useAuth();
  const [approveLoading, setApproveLoading] = useState<boolean>(false);
  const [approved, setApproved] = useState<boolean>(false);
  const [isLoadingButtonApprove, setIsLoadingButtonApprove] =
    useState<boolean>(true);

  const [transferLoading, setTransferLoading] = useState<boolean>(false);
  const [hash, setHash] = useState<string>('');
  const [orderDetail, setOrderDetail] = useState<Order>();
  const [getOrderDetail, setGetOrderDetail] = useState(false);
  const [blockchainConfirming, setBlockChainConfirming] = useState(false);
  const { walletServices, connector } = useContext(WalletConnectContext);

  const web3 = getWeb3Instance({ connector });

  const intervalRef = useRef(null);

  const { IcEthereum } = Images;

  const getDetailByTxHash = useCallback(async () => {
    orderApi.getOrderByTxHash(hash).then(async (res) => {
      setOrderDetail(res.data);
    });
  }, [hash]);

  const metaMaskCheck = useCallback(async () => {
    const connectionUrl = `${formatWalletServiceUrl(walletServices[3])}/wc`;
    const metaMaskExist = await Linking.canOpenURL(connectionUrl);

    return metaMaskExist;
  }, [walletServices]);

  const handleApprove = useCallback(async () => {
    if (!(await metaMaskCheck())) {
      showMessageError(ERROR.ER_NO_METAMASK);
    } else {
      try {
        setApproveLoading(true);
        const connectionUrl = `${formatWalletServiceUrl(walletServices[3])}/wc`;
        if (
          !(await Linking.canOpenURL(connectionUrl)) ||
          !address ||
          !isLoggedIn
        ) {
          navigation.navigate(MainTab.PROFILE_STACK);
        }
        const ERC20Contract = new web3.eth.Contract(
          ERC_20 as unknown as AbiItem,
          NAMO_Token
        );
        const allowances = await ERC20Contract.methods
          .allowance(address, NAMO_SC)
          .call();

        const allowanceNumber = +web3.utils.fromWei(allowances);

        if (allowanceNumber <= detail?.packages?.[0]?.price || 0) {
          await ERC20Contract.methods
            .approve(NAMO_SC, web3.utils.toWei(`${1000000000}`))
            .send({
              from: address,
            })
            .on('transactionHash', function () {
              setBlockChainConfirming(true);
            })
            .on('receipt', function () {
              setApproved(true);
              setApproveLoading(false);
              setBlockChainConfirming(false);
            })
            .on('error', function () {
              setApproved(false);
              setApproveLoading(false);
              setBlockChainConfirming(false);
            });
        }
        // setApproved(true);
        // setApproveLoading(false);
      } catch (error) {
        Sentry.captureException(error);
        if (error.toString().includes('rejected')) {
          showMessageError(ERROR.ER_DENIED_METAMASK);
        } else if (!isLoggedIn || !address) {
          showMessageError(ERROR.ER_NO_METAMASK);
        } else if (error.toString()) {
          showMessageError(error.toString());
        } else {
          showMessageError(ERROR.ER_RENT);
        }
        setBlockChainConfirming(false);
        setApproveLoading(false);
        setApproved(false);
      }
    }
  }, [
    address,
    detail?.packages,
    isLoggedIn,
    metaMaskCheck,
    navigation,
    walletServices,
    web3.eth.Contract,
    web3.utils,
  ]);

  const handleCheckout = async () => {
    if (!(await metaMaskCheck())) {
      showMessageError(ERROR.ER_NO_METAMASK);
    } else {
      setTransferLoading(true);
      const NamoContract = new web3.eth.Contract(
        LOAN_NFT.abi as unknown as AbiItem,
        NAMO_SC
      );
      try {
        const { data } = await orderApi.getProxyWalletByNft(detail.id);

        const ERC20Contract = new web3.eth.Contract(
          ERC_20 as unknown as AbiItem,
          NAMO_Token
        );
        const calculatedBalance = await ERC20Contract.methods
          .balanceOf(address)
          .call();
        const balance = +web3.utils.fromWei(calculatedBalance);

        if (
          balance < +web3.utils.fromWei(`${detail?.packages?.[0].price || 0}`)
        ) {
          showMessageError(ERROR.ER_NO_BALANCE);
          setTransferLoading(false);
          return;
        }
        const gasPrice = await web3.eth.getGasPrice();
        setTransferLoading(false);
        await NamoContract.methods
          .hireItemWithSig(
            data.proxyAddress,
            +detail.marketItem,
            +detail?.packages?.[0]?.orderNumber || '0',
            data.deadlineSignature,
            data.signature
          )
          .send({
            from: address,
            value: Math.max(+gasPrice, +web3.utils.toWei('6', 'gwei')) * 310000,
            gasPrice: Math.max(+gasPrice, +web3.utils.toWei('6', 'gwei')),
          })
          .on('transactionHash', (hash) => {
            repeatlyGetDetailByTxHash(hash);
            setBlockChainConfirming(true);
          });
        setTransferLoading(false);
        setBlockChainConfirming(false);
      } catch (error) {
        setTransferLoading(false);
        Sentry.captureException(error);
        setBlockChainConfirming(false);
        if (error.toString().includes('rejected')) {
          showMessageError(ERROR.ER_DENIED_METAMASK);
        } else if (error.toString()) {
          showMessageError(error.toString());
        } else {
          showMessageError(ERROR.ER_RENT);
        }
      }
    }
  };

  const showInfo = () => {
    navigation.navigate(SearchRouter.PUBLIC_PROFILE, {
      rentalAddress: detail.rentalAddress,
    });
  };

  useEffect(() => {
    const getApprovedAddress = async () => {
      if (!detail || !address) return;
      setIsLoadingButtonApprove(true);
      try {
        const ERC20Contract = new web3.eth.Contract(
          ERC_20 as unknown as AbiItem,
          NAMO_Token
        );
        const allowances = await ERC20Contract.methods
          .allowance(address, NAMO_SC)
          .call();
        const allowanceNumber = +web3.utils.fromWei(allowances);

        setApproved(
          allowanceNumber >=
            +web3.utils.fromWei(`${detail?.packages[0]?.price || 0}`)
        );
      } catch (error) {
        Sentry.captureException(error);
        if (error.toString()) {
          showMessageError(error.toString());
        } else {
          showMessageError(ERROR.ER_STH_WENT_WRONG);
        }
      } finally {
        setIsLoadingButtonApprove(false);
      }
    };
    if (isLoggedIn) {
      getApprovedAddress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, detail, isLoggedIn]);

  useEffect(() => {
    const effect = async () => {
      try {
        setDetail(await parseMetaDataToMoralis(JSON.parse(params['detail'])));
      } catch (error) {
        setDetail(undefined);
      }
    };
    effect();
  }, [params]);

  const repeatlyGetDetailByTxHash = useCallback(
    (hash: string, retried = 0) => {
      setGetOrderDetail(true);
      orderApi
        .getOrderByTxHash(hash)
        .then(async (res) => {
          console.log('response');
          setGetOrderDetail(false);
          const orderDetail = res.data;
          navigation.replace(ProfileRouter.ORDER_DETAILS, {
            detail: orderDetail,
            infoNFT: JSON.parse(orderDetail?.nftDetails),
            shouldShowStatus: true,
          });
        })
        .catch(() => {
          if (retried < 20) {
            setTimeout(() => {
              return repeatlyGetDetailByTxHash(hash, retried + 1);
            }, +environment.callLoopTime);
          } else {
            showMessageError(
              'Your NFT is rented successfully but we cannot get your order information'
            );
            navigation.goBack();
            setGetOrderDetail(false);
          }
        });
    },
    [navigation]
  );

  return (
    <CheckoutContainer pa={4} pb={2} flexColumn justifySpaceBetween>
      <Container>
        <Container flexRow>
          <ImageNFT detailNft={detail} size={88} />
          <Container ml={4}>
            <OwnerInfo onPress={showInfo}>
              {detail?.avatarOfOwner ? (
                <Avatar source={{ uri: detail?.avatarOfOwner }} />
              ) : (
                <ImageAvatar
                  source={require('../../assets/images/img_avatar.png')}
                />
              )}
              <Description
                fontSize={14}
                fontWeight="400"
                fontStyle="normal"
                color={Colors.textLevel2}
                ml={1}
              >
                {detail?.ownerName ?? 'Lender Name'}
              </Description>
            </OwnerInfo>
            <Container>
              <Description
                fontSize={14}
                fontWeight="600"
                fontStyle="normal"
                color={Colors.textLevel1}
                style={{ flexShrink: 1 }}
              >
                {detail?.name}
              </Description>
            </Container>
            <Container flexRow alignCenter mt={1}>
              <IcEthereum width={20} height={20} />
              <Details
                fontSize={12}
                fontWeight="600"
                fontStyle="normal"
                color={Colors.textLevel2}
              >
                {' '}
                {chooseDuration?.price / Math.pow(10, 18)}{' '}
                <Details
                  fontSize={12}
                  fontWeight="400"
                  fontStyle="normal"
                  color={Colors.textLevel4}
                >
                  (
                  {convertPricePerDay(
                    chooseDuration?.price / Math.pow(10, 18),
                    chooseDuration?.duration
                  )}
                  /day)
                </Details>
              </Details>
            </Container>
          </Container>
        </Container>
        <RentalDuration flexRow justifyCenter mt={4}>
          <Details
            fontSize={12}
            fontWeight="400"
            fontStyle="normal"
            color={Colors.textLevel3}
            pa={2}
          >
            Rental Duration:{' '}
            <Details fontWeight="600">{chooseDuration?.label}</Details>
          </Details>
        </RentalDuration>
        <Container
          mt={4}
          style={{
            borderWidth: 1,
            borderRadius: 16,
            borderColor: Colors.strokeLevel3,
          }}
        >
          <Description
            fontSize={14}
            fontWeight="700"
            fontStyle="normal"
            color={Colors.textLevel1}
            ma={4}
          >
            Payment Details
          </Description>
          <Divider />
          <Container ma={4} flexRow justifySpaceBetween alignCenter>
            <Description
              fontSize={14}
              fontWeight="500"
              fontStyle="normal"
              color={Colors.textLevel1}
            >
              Rental Price
            </Description>
            <Container flexRow alignCenter>
              <IcEthereum width={20} height={20} />
              <Details
                fontSize={12}
                fontWeight="600"
                fontStyle="normal"
                color={Colors.textLevel2}
              >
                {' '}
                {chooseDuration?.price / Math.pow(10, 18)}
              </Details>
            </Container>
          </Container>
        </Container>
      </Container>
      <Container>
        <Button
          activeOpacity={0.6}
          onPress={handleApprove}
          disabled={approved}
          loading={isLoadingButtonApprove || approveLoading}
          style={{ marginBottom: 10 }}
        >
          <Title fontWeight="600" fontSize={16} color={Colors.white}>
            {approved ? 'You Can Rent Now' : 'Allow NAMO to use your USDC'}
          </Title>
        </Button>

        <Button
          activeOpacity={0.6}
          onPress={handleCheckout}
          disabled={!approved}
          loading={transferLoading}
        >
          <Title fontWeight="600" fontSize={16} color={Colors.white}>
            Checkout
          </Title>
        </Button>
      </Container>
      <Popup
        ref={popUpRef}
        buttonHandle="Leave"
        buttonCancel="Cancel"
        title="Cancel Renting"
        description="Are you sure you want to cancel ?"
        handleFunction={() => navigation.goBack()}
      />
      <PopupLoadingMetamask visible={blockchainConfirming} />
      {getOrderDetail && (
        <Portal>
          <View
            flexGrow={1}
            center
            style={{ backgroundColor: 'rgba(153, 153, 153, 0.5)' }}
          >
            <View
              px={12}
              py={5}
              style={{ borderRadius: 10, backgroundColor: 'white' }}
              center
            >
              <Body2 mb={3}>{'Waiting for order detail'}</Body2>
              <IcAppNamo />
            </View>
          </View>
        </Portal>
      )}
    </CheckoutContainer>
  );
};

export default Checkout;

const Title = styled(Body2)`
  text-align: center;
`;

const Container = styled(View)``;

const CheckoutContainer = styled(View)`
  flex: 1;
`;

const Divider = styled(View)`
  height: 1.5px;
  background-color: ${Colors.strokeLevel3};
`;

const RentalDuration = styled(View)`
  background-color: ${Colors.background2};
`;

const ImageAvatar = styled.Image`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  margin-right: 4px;
`;

const Description = styled(Body3)``;

const Details = styled(Body4)``;

const OwnerInfo = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
`;
