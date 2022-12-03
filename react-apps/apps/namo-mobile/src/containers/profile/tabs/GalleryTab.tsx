import NftFilter from '@containers/common/NftFilter';
import { useAuth } from '@context/auth';
import {
  InfoNFT,
  nftApi,
  NftVisible,
  ParamGetNft,
  useGetGalleryNFT,
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

import { useRefresh } from '../../../hooks/useRefresh';
import { FooterContainer, stylesButtonGroup } from '../CommonProfile';
import NFTFlatList from './NFTFlatList';

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
interface Props {
  listSelected?: NftVisible[];
  setListSelected?: (item: NftVisible[]) => void;
  isOpenVisibility?: boolean;
  isSelectedAll?: boolean;
  handleSelectAll?: (list: InfoNFT[], tabIndex: number) => void;
  handleCloseSetVisibility?: () => void;
  setIsSelectedAll?: (value: boolean) => void;
  userInfo?: Profile;
  onDataChange?: (isEmpty: boolean, tabIndex: number) => void;
  keySearch?: string;
}

const GalleryTab: FC<Props> = ({
  listSelected,
  setListSelected,
  isOpenVisibility,
  isSelectedAll,
  handleSelectAll,
  setIsSelectedAll,
  handleCloseSetVisibility,
  userInfo,
  onDataChange,
  keySearch,
}) => {
  const focusedTab = useFocusedTab();

  const { address } = useAuth();

  const [filterParams, setFilterParams] = useState<ParamGetNft>(undefined);

  const galleryFilter = useMemo(
    () => ({
      isVisible: undefined,
      updatedAt: 'DESC',
    }),
    []
  );

  const {
    fetchListNFT,
    listNFT,
    countNFT,
    isLoading,
    isLoadingMore,
    loadMore,
    isEmpty,
    setCallTime,
    refreshData,
  } = useGetGalleryNFT({
    address,
    filterParams: filterParams,
  });

  useEffect(() => {
    if (!isUndefined(keySearch)) {
      if (keySearch === null) {
        setCallTime(0);
      }
      setFilterParams((prev) => ({ ...prev, search: keySearch || '' }));
    }
  }, [keySearch, setCallTime]);

  useEffect(() => {
    setFilterParams({ ...galleryFilter });
  }, [galleryFilter]);

  const [isRefreshing, startRefreshing] = useRefresh(refreshData);

  useEffect(() => {
    if (isSelectedAll) {
      handleSelectAll(listNFT, 2);
    }
  }, [handleSelectAll, isSelectedAll, listNFT]);

  useEffect(() => {
    onDataChange?.(isEmpty, 2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmpty]);

  useEffect(() => {
    if (focusedTab === 'gallery') {
      refreshData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedTab]);

  const handleUpdateVisible = useCallback(
    async (data: NftVisible[]) => {
      await nftApi.updateVisible(data);
      setListSelected([]);
      handleCloseSetVisibility?.();
      await fetchListNFT();
    },
    [setListSelected, handleCloseSetVisibility, fetchListNFT]
  );

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
        userInfo={userInfo}
        isEmptyData={!countNFT}
        data={listNFT}
        isRefreshing={isRefreshing}
        startRefreshing={startRefreshing}
        nestedScrollEnabled
        style={{
          marginTop: countNFT ? 62 : 32,
          paddingBottom: countNFT ? 62 : 32,
        }}
        canSelect
        listSelected={listSelected}
        setListSelected={setListSelected}
        isOpenVisibility={isOpenVisibility}
        handleLoadMore={loadMore}
        isSelectedAll={isSelectedAll}
        setIsSelectedAll={setIsSelectedAll}
        isMyNFT
        isMyGallery
        isLoading={isLoading}
        loadingMore={isLoadingMore}
        subTitle={'There are no NFTs in your wallet'}
      />
      {isOpenVisibility && !!listSelected?.length && renderGroupActions}

      <NftFilter
        myGallery
        hidden={isOpenVisibility || isEmpty}
        showVisibility
        onSubmit={(params) => {
          setFilterParams((prev) => ({
            ...prev,
            ...params,
            updatedAt: params.updatedAt || 'DESC',
            isVisible: params.isVisible,
          }));
        }}
        onReset={() =>
          setFilterParams((prev) => ({ ...prev, ...galleryFilter }))
        }
      />
    </>
  );
};

export default memo(GalleryTab);
