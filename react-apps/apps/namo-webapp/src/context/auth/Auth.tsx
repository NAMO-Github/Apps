/* eslint-disable @typescript-eslint/no-empty-function */
import ModalWelcome from '@components/Modal/ModalWelcome';
import { ROUTES } from '@constants/routes';
import { useNavigateWithoutPrompt } from '@context/prompt-modal';
import { useWalletAuth } from '@context/wallet-auth';
import useToggle from '@hooks/useToggle';
import { authApi, tokenManager, UserInfo } from '@namo-workspace/services';
import { MESSAGE, SUCCESS } from '@namo-workspace/utils';
import connectWalletServices from '@services/connect-wallet.services';
import CryptoJS from 'crypto-js';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { toast } from 'react-toastify';

export interface IAuth {
  token: string;
  userInfo: UserInfo | null;
  login: (
    address: string,
    loginWithoutGetUserInfo?: boolean,
    onSuccess?: () => void
  ) => Promise<void>;
  isLoggedIn: boolean;
  isLoading: boolean;
  getUserInfo: () => Promise<void>;
}

interface IAuthProviderProps {
  children?: React.ReactNode;
}

export const AuthContext = React.createContext<IAuth>({
  token: '',
  userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}') || null,
  login: () => Promise.resolve(),
  isLoggedIn: !!localStorage.getItem('token') || false,
  isLoading: false,
  getUserInfo: () => Promise.resolve(),
});

const getLocalUserInfo = () => {
  try {
    return JSON.parse(localStorage.getItem('user_info') || '{}') || null;
  } catch (error) {
    return null;
  }
};

export const AuthProvider = ({ children }: IAuthProviderProps) => {
  const navigate = useNavigateWithoutPrompt();
  const { web3, account } = useWalletAuth();
  const { isOpen, close, open } = useToggle();

  const onSuccessFn = useRef(() => {});
  const addressRef = useRef('');

  const [token, setToken] = useState<string>(
    localStorage.getItem('token') || ''
  );
  const [userInfo, setUserInfo] = useState<UserInfo | null>(getLocalUserInfo());
  const [expireDate, setExpireDate] = useState<number>(
    Number(localStorage.getItem('exp')) || 0
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isLoggedIn = useMemo(() => !!token, [token]);

  useEffect(() => {
    tokenManager.setLogoutMethod(() => {
      setToken('');
      setUserInfo(null);
      setExpireDate(0);

      tokenManager.setToken('');
      localStorage.removeItem('token');
      localStorage.removeItem('exp');
      localStorage.removeItem('user_info');
      localStorage.removeItem('message');
    });
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('exp', `${expireDate}`);

      tokenManager.setToken(token);
      const tokenTimeout = setTimeout(() => {
        tokenManager.doLogout();
      }, expireDate * 1000 - new Date().getTime());
      return () => {
        clearTimeout(tokenTimeout);
      };
    }
    return () => {};
  }, [expireDate, token]);

  const login = useCallback(
    async (
      address: string,
      loginWithoutGetUserInfo?: boolean,
      onSuccess?: () => void
    ) => {
      try {
        if (!account) {
          throw new Error('No account');
        }
        setIsLoading(true);
        const { message, nonce, isSigned } = await authApi.signUp(address);
        if (isSigned) {
          const signature = CryptoJS.AES.encrypt(address, nonce).toString();
          const { token, exp } = await authApi.login({
            address,
            signature,
          });

          setToken(token);
          setExpireDate(exp);
          tokenManager.setToken(token);
          if (!loginWithoutGetUserInfo) {
            authApi.getUserInfo().then((userInfo) => {
              setUserInfo(userInfo);
              localStorage.setItem('user_info', JSON.stringify(userInfo));
            });
          }
          toast.success(SUCCESS.LOGIN_SUCCESSFUL);
          onSuccess?.();
          onSuccessFn.current = () => {};
          addressRef.current = '';
        } else {
          localStorage.setItem('message', message);
          if (loginWithoutGetUserInfo) {
            localStorage.setItem('login-without-get-user-info', 'TRUE');
          }
          if (onSuccess) {
            onSuccessFn.current = onSuccess;
          }
          addressRef.current = address;
          open();
        }
        setIsLoading(false);
      } catch (error) {
        navigate(ROUTES.LOGIN);
        toast.error(MESSAGE.ER001);
        throw error;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account, open]
  );

  const handleSign = useCallback(async () => {
    try {
      setIsLoading(true);
      if (web3 && addressRef.current) {
        const message = localStorage.getItem('message') || '';
        const loginWithoutGetUserInfo =
          localStorage.getItem('login-without-get-user-info') || '';
        const signature = await connectWalletServices.signatureMessage(
          web3,
          addressRef.current,
          message
        );
        localStorage.removeItem('message');
        const { token, exp } = await authApi.login({
          address: addressRef.current || '',
          signature,
        });
        setToken(token);
        setExpireDate(exp);
        close();

        tokenManager.setToken(token);
        if (!loginWithoutGetUserInfo) {
          authApi.getUserInfo().then((userInfo) => {
            setUserInfo(userInfo);
            localStorage.setItem('user_info', JSON.stringify(userInfo));
          });
        }
        localStorage.removeItem('login-without-get-user-info');
        onSuccessFn.current();
        onSuccessFn.current = () => {};
        toast.success(SUCCESS.LOGIN_SUCCESSFUL);
      } else {
        throw new Error();
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }, [close, web3]);

  const handleCancelSign = useCallback(() => {
    tokenManager.doLogout();
    close();
    onSuccessFn.current = () => {};
    addressRef.current = '';
    navigate(ROUTES.LOGIN, { replace: true });
  }, [close, navigate]);

  const getUserInfo = useCallback(async () => {
    try {
      if (!account) throw new Error('No account');
      setIsLoading(true);
      const userInfo = await authApi.getUserInfo();

      setUserInfo(userInfo);
      localStorage.setItem('user_info', JSON.stringify(userInfo));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, [account]);

  return (
    <AuthContext.Provider
      value={{
        token,
        userInfo,
        isLoggedIn,
        login,
        isLoading,
        getUserInfo,
      }}
    >
      {children}
      <ModalWelcome
        isOpen={isOpen}
        onClose={handleCancelSign}
        onOk={handleSign}
        isLoading={isLoading}
      />
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
