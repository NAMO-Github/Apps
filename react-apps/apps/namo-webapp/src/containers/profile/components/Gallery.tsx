import ListNFT from '@components/ListNFT';
import NoResult from '@components/NoResult';
import { FilterSearchContext, ParamsQuery } from '@context/filter-search';
import { useWalletAuth } from '@context/wallet-auth';
import useMediaQuery, { QUERY } from '@hooks/useMediaQuery';
import { InfoNFT, nftApi, NftVisible } from '@namo-workspace/services';
import Loading from '@namo-workspace/ui/Loading';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import SearchSetVisibility from './SearchSetVisibility';
import { BorderFilter, Container, WrapFilter } from './tab.styled';
import { ReactComponent as IconFilter } from '@assets/images/common/ic_filter.svg';
import { ReactComponent as IconFilterActive } from '@assets/images/common/ic_filter_active.svg';
import NavFilter from '@components/FilterNFT/NavFilter';
import FixedIconFilter from '@components/FixedIconFilter';
import { ParamsFilter } from '@components/Modal/ModalFilter';
import { listFilterSort, listVisibility, SORT } from '@constants/filterNft';
import { useSearchParams } from 'react-router-dom';
import { FILTER_PROFILE } from '@constants/common';

interface Option {
  address: string;
  cursor?: string;
  updatedAt?: string;
  isVisible?: boolean;
}

const Gallery = () => {
  const { account } = useWalletAuth();
  const { isFilterProfile, setIsFilterProfile, setIsSearchProfile } =
    useContext(FilterSearchContext);
  const [searchParams, setSearchParams] = useSearchParams({});

  const initialOption = useMemo(
    () => ({
      address: account || '',
      cursor: '' || undefined,
      updatedAt: SORT.DESC,
    }),
    [account]
  );

  const [option, setOption] = useState<Option | undefined>();
  const [listNFTGallery, setListNFTGallery] = useState<InfoNFT[] | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newCursor, setNewCursor] = useState<string | undefined>('');
  const [countNFT, setCountNFT] = useState<number>(0);

  const [isSetVisibility, setIsSetVisibility] = useState<boolean>(false);
  const [listSelected, setListSelected] = useState<NftVisible[]>([]);
  const isDesktop = useMediaQuery(QUERY.DESKTOP);
  const [callCount, setCallCount] = useState<number>(0);

  const [valueSearch, setValueSearch] = useState<string>('');
  const [isShowFilter, setIsShowFilter] = useState<boolean>(false);
  const [filterSort, setFilterSort] = useState<string>('');
  const [valueFilterVisibility, setValueFilterVisibility] = useState<
    boolean | undefined
  >(undefined);
  const [isSelectedAll, setIsSelectedAll] = useState<boolean | null>(null);

  const handleSetParamsLocal = useCallback((paramsLocal: ParamsQuery) => {
    const filterLocal = JSON.parse(
      localStorage.getItem(FILTER_PROFILE) || '{}'
    );

    localStorage.setItem(
      FILTER_PROFILE,
      JSON.stringify({
        ...filterLocal,
        gallery: paramsLocal,
      })
    );
  }, []);

  useEffect(() => {
    const params: ParamsQuery = Object.fromEntries([...searchParams]);
    if (Object.keys(params).length !== 0) {
      if (
        params.price ||
        params.status ||
        params.updatedAt ||
        params.isVisible
      ) {
        isDesktop && setIsFilterProfile(true);
      } else {
        setIsFilterProfile(false);
      }

      if (params.search && !isDesktop) {
        setIsSearchProfile(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop]);

  useEffect(() => {
    const params: ParamsQuery = Object.fromEntries([...searchParams]);
    setListNFTGallery([]);
    handleSetParamsLocal(params);

    if (Object.keys(params).length !== 0) {
      setOption({
        ...initialOption,
        ...params,
        isVisible: params.isVisible ? JSON.parse(params.isVisible) : undefined,
      });

      setValueSearch((prev) =>
        prev === (params.search || '') ? prev : params.search || ''
      );

      setFilterSort((prev) =>
        prev === (params.updatedAt || '') ? prev : params.updatedAt || ''
      );

      setValueFilterVisibility(
        params.isVisible ? JSON.parse(params.isVisible || '') : undefined
      );
      return;
    }

    setOption(initialOption);
    setValueSearch('');
  }, [handleSetParamsLocal, initialOption, searchParams, setIsFilterProfile]);

  useEffect(() => {
    if (isDesktop && option) {
      handleFilter({
        isVisible: valueFilterVisibility,
        updatedAt: filterSort,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterSort, isDesktop, valueFilterVisibility]);

  const fetchMoreData = () => {
    if (newCursor) {
      setOption((prev) => (prev ? { ...prev, cursor: newCursor } : prev));
    }
  };

  const fetchListNFT = useCallback(async (params: Option) => {
    setIsLoading(true);

    await nftApi
      .fetchListNFTGallery(params)
      .then(async (res) => {
        const { data, count, cursor } = res;
        setCountNFT(count);
        setNewCursor(cursor);
        setListNFTGallery((prev) => (prev ? [...prev, ...data] : data));
        setIsLoading(false);
        setCallCount((prev) => prev + 1);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (option) {
      fetchListNFT(option);
    }
  }, [fetchListNFT, option]);

  const handleSelectAll = () => {
    if (listSelected.length === countNFT) {
      setListSelected([]);
      setIsSelectedAll(false);
      return;
    }

    const newListSelect = listNFTGallery
      ? listNFTGallery.map((item) => ({
          tokenAddress: item.tokenAddress,
          tokenId: item.tokenId,
          isVisible: item.isVisible || false,
        }))
      : [];

    setIsSelectedAll(true);
    setListSelected(newListSelect);
  };

  const handleCancelSetVisibility = () => {
    setIsSelectedAll(false);
    setIsSetVisibility(false);
    setListSelected([]);
  };

  const handleUpdateVisible = useCallback(
    async (data: NftVisible[]) => {
      await nftApi.updateVisible(data);
      setListSelected([]);
      setListNFTGallery([]);
      setCountNFT(0);
      setIsSetVisibility(false);
      if (option) {
        await fetchListNFT(option);
      }
    },
    [fetchListNFT, option]
  );

  const handleHideSelected = () => {
    const newParams = listSelected.map((item) => ({
      ...item,
      isVisible: false,
    }));

    handleUpdateVisible(newParams);
    setIsSelectedAll(false);
  };

  const handleShowSelected = () => {
    const newParams = listSelected.map((item) => ({
      ...item,
      isVisible: true,
    }));

    handleUpdateVisible(newParams);
    setIsSelectedAll(false);
  };

  const handleSelected = useCallback((selected: boolean, data: NftVisible) => {
    setIsSelectedAll(null);
    if (selected) {
      setListSelected((prev) => [...prev, data]);
    } else {
      setListSelected((prev) =>
        prev.filter(
          (itemSelected) =>
            `${itemSelected.tokenAddress}${itemSelected.tokenId}` !==
            `${data.tokenAddress}${data.tokenId}`
        )
      );
    }
  }, []);

  const handleFilter = (data: ParamsFilter) => {
    const params: ParamsQuery = Object.fromEntries([...searchParams]);
    const newParams: ParamsQuery = {
      ...params,
    };

    if (data.updatedAt) {
      newParams.updatedAt = data.updatedAt;
    } else {
      delete newParams.updatedAt;
    }

    if (typeof data.isVisible !== 'undefined') {
      newParams.isVisible = data.isVisible + '';
    } else {
      delete newParams.isVisible;
    }

    if (JSON.stringify(params) === JSON.stringify(newParams)) return;

    setSearchParams({ ...newParams }, { replace: true });
  };

  useEffect(() => {
    const isShow = window.innerHeight > 680;
    isShow && setIsShowFilter(true);

    const handleGetScroll = () => {
      const position = window.pageYOffset;

      if (position > 99 || isShow) {
        setIsShowFilter(true);
      } else {
        setIsShowFilter(false);
      }
    };

    window.addEventListener('scroll', handleGetScroll);
    return () => window.removeEventListener('scroll', handleGetScroll);
  }, []);

  const RenderNoResult = () => (
    <NoResult title="No data" subTitle="There are no NFTs in your wallet." />
  );

  if (isLoading && !listNFTGallery?.length) return <Loading />;

  if (
    listNFTGallery &&
    !listNFTGallery.length &&
    !isLoading &&
    Object.keys(Object.fromEntries([...searchParams])).length === 0 &&
    callCount <= 1
  ) {
    return RenderNoResult();
  }

  return (
    <Container className="container-fluid">
      <div className={`${isFilterProfile ? 'row m-0' : 'd-flex'} px-2`}>
        {isDesktop && (
          <div className={isFilterProfile ? 'col col-3 ps-0' : 'width-auto'}>
            <WrapFilter>
              <BorderFilter onClick={() => setIsFilterProfile((prev) => !prev)}>
                {isFilterProfile ? <IconFilterActive /> : <IconFilter />}
              </BorderFilter>
            </WrapFilter>
          </div>
        )}

        <div
          className={`${
            isFilterProfile && isDesktop ? 'col col-9' : 'width-full'
          } p-0`}
        >
          <SearchSetVisibility
            onHandleSelectAll={handleSelectAll}
            onHandleCancel={handleCancelSetVisibility}
            valueSearch={valueSearch}
            onSetValueSearch={setValueSearch}
            disabled={!listSelected.length}
            onHandleHideSelected={handleHideSelected}
            onHandleShowSelected={handleShowSelected}
            isSetVisibility={isSetVisibility}
            onSetIsSetVisibility={setIsSetVisibility}
          />
        </div>
      </div>

      <div className="row m-0">
        {isFilterProfile && isDesktop && (
          <div className="col col-3 ps-2">
            <NavFilter
              filterSort={{
                value: filterSort,
                setValue: setFilterSort,
                listFilter: listFilterSort,
              }}
              listVisibility={{
                value: valueFilterVisibility,
                setValue: setValueFilterVisibility,
                listFilter: listVisibility,
              }}
            />
          </div>
        )}

        {listNFTGallery && (
          <div
            className={
              (isFilterProfile && isDesktop && 'col col-9 px-0') || 'p-0'
            }
          >
            {listNFTGallery.length ? (
              <InfiniteScroll
                dataLength={listNFTGallery.length}
                next={fetchMoreData}
                hasMore={!!newCursor}
                loader={newCursor ? <Loading /> : null}
                scrollableTarget={'scrollTarget'}
              >
                <ListNFT
                  listData={listNFTGallery}
                  isSetVisibility={isSetVisibility}
                  isSelectedAll={isSelectedAll}
                  onHandleSelected={handleSelected}
                  className="row gy-3 gx-3 mx-0"
                />
              </InfiniteScroll>
            ) : isLoading ? (
              <Loading />
            ) : (
              RenderNoResult()
            )}
          </div>
        )}
      </div>

      {!isDesktop && isShowFilter && (
        <FixedIconFilter
          onFilterMobile={handleFilter}
          position="fixed"
          isGallery={true}
        />
      )}
    </Container>
  );
};

export default Gallery;
