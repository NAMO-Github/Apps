/* eslint-disable @typescript-eslint/no-empty-function */
import { Storage } from '@constants/storages';
import { tokenManager } from '@namo-workspace/services';
import { ERROR } from '@namo-workspace/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainTab } from '@routes/routes.constants';
import { navigationService } from '@services/navigation';
import { showMessageError } from '@services/showMessage';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export interface Auth {
  token: string;
  onLogin: (
    token: string,
    exp: number,
    address?: string,
    chain?: string
  ) => Promise<void>;
  isLoggedIn: boolean;
  address: string;
  setAddress: (address: string) => void;
  chain: string;
  setChain: (chain: string) => void;
}

interface AuthProviderProps {
  children?: React.ReactNode;
}

export const AuthContext = React.createContext<Auth>({
  token: '',
  onLogin: () => Promise.resolve(),
  isLoggedIn: false,
  address: '',
  setAddress: (address: string) => {},
  chain: '',
  setChain: (chain: string) => {},
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string>('');
  const [expireDate, setExpireDate] = useState<number>(0);
  const isLoggedIn = useMemo(() => !!token, [token]);
  const [address, setAddress] = useState<string>('');
  const [chain, setChain] = useState<string>('');
  const connector = useWalletConnect();
  const connectRef = useRef(connector);

  const init = async () => {
    const token = await AsyncStorage.getItem(Storage.TOKEN);
    const exp = await AsyncStorage.getItem(Storage.EXP);
    const address = await AsyncStorage.getItem(Storage.ADDRESS);
    const chain = await AsyncStorage.getItem(Storage.CHAIN);

    setToken(token);
    setExpireDate(Number(exp));
    setAddress(address);
    setChain(chain);
  };

  const handleLogout = async () => {
    setToken('');
    tokenManager.setToken('');
    await AsyncStorage.multiSet([
      [Storage.TOKEN, ''],
      [Storage.CONNECT_WALLET, ''],
      [Storage.ADDRESS, ''],
      [Storage.CHAIN, ''],
    ]);
    if (connectRef?.current?.connected) connectRef?.current?.killSession();
  };

  useEffect(() => {
    if (connectRef) connectRef.current = connector;
  }, [connector]);

  useEffect(() => {
    tokenManager.setLogoutMethod(handleLogout);

    tokenManager.sessionExpire = async () => {
      handleLogout();
      showMessageError(ERROR.ER_SESSION_EXPIRE);
      navigationService.navigator.navigate(MainTab.PROFILE_STACK);
    };

    init();
  }, []);

  useEffect(() => {
    tokenManager.setToken(token);
    if (token) {
      const tokenTimeout = setTimeout(() => {
        tokenManager.doLogout();
      }, expireDate * 1000 - new Date().getTime());
      return () => {
        clearTimeout(tokenTimeout);
      };
    }
    return () => {};
  }, [expireDate, token]);

  const onLogin = useCallback(
    async (token: string, exp: number, address?: string, chain?: string) => {
      setToken(token);
      setExpireDate(exp);
      await AsyncStorage.multiSet([
        [Storage.TOKEN, token],
        [Storage.EXP, `${exp}`],
        [Storage.ADDRESS, address],
      ]);
      if (address) setAddress(address);
      if (chain) {
        setChain(chain);
        await AsyncStorage.setItem(Storage.CHAIN, chain);
      }
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        token,
        isLoggedIn,
        onLogin,
        address,
        setAddress,
        chain,
        setChain,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
