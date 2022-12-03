import environment from 'react-native-config';

export const STATUS = {
  UNAVAILABLE: 'unavailable',
  PROCESSING: 'processing',
  ORDERED: 'ordered',
  FORRENT: 'for rent',
  RENTED: 'rented',
  TOPAY: 'to pay',
  COMPLETED: 'completed',
  SUCCESSFUL: 'successful',
  PENDING: 'pending',
  FAILED: 'failed',
};
export enum UNITS {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

export enum NFT_STATUS {
  PROCESSING = 'PROCESSING',
  FORRENT = 'FORRENT',
  ORDERED = 'ORDERED',
  RENTED = 'RENTED',
  UNAVAILABLE = 'UNAVAILABLE',
}

export enum DURATIONS {
  DAY = 1,
  WEEK = 7,
  MONTH = 30,
  YEAR = 365,
}

export const NAMO_SC = environment.namoSmartContract;
export const NAMO_Token = environment.namoTokenSC;

export const CHAINS = {
  BSC_TESTNET: 97,
  ROPSTEN: 3,
};
