import { ListFooterComponent } from '@containers/common/FooterLoading';
import NftSkeleton from '@containers/common/NftSkeleton';
import NoData from '@containers/common/NoData';
import OrderListSkeleton from '@containers/common/OrderListSkeleton';
import NFTOrder from '@containers/search/NFTOrder';
import { InfoNFT, NftVisible, Order } from '@namo-workspace/services';
import { useScrollToTop } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParams } from '@routes/routes.model';
import React, { memo, useCallback, useEffect, useRef } from 'react';
import {
  Dimensions,
  ListRenderItemInfo,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import * as Tabs from 'react-native-collapsible-tab-view';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import NFTCardWithMetaDataParser from '@containers/search/NFTCardWithMetadataParser';

const { height: windowHeight } = Dimensions.get('window');
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
interface Props<T extends boolean, D = T extends true ? Order : InfoNFT> {
  isLoading?: boolean;
  data: D[];
  focusInput?: boolean;
  isEmptyData?: boolean;
  isRefreshing?: boolean;
  isOpenVisibility?: boolean;
  startRefreshing?: () => void;
  nestedScrollEnabled?: boolean;
  style?: StyleProp<ViewStyle>;
  canSelect?: boolean;
  isSelectedAll?: boolean;
  listSelected?: NftVisible[];
  isMyNFT?: boolean;
  isMyGallery?: boolean;
  loadingMore?: boolean;
  setListSelected?: (item: NftVisible[]) => void;
  handleLoadMore?: () => void;
  setIsSelectedAll?: (value: boolean) => void;
  singleItem?: T;
  userInfo?: Profile;
  subTitle?: string;
  ListHeaderComponent?:
    | React.ComponentType
    | React.ReactElement
    | null
    | undefined;
}

export type OrderDetailsProps = NativeStackNavigationProp<
  ProfileStackParams,
  'PROFILE'
>;

const ListEmptyComponent = ({ subTitle }) => {
  const { top, height } = Tabs.useHeaderMeasurements();
  const translateY = useDerivedValue(() => {
    return interpolate(
      -top.value,
      [0, height.value || 0],
      [-(height.value || 0) / 2, 0]
    );
  }, [height]);

  const styleTransform = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.noDataContainer, styleTransform]}>
      <NoData subTitle={subTitle} />
    </Animated.View>
  );
};

const LoadingComponent = (singleItem: boolean) => {
  const { height } = Tabs.useHeaderMeasurements();
  const top = Tabs.useCurrentTabScrollY();
  const translateY = useDerivedValue(() => {
    if (!height.value) {
      return 0;
    }
    return interpolate(
      -top.value,
      [0, height.value, height.value + 1],
      [0, 0, 1],
      {
        extrapolateLeft: Extrapolation.CLAMP,
        extrapolateRight: Extrapolation.EXTEND,
      }
    );
  }, [height]);

  const styleTransform = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    };
  });
  if (singleItem)
    return (
      <Animated.View style={[styles.noDataContainer, styleTransform]}>
        <OrderListSkeleton />
      </Animated.View>
    );
  return (
    <Animated.View style={[styles.noDataContainer, styleTransform]}>
      <NftSkeleton height={windowHeight} />
    </Animated.View>
  );
};
function NFTFlatList<T extends boolean, D = T extends true ? Order : InfoNFT>({
  isLoading,
  data,
  isMyNFT,
  isEmptyData,
  isRefreshing,
  startRefreshing,
  nestedScrollEnabled,
  style,
  focusInput,
  canSelect,
  listSelected,
  setListSelected,
  isMyGallery,
  isOpenVisibility,
  loadingMore,
  handleLoadMore,
  isSelectedAll,
  setIsSelectedAll,
  singleItem,
  userInfo,
  subTitle,
  ListHeaderComponent,
}: Props<T, D>) {
  const flatListRef = useRef(null);
  useScrollToTop(flatListRef);

  const scrollToTop = useCallback(() => {
    flatListRef.current.scrollToOffset({ animated: true, offset: 360 });
  }, [flatListRef]);

  const checkIsSelected = useCallback(
    (item: InfoNFT) => {
      const index = listSelected?.findIndex(
        (i) =>
          `${i.tokenAddress}${i.tokenId}` ===
          `${item.tokenAddress}${item.tokenId}`
      );
      return index >= 0;
    },
    [listSelected]
  );

  const handleSelected = useCallback(
    (item: InfoNFT) => {
      const isIncluded = checkIsSelected(item);
      if (listSelected && !isIncluded) {
        const selectInfo = {
          id: item?.id,
          tokenAddress: item?.tokenAddress,
          tokenId: item?.tokenId,
          ownerOf: item?.ownerOf,
          isVisible: item?.isVisible || false,
        };
        setListSelected([...listSelected, selectInfo]);
      } else if (listSelected && isIncluded) {
        if (isSelectedAll) {
          setIsSelectedAll(false);
        }
        const newlistSelected = listSelected.filter(
          (selected) =>
            `${selected.tokenAddress}${selected.tokenId}` !==
            `${item.tokenAddress}${item.tokenId}`
        );
        setListSelected(newlistSelected);
      }
    },
    [
      checkIsSelected,
      isSelectedAll,
      listSelected,
      setIsSelectedAll,
      setListSelected,
    ]
  );

  const renderOrderItem = useCallback(({ item }: ListRenderItemInfo<Order>) => {
    return <NFTOrder item={item} />;
  }, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<InfoNFT>) => {
      return (
        <NFTCardWithMetaDataParser
          detailNft={item}
          lenderName={
            isMyGallery ? userInfo?.name : item?.ownerName ?? 'Unnamed'
          }
          avatarUrl={isMyGallery ? userInfo?.avatar : item?.avatarOfOwner}
          isMyNFT={isMyNFT}
          isMyGallery={isMyGallery}
          showVisible
          isSelected={checkIsSelected(item)}
          handleSelected={() => handleSelected(item)}
          visibleStatus={item?.isVisible}
          canSelect={canSelect}
          id={item?.id || ''}
          tokenId={item.tokenId || ''}
          tokenAddress={item.tokenAddress || ''}
          isOpenVisibility={isOpenVisibility}
        />
      );
    },
    [
      canSelect,
      checkIsSelected,
      handleSelected,
      isMyGallery,
      isMyNFT,
      isOpenVisibility,
      userInfo,
    ]
  );

  useEffect(() => {
    if (focusInput) {
      scrollToTop();
    }
  }, [focusInput, scrollToTop]);

  const contentContainerStyleProp = {
    marginTop: 8,
    paddingHorizontal: 8,
  };

  const onEndReachedHandler = useCallback(() => {
    handleLoadMore && handleLoadMore();
  }, [handleLoadMore]);

  const renderListEmpty = useCallback(() => {
    return <ListEmptyComponent subTitle={subTitle} />;
  }, [subTitle]);

  return (
    <Tabs.FlatList<D>
      ref={flatListRef}
      data={isLoading ? [] : data}
      keyExtractor={(_, i) => String(i)}
      // @ts-ignore
      renderItem={singleItem ? renderOrderItem : renderItem}
      contentContainerStyle={[contentContainerStyleProp, style]}
      ListEmptyComponent={isEmptyData && !isLoading ? renderListEmpty() : null}
      onRefresh={startRefreshing}
      refreshing={isRefreshing}
      numColumns={singleItem ? 1 : 2}
      showsHorizontalScrollIndicator={false}
      onEndReachedThreshold={0.05}
      onEndReached={!isOpenVisibility && onEndReachedHandler}
      ListFooterComponent={() => (loadingMore ? <ListFooterComponent /> : null)}
      ListHeaderComponent={
        isLoading ? () => LoadingComponent(singleItem) : null
      }
      // stickyHeaderIndices={[0]}
    />
  );
}

export default memo(NFTFlatList);

const styles = StyleSheet.create({
  noDataContainer: {
    flex: 1,
  },
});
