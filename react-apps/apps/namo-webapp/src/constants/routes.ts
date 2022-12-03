export enum ROUTES {
  HOME = '/',
  LOGIN = '/login',
  PROFILE = '/profile',
  PROFILE_PUBLIC = '/profile-public',
  NFT = '/nft',
  MY_NFT = '/my-nft',
  ORDER = '/order',
  ABOUT_US = '/about-us',
  TERMS = '/terms',
  FAQ = '/FAQ',
  HELP_CENTRE = '/help-centre',
}

export enum DETAIL_NFT_ROUTES {
  RENTING = 'renting',
}

export enum MY_NFT_ROUTES {
  DETAIL = ':tokenAddress/:tokenId',
  SET_FOR_RENT = 'set-for-rent',
  EDIT_RENTING_CONFIG = 'edit',
}

export enum PROFILE_ROUTES {
  FOR_RENT = 'for-rent',
  RENTALS = 'rentals',
  GALLERY = 'gallery',
  ORDERS = 'orders',
}

export const PRIVATE_ROUTES = [
  ROUTES.PROFILE,
  ROUTES.MY_NFT,
  DETAIL_NFT_ROUTES.RENTING,
];
