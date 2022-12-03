export const PAGE_LIMIT = 20;

export enum STATUS_NFT {
  RENTED = 'RENTED',
  FOR_RENT = 'FORRENT',
  UNAVAILABLE = 'UNAVAILABLE',
  PROCESSING = 'PROCESSING',
  ORDERED = 'ORDERED',
}

export const STATUS: Record<STATUS_NFT, string> = {
  [STATUS_NFT.UNAVAILABLE]: 'unavailable',
  [STATUS_NFT.PROCESSING]: 'processing',
  [STATUS_NFT.FOR_RENT]: 'for rent',
  [STATUS_NFT.RENTED]: 'rented',
  [STATUS_NFT.ORDERED]: 'ordered',
};

export enum TOKEN_TYPE {
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
}
