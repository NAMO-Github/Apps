import { ParamsGetListOrder } from '@namo-workspace/services';
import React, { FC, memo, useEffect, useMemo } from 'react';
import { useFocusedTab } from 'react-native-collapsible-tab-view';
import useFilterOrder from '../../../hooks/useFilterOrder';
import { useRefresh } from '../../../hooks/useRefresh';
import NFTFlatList from './NFTFlatList';

interface Props {
  focusInput?: boolean;
  keySearch?: string;
  isMyNFT?: boolean;
  address: string;
}

const OrderTab: FC<Props> = ({ focusInput, isMyNFT, address }) => {
  const focusedTab = useFocusedTab();

  const orderFilter = useMemo(
    () =>
      ({
        page: 1,
        limit: 10,
        renterAddress: address,
        updatedAt: 'DESC',
      } as ParamsGetListOrder),
    [address]
  );

  const {
    isLoading,
    isLoadingMore,
    listOrderNFT,
    count,
    refreshData,
    loadMore,
  } = useFilterOrder(orderFilter);

  const [isRefreshing, startRefreshing] = useRefresh(refreshData);

  useEffect(() => {
    if (focusedTab === 'orders') {
      refreshData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedTab]);

  return (
    <NFTFlatList
      isMyNFT={isMyNFT}
      focusInput={focusInput}
      isEmptyData={!count}
      isRefreshing={isRefreshing}
      startRefreshing={startRefreshing}
      singleItem
      data={listOrderNFT}
      handleLoadMore={loadMore}
      subTitle={isMyNFT ? 'You have not ordered any NFTs' : ''}
      loadingMore={isLoadingMore}
      isLoading={isLoading}
      isOpenVisibility={false}
    />
  );
};

export default memo(OrderTab);
