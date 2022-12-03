import NftFilter from '@containers/common/NftFilter';
import { useAuth } from '@context/auth';
import {
  InfoNFT,
  nftApi,
  NftVisible,
  PAGE_LIMIT,
  ParamGetNft,
} from '@namo-workspace/services';
import Button from '@namo-workspace/ui/Button';
import { isUndefined } from 'lodash';
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useFocusedTab } from 'react-native-collapsible-tab-view';
import useFilterNft from '../../../hooks/useFilterNft';
import { useRefresh } from '../../../hooks/useRefresh';
import { FooterContainer, stylesButtonGroup } from '../CommonProfile';
import NFTFlatList from './NFTFlatList';

interface Props {
  isMyNFT?: boolean;
  focusInput?: boolean;
  isMyForRent?: boolean;
  keySearch?: string;
  listSelected?: NftVisible[];
  setListSelected?: (item: NftVisible[]) => void;
  isSelectedAll?: boolean;
  handleSelectAll?: (list: InfoNFT[]) => void;
  isOpenVisibility?: boolean;
  handleSearch?: (params?: ParamGetNft) => void;
  handleCloseSetVisibility?: () => void;
  setIsSelectedAll?: (value: boolean) => void;
  loadingMore?: boolean;
  handleLoadMore?: () => void;
  refreshData?: () => void;
  ownerOf?: string;
  rentalAddress?: string;
  proxyAddress?: string;
  onDataChange?: (isEmpty: boolean, tabIndex: number) => void;
  isPublic?: boolean;
}

const RentalsTab: FC<Props> = ({
  keySearch,
  isMyNFT,
  focusInput,
  listSelected,
  setListSelected,
  isOpenVisibility,
  isSelectedAll,
  handleSelectAll,
  handleSearch,
  handleCloseSetVisibility,
  setIsSelectedAll,
  proxyAddress,
  rentalAddress,
  onDataChange,
  isPublic,
}) => {
  const { isLoggedIn } = useAuth();
  const focusedTab = useFocusedTab();
  const [filterParams, setFilterParams] = useState<ParamGetNft>(undefined);

  const {
    isLoading,
    isLoadingMore,
    listNFT,
    countNFT,
    refreshData,
    loadMore,
    isEmpty,
    setCallTime,
  } = useFilterNft(filterParams, !isLoggedIn);

  const rentalFilter = useMemo(
    () => ({
      page: 1,
      limit: PAGE_LIMIT,
      updatedAt: 'DESC',
      status: 'RENTED',
      ownerOf: proxyAddress,
      rentalAddress: rentalAddress || undefined,
    }),
    [proxyAddress, rentalAddress]
  );

  useEffect(() => {
    setFilterParams(rentalFilter);
  }, [rentalFilter]);

  useEffect(() => {
    if (isSelectedAll) {
      handleSelectAll(listNFT);
    }
  }, [handleSelectAll, isSelectedAll, listNFT]);

  useEffect(() => {
    if (!isUndefined(keySearch)) {
      if (keySearch === null) {
        setCallTime(0);
      }
      setFilterParams((prev) => ({ ...prev, search: keySearch || '' }));
    }
  }, [keySearch, setCallTime]);

  useEffect(() => {
    onDataChange?.(isEmpty, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmpty]);

  useEffect(() => {
    if (focusedTab === 'rentals') {
      refreshData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedTab]);

  const handleUpdateVisible = useCallback(
    async (data: NftVisible[]) => {
      await nftApi.updateVisible(data);
      setListSelected([]);
      handleCloseSetVisibility?.();
      handleSearch?.();
    },
    [setListSelected, handleCloseSetVisibility, handleSearch]
  );
  const [isRefreshing, startRefreshing] = useRefresh(refreshData);

  const handleHideSelected = useCallback(() => {
    const newParams = listSelected.map((item) => ({
      ...item,
      isVisible: false,
    }));

    handleUpdateVisible(newParams);
  }, [handleUpdateVisible, listSelected]);

  const handleShowSelected = useCallback(() => {
    const newParams = listSelected.map((item) => ({
      ...item,
      isVisible: true,
    }));

    handleUpdateVisible(newParams);
  }, [handleUpdateVisible, listSelected]);

  const renderGroupActions = useMemo(() => {
    return (
      <FooterContainer style={stylesButtonGroup.btn_group}>
        <Button
          size="medium"
          style={stylesButtonGroup.btn_select}
          color="white"
          onPress={handleHideSelected}
        >
          Hide Selected
        </Button>
        <Button
          size="medium"
          style={stylesButtonGroup.btn_select}
          onPress={handleShowSelected}
        >
          Show Selected
        </Button>
      </FooterContainer>
    );
  }, [handleHideSelected, handleShowSelected]);

  return (
    <>
      <NFTFlatList
        isMyNFT={isMyNFT}
        focusInput={focusInput}
        isEmptyData={!countNFT}
        data={listNFT}
        isRefreshing={isRefreshing}
        canSelect
        startRefreshing={startRefreshing}
        listSelected={listSelected}
        setListSelected={setListSelected}
        isOpenVisibility={isOpenVisibility}
        style={{
          marginTop: countNFT ? 62 : 32,
          paddingBottom: countNFT ? 62 : 32,
        }}
        isSelectedAll={isSelectedAll}
        setIsSelectedAll={setIsSelectedAll}
        loadingMore={isLoadingMore}
        handleLoadMore={loadMore}
        subTitle={'You are not renting any NFTs'}
        isLoading={isLoading}
      />

      {isOpenVisibility && !!listSelected?.length && renderGroupActions}

      <NftFilter
        hidden={isOpenVisibility || isEmpty}
        showVisibility
        onSubmit={(params) => {
          setFilterParams((prev) => ({
            ...prev,
            ...params,
            updatedAt: params.updatedAt || 'DESC',
          }));
        }}
        onReset={() =>
          setFilterParams((prev) => ({ ...prev, ...rentalFilter }))
        }
        sortOnly
      />
    </>
  );
};

export default memo(RentalsTab);
