import { MetaMaskInpageProvider } from '@metamask/providers';

export interface MultiInpageProvider {
  providers: MetaMaskInpageProvider[];
  chainId: string;
  isMetaMask: boolean;
}
declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider | MultiInpageProvider | undefined;
  }
}
