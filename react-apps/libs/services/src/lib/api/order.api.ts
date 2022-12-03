import authorizedRequest from './authorized-request';

export enum OrderStatus {
  INPROGRESS = 'INPROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
  REFUNDED = 'REFUNDED',
}

export interface InfoLenderRender {
  address: string;
  avatar: string;
  name: string;
  userName: string;
}

export interface Order {
  createdAt: string;
  gasFee: number;
  id: string;
  lender: InfoLenderRender;
  marketId: string;
  nftDetails: string;
  nftId: string;
  pickedDuration: number;
  pickedLabel: string;
  pickedPrice: number;
  renter: InfoLenderRender;
  serviceFee: number;
  status: OrderStatus;
  totalPrice: number;
  updatedAt: string;
  txHash: string;
  receivingNftDate: string;
  tokenId: string;
  tokenAddress: string;
  wrappedContractAddress: string;
  wrappedTokenId: string;
}

export interface RequestCreateOrder {
  nftId: string;
  packageId: string;
  txHash: string;
  marketId: string;
}
export interface Proxy {
  createdAt: string;
  id: string;
  keyStore: string;
  ownerAddress: string;
  proxyAddress: string;
  updatedAt: string;
  deadlineSignature: number;
  signature: string;
}

export type Sort = 'ASC' | 'DESC';
export interface ParamsGetListOrder {
  page: number;
  limit: number;
  createdAt?: Sort;
  updatedAt?: Sort;
  price?: Sort;
  nftId?: string;
  renterAddress?: string;
  lenderAddress?: string;
  status?: OrderStatus;
}
export interface ListOrderResponse {
  count: number;
  currentPage: number;
  totalPage: number;
  data: Order[];
}

export const orderApi = {
  createOrder: (request: RequestCreateOrder) =>
    authorizedRequest.post<Order>('/orders', request),
  getOrderById: (id: string) => authorizedRequest.get<Order>(`/orders/${id}`),
  // getProxyWallet: () => authorizedRequest.get<Proxy>(`/proxy`),
  getProxyWalletByNft: (nftId: string) =>
    authorizedRequest.get<Proxy>(`/proxy/nft/${nftId}`),
  getProxyWalletPublic: (address: string) =>
    authorizedRequest.get<Proxy>(`/proxy/${address}`),
  getOrderByTxHash: (txHash: string) =>
    authorizedRequest.get<Order>(`/orders/transaction/${txHash}`),
  getListOfOrders: (params: ParamsGetListOrder) =>
    authorizedRequest
      .get<ListOrderResponse>(`/orders`, { params })
      .then((res) => res.data),
};
