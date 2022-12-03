import { MetaMaskInpageProvider } from '@metamask/providers';
import Web3 from 'web3';

export interface IWalletAuthValue {
  isConnected: boolean;
  account: string;
  chainId: string;
  web3: Web3;
  connect: () => Promise<string>;
  metamask: MetaMaskInpageProvider;
  isLoading: boolean;
}

export interface ProviderConnectInfo {
  readonly chainId: string;
}

export interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

export interface MetamaskError {
  code: number;
  message: string;
  stack: string;
}

export class NoMetamaskError extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
    this.message = 'Please install Metamask';
  }
}
export class UserRejectedRequestError extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
    this.message = 'The user rejected the request.';
  }
}

export class UnAuthorizedMetamaskError extends Error {
  public constructor() {
    super();
    this.name = this.constructor.name;
    this.message = ' UnAuthorized metamask';
  }
}
