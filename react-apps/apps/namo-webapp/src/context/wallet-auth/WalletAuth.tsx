/* eslint-disable @typescript-eslint/no-explicit-any */
import { ROUTES } from '@constants/routes';
import { useNavigateWithoutPrompt } from '@context/prompt-modal';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { environment } from '@namo-workspace/environments';
import { tokenManager } from '@namo-workspace/services';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Web3 from 'web3';
import { AbstractProvider } from 'web3-core';
import { MultiInpageProvider } from '../..';

import {
  IWalletAuthValue,
  NoMetamaskError,
  ProviderConnectInfo,
  UnAuthorizedMetamaskError,
  UserRejectedRequestError,
} from './type';

export const WalletAuthContext = createContext<Partial<IWalletAuthValue>>({});

type Props = {
  children: ReactNode;
};

const isMultiInpageProvider = (
  instance: unknown
): instance is MultiInpageProvider => {
  return !!(instance && (instance as MultiInpageProvider).providers);
};

const getMetamask = () => {
  if (isMultiInpageProvider(window.ethereum)) {
    return (
      (Array.isArray(window.ethereum.providers) &&
        window.ethereum.providers.find(
          (provider: MetaMaskInpageProvider) => provider.isMetaMask
        )) ||
      undefined
    );
  }
  return window.ethereum && window.ethereum.isMetaMask
    ? window.ethereum
    : undefined;
};

const metamask = getMetamask();

export function WalletAuthProvider({ children }: Props) {
  const navigate = useNavigateWithoutPrompt();

  const [account, setAccount] = useState<string | undefined>(
    localStorage.getItem('address') || undefined
  );
  const [chainId, setChainId] = useState<string | undefined>();
  const [web3, setWeb3] = useState<Web3>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isConnected = useMemo(() => !!account, [account]);

  const handleChainChanged = useCallback((chainId: unknown): void => {
    setChainId(chainId as string);
  }, []);
  const handleAccountChanged = useCallback(
    (accounts: unknown): void => {
      if (!!accounts && Array.isArray(accounts) && accounts.length) {
        setAccount(accounts[0]);
      } else {
        setAccount(undefined);
        tokenManager.doLogout();
        navigate(ROUTES.LOGIN);
      }
    },
    [navigate]
  );
  const handleConnect = useCallback((params: unknown): void => {
    if ((params as ProviderConnectInfo).chainId) {
      setChainId((params as ProviderConnectInfo).chainId);
    }
  }, []);
  const handleDisconnect = useCallback((): void => {
    setAccount(undefined);
  }, []);

  const connect = useCallback(async (withoutStartMetamask?: boolean) => {
    setIsLoading(true);
    if (metamask) {
      try {
        const [accounts, chainId] = await Promise.all([
          metamask.request<string[]>({
            method: 'eth_requestAccounts',
          }),
          metamask.request<string>({
            method: 'eth_chainId',
          }),
        ]);
        if (accounts && accounts.length && !!accounts[0]) {
          setAccount(accounts[0]);
          if (typeof chainId === 'string') {
            setChainId(chainId);
            try {
              if (!environment.mainnetChainId.includes(chainId))
                await metamask.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId: environment.mainnetChainId[0] }], // chainId must be in hexadecimal numbers
                });
            } catch (error) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              if ((error as any).code === 4902) {
                await metamask.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: environment.mainnetChainId[0],
                      rpcUrls: [environment.rpcUrl],
                      chainName: environment.chainName,
                      nativeCurrency: {
                        symbol: environment.symbol,
                        decimals: 18,
                      },
                      blockExplorerUrls: [environment.blockExplorerUrls],
                    },
                  ],
                });
              }
            }
          }

          setIsLoading(false);
          return Promise.resolve(accounts[0]);
        } else {
          setAccount(undefined);
          setIsLoading(false);
          return Promise.reject(new UnAuthorizedMetamaskError());
        }
      } catch (error: unknown) {
        setAccount(undefined);
        setIsLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((error as any).code === 4001) {
          return Promise.reject(new UserRejectedRequestError());
        }

        return Promise.reject(new UnAuthorizedMetamaskError());
      }
    } else {
      setAccount(undefined);
      setIsLoading(false);
      if (!withoutStartMetamask) {
        window.open(environment.metamaskDownloadUrl, '_blank')?.focus();
      }

      return Promise.reject(new NoMetamaskError());
    }
  }, []);

  useEffect(() => {
    if (metamask) {
      const provider = new Web3(metamask as AbstractProvider);
      setWeb3(provider);
      if (account) {
        localStorage.setItem('address', account);
        metamask.on('connect', handleConnect);
        metamask.on('disconnect', handleDisconnect);
        metamask.on('chainChanged', handleChainChanged);
        metamask.on('accountsChanged', handleAccountChanged);
      } else {
        localStorage.removeItem('address');
        setAccount(undefined);
        setChainId(undefined);
        setWeb3(undefined);
        return () => {
          if (metamask && metamask.removeListener) {
            metamask.removeListener('connect', handleConnect);
            metamask.removeListener('disconnect', handleDisconnect);
            metamask.removeListener('chainChanged', handleChainChanged);
            metamask.removeListener('accountsChanged', handleAccountChanged);
          }
        };
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }, [
    account,
    handleAccountChanged,
    handleChainChanged,
    handleConnect,
    handleDisconnect,
  ]);

  useEffect(() => {
    const account = localStorage.getItem('address');
    if (account) {
      connect(true);
    }
  }, [connect]);

  return (
    <WalletAuthContext.Provider
      value={{
        isConnected,
        account,
        chainId,
        web3,
        metamask,
        connect,
        isLoading,
      }}
    >
      {children}
    </WalletAuthContext.Provider>
  );
}

export const useWalletAuth = () => useContext(WalletAuthContext);
