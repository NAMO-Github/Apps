import { NFT_STATUS } from '@constants/rent';
import NftFilter, { ParamsFilter } from '@containers/common/NftFilter';
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
  handleSelectAll?: (list: InfoNFT[], tabIndex: number) => void;
  isOpenVisibility?: boolean;
  handleCloseSetVisibility?: () => void;
  setIsSelectedAll?: (value: boolean) => void;
  rentalAddress?: string;
  onDataChange?: (isEmpty: boolean, tabIndex: number) => void;
  isPublic?: boolean;
}

const valueStatus = [
  { label: 'For rent', value: NFT_STATUS.FORRENT },
  { label: 'Rented', value: NFT_STATUS.RENTED },
];

const ForRentTab: FC<Props> = ({
  keySearch,
  isMyNFT,
  focusInput,
  listSelected,
  setListSelected,
  isOpenVisibility,
  isSelectedAll,
  handleSelectAll,
  handleCloseSetVisibility,
  setIsSelectedAll,
  rentalAddress,
  onDataChange,
  isPublic,
}) => {
  const focusedTab = useFocusedTab();
  const [filterParams, setFilterParams] = useState<ParamGetNft>(undefined);

  const forRentFilter = useMemo(
    () => ({
      page: 1,
      limit: PAGE_LIMIT,
      rentalAddress,
      updatedAt: 'DESC',
      status: 'FORRENT,RENTED',
      isVisible: isPublic ? true : undefined,
      price: undefined,
    }),
    [rentalAddress, isPublic]
  );

  const {
    isLoading,
    isLoadingMore,
    listNFT,
    countNFT,
    refreshData,
    loadMore,
    isEmpty,
    setCallTime,
  } = useFilterNft(filterParams);

  useEffect(() => {
    if (!isUndefined(keySearch)) {
      if (keySearch === null) {
        setCallTime(0);
      }
      setFilterParams((prev) => ({ ...prev, search: keySearch || '' }));
    }
  }, [keySearch, setCallTime]);

  useEffect(() => {
    setFilterParams(forRentFilter);
  }, [forRentFilter]);

  useEffect(() => {
    if (isSelectedAll) {
      handleSelectAll(listNFT, 0);
    }
  }, [handleSelectAll, isSelectedAll, listNFT]);

  useEffect(() => {
    onDataChange?.(isEmpty, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmpty]);

  useEffect(() => {
    if (focusedTab === 'forRent') {
      refreshData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedTab]);

  const handleUpdateVisible = useCallback(
    async (data: NftVisible[]) => {
      await nftApi.updateVisible(data);
      setListSelected([]);
      handleCloseSetVisibility?.();
      refreshData();
    },
    [setListSelected, handleCloseSetVisibility, refreshData]
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
        subTitle={isMyNFT ? 'You have no NFTs set for rent' : ''}
        isLoading={isLoading}
      />

      {isOpenVisibility && !!listSelected?.length && renderGroupActions}

      <NftFilter
        hidden={isOpenVisibility || isEmpty}
        showVisibility={!isPublic}
        valueStatus={valueStatus}
        onSubmit={(params) => {
          const newParams: ParamsFilter = {
            ...params,
            isVisible: isPublic ? true : params.isVisible,
          };
          setFilterParams((prev) => ({
            ...prev,
            ...newParams,
            updatedAt: params.updatedAt || 'DESC',
            status: params.status || forRentFilter.status,
          }));
        }}
        onReset={() =>
          setFilterParams((prev) => ({ ...prev, ...forRentFilter }))
        }
      />
    </>
  );
};

export default memo(ForRentTab);
