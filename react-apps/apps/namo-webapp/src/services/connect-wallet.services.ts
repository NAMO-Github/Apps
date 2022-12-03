import { MetaMaskInpageProvider } from '@metamask/providers';
import { environment } from '@namo-workspace/environments';
import { InfoNFT } from '@namo-workspace/services';
import { parseChainId, parseWei } from '@namo-workspace/utils';
import Web3 from 'web3';

const connectWalletServices = {
  getAccounts: async (web3: Web3) => {
    try {
      const accounts = await web3.eth.getAccounts();
      if (accounts.length) {
        return Promise.resolve(accounts[0]);
      } else {
        return Promise.reject(new Error('Unauthorized'));
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },
  getBalance: async (web3: Web3, address: string) => {
    try {
      const balance = await web3.eth.getBalance(address);
      return Promise.resolve(parseWei(+balance));
    } catch (error) {
      return Promise.reject(error);
    }
  },
  signatureMessage: async (
    web3: Web3,
    publicAddress: string,
    message: string
  ) => {
    return await web3.eth.personal.sign(message, publicAddress, '');
  },
  signNft: async (
    metamask: MetaMaskInpageProvider,
    publicAddress: string,
    infoNft: InfoNFT
  ) => {
    const msgParams = JSON.stringify({
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          {
            name: 'version',
            type: 'string',
          },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        NFT: [
          { name: 'tokenAddress', type: 'address' },
          { name: 'contractType', type: 'string' },
          {
            name: 'tokenId',
            type: 'string',
          },
          { name: 'tokenUri', type: 'string' },
          { name: 'amount', type: 'string' },
          {
            name: 'symbol',
            type: 'string',
          },
          { name: 'metadata', type: 'string' },
          { name: 'from', type: 'address' },
          { name: 'to', type: 'address' },
        ],
      },
      primaryType: 'NFT',
      domain: {
        name: 'NFT sign',
        version: '4',
        chainId: parseChainId(environment.mainnetChainId[0]),
        verifyingContract: infoNft.tokenAddress,
      },
      message: {
        tokenAddress: infoNft.tokenAddress,
        contractType: infoNft.contractType,
        tokenId: infoNft.tokenId,
        tokenUri: infoNft.tokenUri,
        amount: infoNft.amount,
        symbol: infoNft.symbol,
        metadata: infoNft.metadata,
        from: infoNft.ownerOf,
        to: infoNft.ownerOf, // Replace this one to borrower address in product
      },
    });

    const from = publicAddress;
    const params = [from, msgParams];

    const signature = await metamask?.request({
      method: 'eth_signTypedData_v4',
      params,
    });

    return signature as string;
  },
};
export default connectWalletServices;
