import { Storage } from '@constants/storages';
import { useAuth } from '@context/auth';
import { Images } from '@images';
import { authApi } from '@namo-workspace/services';
import Button from '@namo-workspace/ui/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WalletConnectContext } from '@walletconnect/react-native-dapp';
import formatWalletServiceUrl from '@walletconnect/react-native-dapp/dist/constants/formatWalletServiceUrl';
import CryptoJS from 'crypto-js';
import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { Linking, Platform, View } from 'react-native';
import styled from 'styled-components/native';

import { Colors } from '@namo-workspace/themes';
import Popup from '@namo-workspace/ui/Popup';
import { Body3 } from '@namo-workspace/ui/Typography';
import { ERROR } from '@namo-workspace/utils';
import {
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTab } from '@routes/routes.constants';
import { SearchStackParams } from '@routes/routes.model';
import { showMessageError } from '@services/showMessage';

const { Icfox, IcAppNamo } = Images;
export type NFTDetailContainerProp = NativeStackNavigationProp<
  SearchStackParams,
  'NFT_DETAIL'
>;

const ConnectWallet: FC = () => {
  const { walletServices, connector } = useContext(WalletConnectContext);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { onLogin } = useAuth();
  const popUpRef = useRef(null);
  const { params } = useRoute<RouteProp<ParamListBase>>();
  const previousRoute = params ? params['previousRoute'] : '';
  const navigation = useNavigation<NFTDetailContainerProp>();

  const messageRef = useRef('');
  const addressRef = useRef('');
  const [signature, setSignature] = useState('');

  useEffect(() => {
    const effect = async () => {
      const address = addressRef.current;
      if (signature && address) {
        try {
          const { token, exp } = await authApi.login({
            address,
            signature,
          });
          await onLogin(token, exp, address, walletServices[3].chains[0]);
          await AsyncStorage.setItem(Storage.IS_CONNECT, 'connected');

          if (previousRoute && Object.values(MainTab).includes(previousRoute)) {
            navigation.navigate(previousRoute);
          }
        } catch (error) {
          showMessageError(ERROR.ER_STH_WENT_WRONG);
        }
      }
    };
    effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  const handleConnect = async () => {
    try {
      let address = await AsyncStorage.getItem(Storage.CONNECT_WALLET);

      const connectionUrl = `${formatWalletServiceUrl(walletServices[3])}/wc`;
      if (await Linking.canOpenURL(connectionUrl)) {
        const connect = await connector.connect();
        if (!address && connect?.accounts?.[0]) {
          await AsyncStorage.setItem(
            Storage.CONNECT_WALLET,
            connect.accounts[0]
          );
          address = connect.accounts[0];
        }

        const { nonce, isSigned, message } = await authApi.signUp(address);
        messageRef.current = message;
        addressRef.current = address;
        setIsConnected(!isSigned);

        if (isSigned) {
          const sign = CryptoJS.AES.encrypt(address, nonce).toString();
          setSignature(sign);
        }
      } else {
        return Linking.openURL(walletServices[3].app[Platform.OS]);
      }
    } catch (error) {
      if (error?.toString()?.includes('denied')) {
        showMessageError(ERROR.ER_DENIED_METAMASK);
      }
    }
  };

  const handleSign = async () => {
    try {
      const sign = await connector.signPersonalMessage([
        messageRef.current,
        addressRef.current,
      ]);
      setSignature(sign);
    } catch (err) {
      await AsyncStorage.removeItem(Storage.CONNECT_WALLET);
      setIsConnected(false);
      showMessageError(ERROR.ER_STH_WENT_WRONG);
    }
  };

  // const handleOpenPrivacy = () => popUpRef?.current?.open();

  return (
    <Container>
      <Content>
        <Icfox width={80} />
        <Information>
          <Title fontWeight="700">Connect with wallet</Title>
          <Description>Your crypto wallet securely stores your</Description>
          <Description>digital goods and cryptocurrencies.</Description>
          <Description>Connect to one of your accounts</Description>
          <Description>or create a new one.</Description>
        </Information>
        {isConnected ? (
          <Button full onPress={handleSign}>
            Sign with Metamask
          </Button>
        ) : (
          <Button full onPress={handleConnect}>
            Connect with MetaMask
          </Button>
        )}
      </Content>
      <Popup
        ref={popUpRef}
        title={'Privacy info'}
        logo={<IcAppNamo height={61} width={60} />}
        description={
          'By connecting your wallet and using NAMO, you agree to our Terms of Service and Privacy Policy'
        }
        buttonCancel={'Cancel'}
        buttonHandle={'Connect'}
        handleFunction={handleConnect}
      />
    </Container>
  );
};

const Container = styled(View)`
  padding: 16px;
  background: ${Colors.background};
  flex: 1;
`;

const Content = styled(View)`
  flex: 1;
  align-items: center;
  margin-top: 25%;
  width: 100%;
`;

const Information = styled(View)`
  margin-top: 32px;
  margin-bottom: 40px;
`;

const Title = styled(Body3)`
  color: ${Colors.textLevel1};
  text-align: center;
  margin-bottom: 4px;
`;

const Description = styled(Body3)`
  color: ${Colors.textLevel3};
  text-align: center;
`;

export default ConnectWallet;
