import { MAX_LENGTH_SEARCH } from '@constants/common';
import { useUserInfo } from '@context/auth/UserInfoContext';
import Images from '@images';
import { InfoNFT, NftVisible, orderApi } from '@namo-workspace/services';
import { Colors, ElementHeightFromSize } from '@namo-workspace/themes';
import InputSearch from '@namo-workspace/ui/InputSearch';

import View from '@namo-workspace/ui/view/View';
import {
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParams } from '@routes/routes.model';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';
import {
  Keyboard,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native';
import {
  CollapsibleProps,
  CollapsibleRef,
  Tabs,
} from 'react-native-collapsible-tab-view';
import styled from 'styled-components';
import { useKeyboardVisible } from '../../hooks/useKeyboardVisible';
import {
  ButtonSearch,
  ButtonSetVisible,
  customLabel,
  CustomTabBar,
  HeaderContainer,
  SearchContainer,
  TextVisible,
} from './CommonProfile';
import HeaderProfile from './headers/HeaderProfile';
import { ForRentTab, GalleryTab, RentalsTab } from './tabs';
import OrderTab from './tabs/OrderTab';

const { IcForRent, IcRentals, IcGallery, IcSearch, IcOrder } = Images;

interface Profile {
  avatar?: string;
  bio?: string;
  coverImage?: string;
  email?: string;
  follower?: number;
  following?: number;
  name?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  userName?: string;
}

interface Tab {
  index?: number;
}

interface Values {
  profile?: Profile;
}

export type NFTDetailForRentProp = NativeStackNavigationProp<
  ProfileStackParams,
  'NFT_DETAIL_FOR_RENT'
>;

type Props = Partial<CollapsibleProps & Values>;
const MyProfile = React.forwardRef<CollapsibleRef, Props>((props, ref) => {
  const { profile } = props;

  const { userInfo } = useUserInfo();
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [focusInput, setFocusInput] = useState<boolean>(false);
  const [keySearch, setKeySearch] = useState<string>();

  const [isOpenSearch, setIsOpenSearch] = useState<boolean>(false);
  const [isOpenVisibility, setIsOpenVisibility] = useState<boolean>(false);
  const [listSelected, setListSelected] = useState<NftVisible[]>([]);
  const [isSelectedAll, setIsSelectedAll] = useState<boolean>(false);

  const inputRef = useRef(null);
  const isKeyboardVisible = useKeyboardVisible();

  const { params } = useRoute<RouteProp<ParamListBase & Tab>>();
  const newTab = params ? JSON.parse(JSON.stringify(params)) : null;
  const [proxyAddress, setProxyAddress] = useState<string>('');

  const tabRef = useRef<CollapsibleRef>(null);
  const navigation = useNavigation<NFTDetailForRentProp>();

  const [isEmpty, setIsEmpty] = useState([true, true, true, true]);

  const getProxyAddress = useCallback(async () => {
    if (userInfo?.address) {
      const { data } = await orderApi.getProxyWalletPublic(userInfo.address);
      setProxyAddress(data.proxyAddress);
    }
  }, [userInfo?.address]);

  const handleOpenSearch = useCallback(() => {
    setIsOpenSearch(true);
  }, []);
  const handleCloseSearch = useCallback(() => {
    setKeySearch(null);
    setIsOpenSearch(false);
  }, []);

  const handleOpenSetVisibility = useCallback(() => {
    setIsOpenVisibility(true);
  }, []);
  const handleCloseSetVisibility = useCallback(() => {
    setListSelected([]);
    setIsSelectedAll(false);
    setIsOpenVisibility(false);
  }, []);

  const handleFocusInput = useCallback(() => {
    setFocusInput(true);
  }, []);

  const handleClear = useCallback(() => {
    setKeySearch('');
  }, []);

  const handleSubmitSearch = useCallback(
    (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      setKeySearch(e.nativeEvent.text);
    },
    []
  );

  const handleChangeTab = useCallback(
    async (index: number) => {
      setKeySearch(null);
      setIsOpenSearch(false);
      setIsOpenVisibility(false);
      setListSelected([]);
      setFocusInput(false);
      navigation.setParams({
        index: null,
      });
      setTabIndex(index);
    },
    [navigation]
  );

  const handleSelectAll = useCallback(
    (listItem: InfoNFT[], _tabIndex: number) => {
      if (_tabIndex === tabIndex) {
        const newListSelect = listItem?.map((item) => ({
          id: item.id,
          tokenAddress: item.tokenAddress,
          tokenId: item.tokenId,
          isVisible: item.isVisible || false,
        }));
        setListSelected(newListSelect);
      }
    },
    [tabIndex]
  );

  const markAllItemIsSelected = useCallback(() => {
    setIsSelectedAll(true);
  }, []);

  useEffect(() => {
    getProxyAddress();
  }, [getProxyAddress]);

  useEffect(() => {
    if (!isKeyboardVisible) {
      Keyboard.dismiss();
    }
  }, [isKeyboardVisible]);

  useEffect(() => {
    if (newTab?.index === 2) {
      tabRef?.current?.jumpToTab('gallery');
    }
  }, [newTab]);

  const handleCheckEmpty = useCallback(
    (isEmpty: boolean, _tabIndex: number) => {
      setIsEmpty((prev) => {
        const newState = [...prev];
        newState[_tabIndex] = isEmpty;
        return newState;
      });
    },
    []
  );

  const renderSearchComponent = useCallback(() => {
    if (isOpenSearch) {
      return (
        <SearchContainer pointerEvents="box-none">
          <InputSearch
            ref={inputRef}
            placeholder="Search NFT"
            prefix={<IcSearch width={20} height={20} />}
            showCancel
            handleCancel={handleCloseSearch}
            onPressIn={handleFocusInput}
            onSubmitEditing={handleSubmitSearch}
            handleClear={handleClear}
            maxLength={MAX_LENGTH_SEARCH}
            isIconSmall
            inputStyle={{
              paddingTop: 4,
              paddingLeft: 4,
              paddingRight: 8,
              paddingBottom: 4,
              fontSize: 12,
            }}
          />
        </SearchContainer>
      );
    }
    if (isOpenVisibility) {
      return (
        <SearchContainer>
          <ButtonSetVisible onPress={markAllItemIsSelected}>
            <TextVisible fontWeight="600">Select All</TextVisible>
          </ButtonSetVisible>
          <ButtonSetVisible onPress={handleCloseSetVisibility}>
            <TextVisible fontWeight="600">Cancel</TextVisible>
          </ButtonSetVisible>
        </SearchContainer>
      );
    }

    if (tabIndex === 3) {
      return (
        <SearchContainer>
          <ButtonSetVisible onPress={handleOpenSetVisibility}>
            <TextVisible fontWeight="600">Set Visibility</TextVisible>
          </ButtonSetVisible>
        </SearchContainer>
      );
    }

    return (
      <SearchContainer>
        <ButtonSearch onPress={handleOpenSearch}>
          <IcSearch />
        </ButtonSearch>
        {tabIndex !== 1 && (
          <ButtonSetVisible onPress={handleOpenSetVisibility}>
            <TextVisible fontWeight="600">Set Visibility</TextVisible>
          </ButtonSetVisible>
        )}
      </SearchContainer>
    );
  }, [
    handleClear,
    handleCloseSearch,
    handleCloseSetVisibility,
    handleFocusInput,
    handleOpenSearch,
    handleOpenSetVisibility,
    handleSubmitSearch,
    isOpenSearch,
    isOpenVisibility,
    markAllItemIsSelected,
    tabIndex,
  ]);

  const renderHeader = useCallback(() => {
    return (
      <HeaderContainer pointerEvents="box-none">
        <HeaderProfile
          buttonName="Edit Profile"
          buttonColor="white"
          isMyProfile
          profile={profile}
        />
        {tabIndex !== 3 && !isEmpty[tabIndex] ? renderSearchComponent() : null}
      </HeaderContainer>
    );
  }, [isEmpty, profile, renderSearchComponent, tabIndex]);
  if (!userInfo?.address || !proxyAddress) {
    return (
      <ContentLoader
        speed={1}
        height="100%"
        backgroundColor="#f3f3f3"
        foregroundColor="#ffffff"
      >
        <Rect width="100%" height="100" />
        <Rect y="180" width="100%" height="160" />
        <Rect y="400" rx="6" ry="6" width="100%" height="400" />
        <Circle cx="200" cy="100" r="50" />
      </ContentLoader>
    );
  }
  return (
    <Tabs.Container
      ref={tabRef}
      {...props}
      renderHeader={renderHeader}
      renderTabBar={CustomTabBar}
      onIndexChange={handleChangeTab}
      allowHeaderOverscroll
      headerHeight={340}
      headerContainerStyle={{
        elevation: 0,
        borderBottomWidth: 1,
        borderBottomColor: Colors.strokeLevel3,
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 0,
      }}
      lazy={false}
    >
      <Tabs.Tab name="forRent" label={customLabel('FOR RENT', <IcForRent />)}>
        <ForRentTab
          focusInput={focusInput}
          keySearch={keySearch}
          listSelected={listSelected}
          setListSelected={setListSelected}
          isOpenVisibility={isOpenVisibility}
          isSelectedAll={isSelectedAll}
          handleSelectAll={handleSelectAll}
          handleCloseSetVisibility={handleCloseSetVisibility}
          setIsSelectedAll={setIsSelectedAll}
          isMyNFT
          rentalAddress={userInfo.address}
          onDataChange={handleCheckEmpty}
        />
      </Tabs.Tab>
      <Tabs.Tab name="rentals" label={customLabel('RENTALS', <IcRentals />)}>
        <RentalsTab
          keySearch={keySearch}
          focusInput={focusInput}
          proxyAddress={proxyAddress}
          onDataChange={handleCheckEmpty}
        />
      </Tabs.Tab>
      <Tabs.Tab name="gallery" label={customLabel('GALLERY', <IcGallery />)}>
        <GalleryTab
          keySearch={keySearch}
          isOpenVisibility={isOpenVisibility}
          setListSelected={setListSelected}
          listSelected={listSelected}
          isSelectedAll={isSelectedAll}
          handleSelectAll={handleSelectAll}
          handleCloseSetVisibility={handleCloseSetVisibility}
          setIsSelectedAll={setIsSelectedAll}
          userInfo={profile}
          onDataChange={handleCheckEmpty}
        />
      </Tabs.Tab>
      <Tabs.Tab name="orders" label={customLabel('ORDERS', <IcOrder />)}>
        <OrderTab isMyNFT address={userInfo.address} />
      </Tabs.Tab>
    </Tabs.Container>
  );
});

export default memo(MyProfile);

export const FooterContainer = styled(View)`
  width: 100%;
  align-self: center;
  margin: 8px 0;
  height: ${ElementHeightFromSize.medium}px;
  flex-direction: row;
  padding: 0 16px;
`;
