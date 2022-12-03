import NftFilter, { ParamsFilter } from '@containers/common/NftFilter';
import NftSkeleton from '@containers/common/NftSkeleton';
import NoData from '@containers/common/NoData';
import { PAGE_LIMIT, ParamGetNft } from '@namo-workspace/services';
import { Colors } from '@namo-workspace/themes';
import { Body4 } from '@namo-workspace/ui/Typography';
import {
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SearchStackParams } from '@routes/routes.model';
import { isUndefined } from 'lodash';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Platform } from 'react-native';
import styled from 'styled-components/native';
import NFTList from '../../containers/search/NFTList';
import useFilterNftWithoutFocusEffect from '../../hooks/useFilterNftWithoutFocusEffect';
import useParentFocusEffect from '../../hooks/useParentFocusEffect';
import { useRefresh } from '../../hooks/useRefresh';
import ButtonSearch from './ButtonSearch';

const valueStatus = [
  { label: 'For rent', value: 'FORRENT' },
  { label: 'Rented', value: 'RENTED' },
  { label: 'Unavailable', value: 'UNAVAILABLE' },
];

const initialPages = {
  page: 1,
  limit: PAGE_LIMIT,
  status: 'FORRENT,RENTED,UNAVAILABLE',
  isVisible: true,
  updatedAt: 'DESC',
  price: undefined,
};

type SearchScreenProps = NativeStackNavigationProp<SearchStackParams, 'SEARCH'>;
const SearchScreen: FC = () => {
  const nftListRef = useRef<FlatList>(null);

  const [filterParams, setFilterParams] = useState<ParamGetNft>(initialPages);
  const {
    isLoading,
    isLoadingMore,
    listNFT,
    countNFT,
    refreshData,
    loadMore,
    isEmpty,
  } = useFilterNftWithoutFocusEffect(filterParams);

  const [isRefreshing, startRefreshing] = useRefresh(refreshData);

  const [textSearch, setTextSearch] = useState<string>('');
  const navigation = useNavigation<SearchScreenProps>();
  const { params } = useRoute<RouteProp<ParamListBase>>();
  const keySearch = params?.['keySearch'];
  const [completeScrollBarHeight, setCompleteScrollBarHeight] = useState(1);
  const [visibleScrollBarHeight, setVisibleScrollBarHeight] = useState(0);
  const scrollIndicator = useRef(new Animated.Value(0)).current;

  const scrollIndicatorSize =
    completeScrollBarHeight > visibleScrollBarHeight
      ? (visibleScrollBarHeight * visibleScrollBarHeight) /
        completeScrollBarHeight
      : visibleScrollBarHeight;

  const difference =
    visibleScrollBarHeight > scrollIndicatorSize
      ? visibleScrollBarHeight - scrollIndicatorSize
      : 1;

  const scrollIndicatorPosition = Animated.multiply(
    scrollIndicator,
    visibleScrollBarHeight / completeScrollBarHeight
  ).interpolate({
    extrapolate: 'clamp',
    inputRange: [0, difference],
    outputRange: [0, difference],
  });

  const onContentSizeChange = (_, contentHeight) =>
    setCompleteScrollBarHeight(contentHeight);

  const onLayout = ({
    nativeEvent: {
      layout: { height },
    },
  }) => {
    setVisibleScrollBarHeight(height);
  };

  const handleClear = useCallback(() => {
    setTextSearch('');
    navigation.setParams({
      keySearch: '',
    });
  }, [navigation]);

  useEffect(() => {
    setTextSearch(keySearch);
    // setCallTime(0);
    if (!isUndefined(keySearch)) {
      setFilterParams((prev) => ({ ...prev, search: keySearch }));
    }
  }, [keySearch]);

  useParentFocusEffect(
    useCallback(() => {
      setFilterParams((prev) => ({ ...prev }));
    }, [])
  );

  const handleSubmit = useCallback((params: ParamsFilter) => {
    setFilterParams((prev) => ({
      ...prev,
      ...params,
      updatedAt: params.updatedAt || prev.updatedAt || 'DESC',
      status: params.status || initialPages.status,
      isVisible: true,
    }));
  }, []);

  const handleReset = useCallback(
    () => setFilterParams((prev) => ({ ...prev, ...initialPages })),
    []
  );

  return (
    <SearchContainer>
      <InputSearchContainer>
        <ButtonSearch
          placeholder="Search"
          value={textSearch}
          onPress={() =>
            navigation.navigate('NFT_SEARCH', { keySearch: textSearch })
          }
          handleClearValue={handleClear}
        />
      </InputSearchContainer>
      {isLoading ? (
        <NftSkeleton />
      ) : (
        <>
          {countNFT ? (
            <TotalItemContainer>
              <TotalContent fontWeight="700">{countNFT} items</TotalContent>
            </TotalItemContainer>
          ) : null}
          <ListContainer>
            {countNFT ? (
              <ListContainer style={{ flexDirection: 'row' }}>
                <NFTList
                  ref={nftListRef}
                  data={listNFT}
                  countNFT={countNFT}
                  onScroll={Animated.event(
                    [
                      {
                        nativeEvent: { contentOffset: { y: scrollIndicator } },
                      },
                    ],
                    { useNativeDriver: false }
                  )}
                  handleLoadMore={loadMore}
                  loadingMore={isLoadingMore}
                  refreshing={isRefreshing}
                  onRefresh={startRefreshing}
                  showsVerticalScrollIndicator={false}
                  onContentSizeChange={onContentSizeChange}
                  onLayout={onLayout}
                />
                <CustomScrollBar
                  style={{
                    borderRadius: Platform.OS === 'ios' ? 2 : 0,
                    right: Platform.OS === 'ios' ? 3 : 0,
                    position: 'absolute',
                  }}
                >
                  <Animated.View
                    style={{
                      borderRadius: Platform.OS === 'ios' ? 2 : 0,
                      backgroundColor: '#b3a9a9',
                      width: 3,
                      height: scrollIndicatorSize,
                      transform: [{ translateY: scrollIndicatorPosition }],
                    }}
                  />
                </CustomScrollBar>
              </ListContainer>
            ) : (
              <NoData
                title="No results found"
                subTitle="Sorry, we did not find any NFTs"
              />
            )}
          </ListContainer>
        </>
      )}
      <NftFilter
        hidden={isEmpty}
        // showVisibility={false}
        valueStatus={valueStatus}
        onSubmit={handleSubmit}
        onReset={handleReset}
      />
    </SearchContainer>
  );
};
export default SearchScreen;

const SearchContainer = styled.View`
  flex: 1;
`;
const InputSearchContainer = styled.View`
  align-items: center;
  padding: 16px 16px 0 16px;
`;
const ListContainer = styled.View`
  flex: 1;
  padding: 0;
`;
const TotalItemContainer = styled.View`
  padding: 0px 16px 8px 16px;
`;
const TotalContent = styled(Body4)`
  color: ${Colors.textLevel1};
`;

const CustomScrollBar = styled.View`
  height: 100%;
  width: 3px;
`;
