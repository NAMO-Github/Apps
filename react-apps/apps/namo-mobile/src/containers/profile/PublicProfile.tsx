import { MAX_LENGTH_SEARCH } from '@constants/common';
import { useAuth } from '@context/auth';
import Images from '@images';
import { authApi, orderApi } from '@namo-workspace/services';
import { Colors } from '@namo-workspace/themes';
import InputSearch from '@namo-workspace/ui/InputSearch';
import {
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NFTDetailForRentProp } from '@screens/nft-detail-for-rent/NFTDetailForRent';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  NativeSyntheticEvent,
  Platform,
  TextInputSubmitEditingEventData,
} from 'react-native';
import {
  CollapsibleProps,
  CollapsibleRef,
  Tabs,
} from 'react-native-collapsible-tab-view';
import { useKeyboardVisible } from '../../hooks/useKeyboardVisible';
import {
  ButtonSearch,
  customLabel,
  CustomTabBar,
  HeaderContainer,
  SearchContainer,
} from './CommonProfile';
import HeaderProfile from './headers/HeaderProfile';
import { ForRentTab, RentalsTab } from './tabs';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';

const { IcForRent, IcRentals, IcSearch } = Images;

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

type Props = Partial<CollapsibleProps>;
const PublicProfile = React.forwardRef<CollapsibleRef, Props>((props, ref) => {
  const [focusInput, setFocusInput] = useState<boolean>(false);
  const [keySearch, setKeySearch] = useState<string>('');
  const isKeyboardVisible = useKeyboardVisible();
  const inputRef = useRef(null);
  const navigation = useNavigation<NFTDetailForRentProp>();

  const [isOpenSearch, setIsOpenSearch] = useState<boolean>(false);

  const [initialValue, setInitialValue] = useState<Profile>({
    bio: '',
    email: '',
    avatar: '',
    coverImage: '',
    follower: 0,
    following: 0,
    name: '',
    facebook: '',
    instagram: '',
    twitter: '',
    tiktok: '',
    userName: '',
  });

  const { params } = useRoute<RouteProp<ParamListBase>>();
  const rentalAddress = params?.['rentalAddress'];
  const { address } = useAuth();
  const [proxyAddress, setProxyAddress] = useState<string>(undefined);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [isEmpty, setIsEmpty] = useState([true, true]);

  const fetchPublicProfileInfo = useCallback(async (address: string) => {
    await authApi
      .getPublicUserInfo(address)
      .then((res) => {
        const splitLink = res?.socialMediaLink
          ? JSON.parse(res?.socialMediaLink)
          : '';
        setInitialValue({
          name: res?.name,
          userName: res?.userName,
          bio: res?.bio,
          email: res?.email,
          facebook: splitLink?.facebook || '',
          instagram: splitLink?.instagram || '',
          twitter: splitLink?.twitter || '',
          tiktok: splitLink?.tiktok || '',
          avatar: res?.avatar,
          coverImage: res?.coverImage,
          follower: res?.follower,
          following: res?.following,
        });
      })
      .catch((err) => {
        //err
      });
  }, []);

  useEffect(() => {
    if (rentalAddress) {
      fetchPublicProfileInfo(rentalAddress);
    }
  }, [fetchPublicProfileInfo, rentalAddress]);

  useEffect(() => {
    if (rentalAddress) {
      orderApi.getProxyWalletPublic(rentalAddress).then(({ data }) => {
        setProxyAddress(data.proxyAddress);
      });
    }
  }, [rentalAddress]);

  useEffect(() => {
    if (!isKeyboardVisible) {
      Keyboard.dismiss();
    }
  }, [isKeyboardVisible]);

  const handleFocusInput = useCallback(() => {
    setFocusInput(true);
  }, []);

  const handleClear = useCallback(() => {
    setKeySearch('');
  }, []);

  const handleChangeTab = useCallback(
    async (index: number) => {
      setKeySearch(null);
      setIsOpenSearch(false);
      setFocusInput(false);
      navigation.setParams({
        index: null,
      });
      setTabIndex(index);
    },
    [navigation]
  );

  const handleSubmitSearch = useCallback(
    (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      setKeySearch(e.nativeEvent.text);
    },
    []
  );

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
  const handleOpenSearch = useCallback(() => {
    setIsOpenSearch(true);
  }, []);
  const handleCloseSearch = useCallback(() => {
    setKeySearch(null);
    setIsOpenSearch(false);
  }, []);
  const renderSearchComponent = useCallback(() => {
    if (isOpenSearch) {
      return (
        <SearchContainer
          pointerEvents="box-none"
          style={Platform.select({
            ios: { bottom: -117 },
            android: { bottom: -105 },
          })}
        >
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

    return (
      <SearchContainer>
        <ButtonSearch onPress={handleOpenSearch}>
          <IcSearch />
        </ButtonSearch>
      </SearchContainer>
    );
  }, [
    handleClear,
    handleCloseSearch,
    handleFocusInput,
    handleOpenSearch,
    handleSubmitSearch,
    isOpenSearch,
  ]);

  const renderHeader = useCallback(() => {
    return (
      <HeaderContainer pointerEvents="box-none">
        <HeaderProfile
          buttonName="Follow"
          profile={initialValue}
          isPublic={true}
        />
        {!isEmpty[tabIndex] && renderSearchComponent()}
      </HeaderContainer>
    );
  }, [initialValue, isEmpty, renderSearchComponent, tabIndex]);

  if (!proxyAddress) {
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
      ref={ref}
      {...props}
      renderHeader={renderHeader}
      renderTabBar={CustomTabBar}
      onIndexChange={handleChangeTab}
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
      allowHeaderOverscroll
    >
      <Tabs.Tab name="forRent" label={customLabel('FOR RENT', <IcForRent />)}>
        <ForRentTab
          focusInput={focusInput}
          keySearch={keySearch}
          rentalAddress={rentalAddress}
          onDataChange={handleCheckEmpty}
          isPublic
        />
      </Tabs.Tab>
      <Tabs.Tab name="rentals" label={customLabel('RENTALS', <IcRentals />)}>
        <RentalsTab
          keySearch={keySearch}
          proxyAddress={proxyAddress}
          rentalAddress={address}
          onDataChange={handleCheckEmpty}
          isMyNFT={true}
          isPublic
        />
      </Tabs.Tab>
    </Tabs.Container>
  );
});

export default memo(PublicProfile);
