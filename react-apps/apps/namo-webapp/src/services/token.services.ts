import { ERC_20, ERC_721, LOAN_NFT } from '@namo-workspace/services';
import { parseWei } from '@namo-workspace/utils';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

export interface TransferNftResponse {
  blockHash: string;
  blockNumber: number;
  contractAddress: null;
  cumulativeGasUsed: number;
  events: unknown;
  from: string;
  gasUsed: number;
  logsBloom: string;
  status: boolean;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  type: string;
}
export interface RentNftResponse {
  blockHash: string;
  blockNumber: number;
  contractAddress: string;
  cumulativeGasUsed: number;
  effectiveGasPrice: number;
  from: string;
  gasUsed: number;
  logsBloom: string;
  status: boolean;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  type: string;
  events: unknown;
}

const tokenServices = {
  approveERC721NFT: async (
    web3: Web3,
    contractAddress: string,
    from: string,
    to: string,
    approved: boolean
  ) => {
    const ERC721Contract = new web3.eth.Contract(
      ERC_721 as unknown as AbiItem,
      contractAddress
    );
    return ERC721Contract.methods.setApprovalForAll(to, approved).send({
      from,
    });
  },
  getApprovedERC721: async (
    web3: Web3,
    contractAddress: string,
    from: string,
    to: string
  ): Promise<boolean> => {
    const ERC721Contract = new web3.eth.Contract(
      ERC_721 as unknown as AbiItem,
      contractAddress
    );
    return ERC721Contract.methods.isApprovedForAll(from, to).call();
  },
  transferFromERC721: async (
    web3: Web3,
    address: string,
    contractAddress: string,
    from: string,
    to: string,
    tokenId: string,
    onConfirm?: (txHash: string) => void
  ): Promise<TransferNftResponse> => {
    const ERC721 = new web3.eth.Contract(
      ERC_721 as unknown as AbiItem,
      contractAddress
    );
    const method = ERC721.methods.transferFrom(from, to, tokenId).send({
      from: address,
    });
    method.on('transactionHash', onConfirm);
    return method;
  },
  approveERC20: async (
    web3: Web3,
    address: string,
    contractAddress: string,
    to: string,
    amount: number
  ) => {
    const ERC20Contract = new web3.eth.Contract(
      ERC_20 as unknown as AbiItem,
      contractAddress
    );
    return ERC20Contract.methods
      .approve(to, web3.utils.toWei(`${amount}`))
      .send({
        from: address,
      });
  },
  getApprovedERC20: async (
    web3: Web3,
    contractAddress: string,
    from: string,
    to: string
  ): Promise<string> => {
    const ERC20Contract = new web3.eth.Contract(
      ERC_20 as unknown as AbiItem,
      contractAddress
    );
    return ERC20Contract.methods.allowance(from, to).call();
  },
  getBalanceERC20: async (
    web3: Web3,
    contractAddress: string,
    from: string
  ): Promise<number> => {
    const ERC20Contract = new web3.eth.Contract(
      ERC_20 as unknown as AbiItem,
      contractAddress
    );
    const balance = await ERC20Contract.methods.balanceOf(from).call();
    return parseWei(balance);
  },
  listNft: async (
    web3: Web3,
    contractAddress: string,
    from: string,
    tokenAddress: string,
    tokenId: string,
    durations: number[],
    prices: number[],
    paymentToken: string,

    onTransactionHash?: (txHash: string) => void
  ) => {
    const LoanContract = new web3.eth.Contract(
      LOAN_NFT.abi as unknown as AbiItem,
      contractAddress
    );
    const method = LoanContract.methods
      .listItem(
        tokenAddress,
        tokenId,
        durations,
        prices.map((price) => web3.utils.toWei(`${price}`)),
        paymentToken
      )
      .send({ from });
    if (onTransactionHash) {
      method.on('transactionHash', onTransactionHash);
    }
    return method;
  },
  editRenting: async (
    web3: Web3,
    contractAddress: string,
    from: string,
    marketId: string,
    durations: number[],
    prices: number[],
    paymentToken: string
  ) => {
    const LoanContract = new web3.eth.Contract(
      LOAN_NFT.abi as unknown as AbiItem,
      contractAddress
    );
    const method = LoanContract.methods
      .editItem(
        marketId,
        durations,
        prices.map((price) => web3.utils.toWei(`${price}`)),
        paymentToken
      )
      .send({ from });

    return method;
  },
  rentNft: async (
    web3: Web3,
    contractAddress: string,
    from: string,
    proxyAddress: string,
    marketId: string,
    packageIndex: string,
    deadline: number,
    sign: string
  ): Promise<RentNftResponse> => {
    const LoanContract = new web3.eth.Contract(
      LOAN_NFT.abi as unknown as AbiItem,
      contractAddress
    );
    const gasPrice = await web3.eth.getGasPrice();
    const value = Math.max(+gasPrice, +web3.utils.toWei('6', 'gwei')) * 310000;

    const gasToPay = Math.max(+gasPrice, +web3.utils.toWei('6', 'gwei'));

    return LoanContract.methods
      .hireItemWithSig(proxyAddress, +marketId, +packageIndex, deadline, sign)
      .send({ from, value, gasPrice: gasToPay });
  },
  stopRenting: (
    web3: Web3,
    contractAddress: string,
    from: string,
    marketId: string
  ) => {
    const LoanContract = new web3.eth.Contract(
      LOAN_NFT.abi as unknown as AbiItem,
      contractAddress
    );

    return LoanContract.methods.delistItem(+marketId).send({ from });
  },
};

export default tokenServices;
