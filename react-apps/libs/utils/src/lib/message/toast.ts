export const MESSAGE = {
  ER001: 'Something went wrong',
  MS001:
    'You are viewing data from the main network, but your wallet is connected to the test network. To use Namo, please switch to the main network.',
};

export const ERROR = {
  ER_SESSION_EXPIRE: 'Session expired!',
  ER_STH_WENT_WRONG: 'Something went wrong',
  ER_NO_METAMASK:
    'We can’t connect to Metamask. Please check your Metamask account.',
  ER_DENIED_METAMASK:
    'You have denied authorisation on MetaMask. Please try again!',
  ER_STOP_RENTING:
    'There was a problem stopping rental for this NFT. Please try again!',
  ER_SET_FOR_RENT:
    'There was a problem setting your NFT up for rent. Please try again!',
  ER_RENT: 'There was a problem renting this NFT. Please try again!',
  ER_NO_BALANCE: 'Insufficient USDC in your account for payment.',
  ER_EDIT_RENTING:
    'There was a problem editing rental details for this NFT. Please try again!',
  ER_YOU_NOT_NFT_OWNER: 'You are not the NFT owner.',
  ER_PAYMENT_FAILED: 'Your payment has failed',
  ER_USER_EXIST: 'Username already existed. Please try another name.',
};

export const SUCCESS = {
  UPLOAD: 'Upload Successful',
  UPDATED_PROFILE: 'Your profile has been updated',
  UPDATED_INFO_RENTAL: 'The rental information has been updated',
  STOP_RENTING: 'You have successfully stopped NFT renting',
  RENTED_NFT: 'You have successfully rented the NFT',
  SETUP_FOR_RENT_NFT: 'Your NFT is successfully set up for rent',
  LOGIN_SUCCESSFUL: 'Login successful',
};

export const WARNING = {
  NFT_RENTAL_PROCESSING: 'Your NFT rental setup is processing.',
  TRANSACTION_PROCESSING: 'Your transaction is processing',
};

export const MESSAGE_VALIDATE_UPLOAD = {
  ER_TYPE: 'Failed to upload, format is not supported.',
  ER_SIZE: 'Photo exceeds the allowable size (10MB), please retry your upload.',
};
