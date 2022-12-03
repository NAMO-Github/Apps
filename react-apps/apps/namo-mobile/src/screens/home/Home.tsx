import NftFilter from '@containers/common/NftFilter';
import NftSkeleton from '@containers/common/NftSkeleton';
import NoData from '@containers/common/NoData';
import { PAGE_LIMIT, ParamGetNft } from '@namo-workspace/services';
import { Colors } from '@namo-workspace/themes';
import { Body4 } from '@namo-workspace/ui/Typography';
import React, { FC, useRef, useState } from 'react';
import { Animated, FlatList } from 'react-native';

import styled from 'styled-components/native';
import NFTList from '../../containers/search/NFTList';
import useFilterNft from '../../hooks/useFilterNft';
import { useRefresh } from '../../hooks/useRefresh';

const valueStatus = [
  { label: 'For rent', value: 'FORRENT' },
  { label: 'Rented', value: 'RENTED' },
  { label: 'Unavailable', value: 'UNAVAILABLE' },
];
const initialPages = {
  page: 1,
  limit: PAGE_LIMIT,
  status: 'FORRENT,RENTED,UNAVAILABLE',
  search: '',
  isVisible: true,
  updatedAt: 'DESC',
  price: undefined,
};
const HomeScreen: FC = () => {
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
  } = useFilterNft(filterParams);

  const [isRefreshing, startRefreshing] = useRefresh(refreshData);
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
  return (
    <SearchContainer>
      {isLoading ? (
        <NftSkeleton />
      ) : (
        <>
          {!!countNFT && (
            <TotalItemContainer>
              <TotalContent fontWeight="700">{countNFT} items</TotalContent>
            </TotalItemContainer>
          )}
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
                <CustomScrollBar>
                  <Animated.View
                    style={{
                      backgroundColor: '#b3a9a9',
                      width: 4,
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
        showVisibility={false}
        valueStatus={valueStatus}
        onSubmit={(params) => {
          setFilterParams((prev) => ({
            ...prev,
            ...params,
            updatedAt: params.updatedAt || prev.updatedAt || 'DESC',
            isVisible: true,
          }));
        }}
        onReset={() => setFilterParams({ ...initialPages })}
      />
    </SearchContainer>
  );
};
export default HomeScreen;

const SearchContainer = styled.View`
  flex: 1;
`;

const ListContainer = styled.View`
  flex: 1;
  padding: 0;
`;
const TotalItemContainer = styled.View`
  padding: 16px 16px 8px 16px;
`;
const TotalContent = styled(Body4)`
  color: ${Colors.textLevel1};
`;

const CustomScrollBar = styled.View`
  height: 100%;
  width: 4px;
`;
