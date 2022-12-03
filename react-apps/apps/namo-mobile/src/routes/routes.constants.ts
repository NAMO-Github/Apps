export const MainTab = {
  HOME: 'HOME',
  SEARCH_STACK: 'SEARCH_STACK',
  PROFILE_STACK: 'PROFILE_STACK',
  MENU_STACK: 'MENU_STACK',
} as const;

export const SearchRouter = {
  NFT_LIST: 'NFT_LIST',
  NFT_DETAIL: 'NFT_DETAIL',
  NFT_SEARCH: 'NFT_SEARCH',
  PUBLIC_PROFILE: 'PUBLIC_PROFILE',
  NO_INTERNET: 'NO_INTERNET',
  CHECKOUT: 'CHECKOUT',
};

export const ProfileRouter = {
  PROFILE: 'PROFILE',
  NFT_DETAIL_FOR_RENT: 'NFT_DETAIL_FOR_RENT',
  NFT_FOR_RENT: 'NFT_FOR_RENT',
  MORE: 'MORE',
  EDIT_PROFILE: 'EDIT_PROFILE',
  ORDER_DETAILS: 'ORDER_DETAILS',
};

export const MenuRouter = {
  MENU: 'MENU',
  ABOUT_US: 'ABOUT_US',
  TERM_POLICY: 'TERM_POLICY',
  FAQ: 'FAQ',
  HELP_CENTER: 'HELP_CENTER',
};

export const HomeRouter = {
  HOME: 'HOME_PAGE',
};

export const AppRouter = {
  TABS: 'TABS',
} as const;
