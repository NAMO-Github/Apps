import {
  useMemo,
  useState,
  useEffect,
  FC,
  useCallback,
  useContext,
} from 'react';
import ListNFT from '@components/ListNFT';
import InfiniteScroll from 'react-infinite-scroll-component';
import NoResult from '@components/NoResult';
import {
  nftApi,
  ParamGetNft,
  PAGE_LIMIT,
  STATUS_NFT,
  InfoNFT,
  NftVisible,
} from '@namo-workspace/services';
import { USER_DATA_TABS } from '../constants';
import Loading from '@namo-workspace/ui/Loading';
import { ReactComponent as IconFilter } from '@assets/images/common/ic_filter.svg';
import { ReactComponent as IconFilterActive } from '@assets/images/common/ic_filter_active.svg';
import NavFilter from '@components/FilterNFT/NavFilter';
import {
  listFilterPrice,
  listFilterStatus,
  listFilterSort,
  listVisibility,
  SORT,
} from '@constants/filterNft';
import SearchSetVisibility from './SearchSetVisibility';
import { BorderFilter, Container, WrapFilter } from './tab.styled';
import useMediaQuery, { QUERY } from '@hooks/useMediaQuery';
import FixedIconFilter from '@components/FixedIconFilter';
import { ParamsFilter } from '@components/Modal/ModalFilter';
import { FilterSearchContext, ParamsQuery } from '@context/filter-search';
import { useSearchParams } from 'react-router-dom';
import { FILTER_PROFILE } from '@constants/common';

export interface TabProps {
  tab?: string;
  address?: string;
  proxyWallet?: string;
  statusPublic?: boolean;
}

const TabContentC: FC<TabProps> = ({
  address,
  tab,
  statusPublic,
  proxyWallet,
}) => {
  const initialParams = useMemo(() => {
    const defaultParams = {
      page: 1,
      limit: PAGE_LIMIT,
      search: '' || undefined,
      price: '',
      status:
        tab === USER_DATA_TABS.RENTALS
          ? STATUS_NFT.RENTED
          : `${STATUS_NFT.FOR_RENT},${STATUS_NFT.RENTED}`,
      updatedAt: SORT.DESC,
      isVisible: undefined,
    };

    if (tab === USER_DATA_TABS.RENTALS) {
      const paramsRentals = {
        ...defaultParams,
        ownerOf: proxyWallet,
      };
      return statusPublic
        ? { ...paramsRentals, rentalAddress: address }
        : paramsRentals;
    }

    return {
      ...defaultParams,
      rentalAddress: address,
      isVisible: statusPublic || undefined,
    };
  }, [address, proxyWallet, statusPublic, tab]);

  const newFilterStatus = useMemo(() => {
    return listFilterStatus.filter(
      (item) =>
        item.value === STATUS_NFT.FOR_RENT || item.value === STATUS_NFT.RENTED
    );
  }, []);
  const [searchParams, setSearchParams] = useSearchParams({});
  const { isFilterProfile, setIsFilterProfile, setIsSearchProfile } =
    useContext(FilterSearchContext);

  const [paramsPage, setParamsPage] = useState<ParamGetNft | undefined>();
  const [listData, setListData] = useState<InfoNFT[]>();
  const [countNft, setCountNft] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [fetching, setFetching] = useState<boolean>(true);

  const [valueSearch, setValueSearch] = useState<string>('');
  const [filterPrice, setFilterPrice] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string[] | undefined>();
  const [filterSort, setFilterSort] = useState<string>('');
  const [valueFilterVisibility, setValueFilterVisibility] = useState<
    boolean | undefined
  >(undefined);

  const [isSetVisibility, setIsSetVisibility] = useState<boolean>(false);
  const [listSelected, setListSelected] = useState<NftVisible[]>([]);
  const [isShowFilter, setIsShowFilter] = useState<boolean>(false);
  const isDesktop = useMediaQuery(QUERY.DESKTOP);
  const [callCount, setCallCount] = useState(0);
  const [isSelectedAll, setIsSelectedAll] = useState<boolean | null>(null);

  const handleSetParamsLocal = useCallback(
    (paramsLocal: ParamsQuery) => {
      const filterLocal = JSON.parse(
        localStorage.getItem(FILTER_PROFILE) || '{}'
      );

      if (tab === USER_DATA_TABS.RENTALS) {
        localStorage.setItem(
          FILTER_PROFILE,
          JSON.stringify({
            ...filterLocal,
            rentals: paramsLocal,
          })
        );
      } else {
        localStorage.setItem(
          FILTER_PROFILE,
          JSON.stringify({
            ...filterLocal,
            forRent: paramsLocal,
          })
        );
      }
    },
    [tab]
  );

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
    setListData([]);
    handleSetParamsLocal(params);

    if (Object.keys(params).length !== 0) {
      setParamsPage({
        ...initialParams,
        ...params,
        isVisible: params.isVisible
          ? JSON.parse(params.isVisible)
          : initialParams.isVisible,
      });
      setValueSearch((prev) =>
        prev === (params.search || '') ? prev : params.search || ''
      );

      setFilterPrice((prev) =>
        prev === (params.price || '') ? prev : params.price || ''
      );

      setFilterStatus((prev) =>
        prev && prev.toString() === (params.status || '')
          ? prev
          : params.status?.split(',') || undefined
      );
      setFilterSort((prev) =>
        prev === (params.updatedAt || '') ? prev : params.updatedAt || ''
      );

      setValueFilterVisibility((prev) =>
        params.isVisible ? JSON.parse(params.isVisible) : prev
      );

      return;
    }

    setParamsPage(initialParams);
    setValueSearch('');
  }, [handleSetParamsLocal, initialParams, searchParams, setIsFilterProfile]);

  const handleFetchNFTForRent = useCallback((params: ParamGetNft) => {
    setFetching(true);
    nftApi
      .fetchListNFTNamo(params)
      .then(({ data, count, totalPage }) => {
        setListData((prev) => (prev ? [...prev, ...data] : [...data]));
        setCountNft(count);
        setTotalPage(totalPage);
        setCallCount((prev) => prev + 1);
      })
      .finally(() => setFetching(false));
  }, []);

  const fetchMoreData = useCallback(() => {
    if (fetching) {
      return;
    }
    if (paramsPage && paramsPage.page && paramsPage.page < totalPage) {
      const newParams = { ...paramsPage, page: paramsPage.page + 1 };
      setParamsPage(newParams);
    }
  }, [fetching, paramsPage, totalPage]);

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

  useEffect(() => {
    if (isDesktop && paramsPage) {
      handleFilter({
        isVisible: valueFilterVisibility,
        price: filterPrice,
        updatedAt: filterSort,
        status: filterStatus ? filterStatus.toString() : '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterPrice, filterSort, filterStatus, isDesktop, valueFilterVisibility]);

  useEffect(() => {
    if (!paramsPage?.ownerOf && tab === USER_DATA_TABS.RENTALS) return;
    if (paramsPage) {
      handleFetchNFTForRent(paramsPage);
    }
  }, [handleFetchNFTForRent, paramsPage, tab]);

  const handleSelectAll = () => {
    if (listSelected.length === countNft) {
      setListSelected([]);
      setIsSelectedAll(false);
      return;
    }

    const newListSelect = listData
      ? listData.map((item) => ({
          tokenAddress: item.tokenAddress,
          tokenId: item.tokenId,
          isVisible: item.isVisible || false,
        }))
      : [];

    setIsSelectedAll(true);
    setListSelected(newListSelect);
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

  const handleCancelSetVisibility = () => {
    setIsSetVisibility(false);
    setIsSelectedAll(false);
    setListSelected([]);
  };

  const handleUpdateVisible = useCallback(
    async (data: NftVisible[]) => {
      await nftApi.updateVisible(data);
      setListSelected([]);
      setListData([]);
      setTotalPage(1);
      setCountNft(0);
      setFetching(false);
      setIsSetVisibility(false);
      if (paramsPage) {
        await handleFetchNFTForRent(paramsPage);
      }
    },
    [handleFetchNFTForRent, paramsPage]
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

  const handleFilter = useCallback(
    (data: ParamsFilter) => {
      const params: ParamsQuery = Object.fromEntries([...searchParams]);
      const newParams: ParamsQuery = {
        ...params,
      };

      if (data.price) {
        newParams.price = data.price;
      } else {
        delete newParams.price;
      }

      if (data.updatedAt) {
        newParams.updatedAt = data.updatedAt;
      } else {
        delete newParams.updatedAt;
      }

      if (data.status) {
        newParams.status = data.status;
      } else {
        delete newParams.status;
      }
      if (typeof data.isVisible !== 'undefined') {
        newParams.isVisible = data.isVisible + '';
      } else {
        delete newParams.isVisible;
      }

      if (JSON.stringify(params) === JSON.stringify(newParams)) return;

      setSearchParams({ ...newParams }, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const RenderNavFilter = () => {
    if (tab === USER_DATA_TABS.RENTALS) {
      return (
        <NavFilter
          filterSort={{
            value: filterSort,
            setValue: setFilterSort,
            listFilter: listFilterSort,
          }}
          statusPublic={statusPublic}
        />
      );
    }

    return (
      <NavFilter
        filterPrice={{
          value: filterPrice,
          setValue: setFilterPrice,
          listFilter: listFilterPrice,
        }}
        filterStatus={{
          value: filterStatus,
          setValueArray: setFilterStatus,
          listFilter: newFilterStatus,
        }}
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
        statusPublic={statusPublic}
      />
    );
  };

  const RenderNoResult = () => (
    <NoResult
      title="No data"
      subTitle={
        tab === USER_DATA_TABS.RENTALS
          ? 'You are not renting any NFTs'
          : 'You have no NFTs set for rent'
      }
    />
  );

  if (fetching && !listData?.length) return <Loading />;

  if (
    listData &&
    !listData.length &&
    !fetching &&
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
            statusPublic={statusPublic || tab === USER_DATA_TABS.RENTALS}
          />
        </div>
      </div>

      <div className="row m-0">
        {isFilterProfile && isDesktop && (
          <div className="col col-3 ps-2">{RenderNavFilter()}</div>
        )}

        {listData && (
          <div
            className={
              (isFilterProfile && isDesktop && 'col col-9 px-0') || 'p-0'
            }
          >
            {listData.length ? (
              <InfiniteScroll
                dataLength={listData?.length || 0}
                next={fetchMoreData}
                hasMore={
                  (paramsPage?.page && paramsPage.page < totalPage) || false
                }
                loader={
                  paramsPage?.page && paramsPage.page < totalPage - 1 ? (
                    <Loading />
                  ) : null
                }
                scrollableTarget={'scrollTarget'}
              >
                <ListNFT
                  listData={listData}
                  isSetVisibility={isSetVisibility}
                  isSelectedAll={isSelectedAll}
                  onHandleSelected={handleSelected}
                  className="row gy-3 gx-3 mx-0"
                />
              </InfiniteScroll>
            ) : fetching ? (
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
          isRentalTab={tab === USER_DATA_TABS.RENTALS}
          statusPublic={statusPublic}
        />
      )}
    </Container>
  );
};

export default TabContentC;
