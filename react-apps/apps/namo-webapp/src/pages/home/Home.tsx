import ListNFT from '@components/ListNFT';
import NoResult from '@components/NoResult';
import {
  InfoNFT,
  nftApi,
  PAGE_LIMIT,
  ParamGetNft,
  STATUS_NFT,
} from '@namo-workspace/services';
import { Colors } from '@namo-workspace/themes';
import { useCallback, useContext, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled, { css } from 'styled-components';
// import Footer from './Footer';
import HomeFilter, { HomeFilterValue } from '@components/FilterNFT/HomeFilter';
import {
  listFilterPrice,
  listFilterSort,
  listFilterStatus,
  SORT,
} from '@constants/filterNft';
import { FilterSearchContext, ParamsQuery } from '@context/filter-search';
import { useWalletAuth } from '@context/wallet-auth';
import useMediaQuery, { QUERY } from '@hooks/useMediaQuery';
import Loading from '@namo-workspace/ui/Loading';
import { MaxWidthContent } from '@namo-workspace/ui/MaxWidthContent.styled';
import { Body3 } from '@namo-workspace/ui/Typography';
import { isEqual } from 'lodash';
import { useSearchParams } from 'react-router-dom';
import FixedIconFilter from '@components/FixedIconFilter';
import { ParamsFilter } from '@components/Modal/ModalFilter';
import { useAuth } from '@context/auth';

const initialPages = {
  page: 1,
  limit: PAGE_LIMIT,
  search: '',
  price: '',
  status: `${STATUS_NFT.FOR_RENT},${STATUS_NFT.RENTED},${STATUS_NFT.UNAVAILABLE}`,
  updatedAt: SORT.DESC,
  isVisible: true,
};

const Home = () => {
  const { isFilterHome, setIsFilterHome } = useContext(FilterSearchContext);

  const [searchParams, setSearchParams] = useSearchParams();

  const [listNFT, setListNFT] = useState<InfoNFT[] | undefined>();
  const [countNFT, setCountNFT] = useState<undefined | number>(0);
  const [totalPage, setTotalPage] = useState<number>(2);
  const [paramsPage, setParamsPage] = useState<ParamGetNft | undefined>();
  const [fetching, setFetching] = useState<boolean>(true);

  const isDesktop = useMediaQuery(QUERY.DESKTOP);

  const { userInfo } = useAuth();
  const { account } = useWalletAuth();

  const [filterValue, setFilterValue] = useState<HomeFilterValue>({});

  useEffect(() => {
    if (account && userInfo && account !== userInfo.address) {
      setIsFilterHome(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, userInfo]);

  useEffect(() => {
    const params: ParamsQuery = Object.fromEntries([...searchParams]);
    if (Object.keys(params).length !== 0) {
      if ((params.price || params.status || params.updatedAt) && isDesktop) {
        setIsFilterHome(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params: ParamsQuery = Object.fromEntries([...searchParams]);
    setListNFT([]);
    if (Object.keys(params).length !== 0) {
      setParamsPage({
        ...initialPages,
        ...params,
        isVisible: true,
        status: params.status || initialPages.status,
        price: params.price || initialPages.price,
        updatedAt: params.updatedAt || initialPages.updatedAt,
      });

      setFilterValue({
        filterPrice: params.price,
        filterSort: params.updatedAt,
        filterStatus: params.status ? params.status.split(',') : [],
      });
    } else {
      setParamsPage(initialPages);
      setFilterValue({
        filterPrice: undefined,
        filterSort: undefined,
        filterStatus: undefined,
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (paramsPage) {
      setFetching(true);
      nftApi
        .fetchListNFTNamo(paramsPage)
        .then(({ data, count, totalPage }) => {
          setListNFT((prev) => (prev ? [...prev, ...data] : [...data]));
          setCountNFT(count);
          setTotalPage(totalPage);
        })
        .finally(() => setFetching(false));
    }
  }, [paramsPage]);

  const fetchMoreData = useCallback(async () => {
    if (fetching) return;
    if (paramsPage && paramsPage.page && paramsPage.page < totalPage) {
      const newParams = { ...paramsPage, page: paramsPage.page + 1 };
      setParamsPage(newParams);
    }
  }, [fetching, paramsPage, totalPage]);

  const handleFilter = (data: HomeFilterValue) => {
    const params: ParamsQuery = Object.fromEntries([...searchParams]);
    const newParams: ParamsQuery = {
      ...params,
    };

    if (data.filterPrice) {
      newParams.price = data.filterPrice;
    } else {
      delete newParams.price;
    }

    if (data.filterSort) {
      newParams.updatedAt = data.filterSort;
    } else {
      delete newParams.updatedAt;
    }

    if (data.filterStatus && data.filterStatus.length) {
      newParams.status = data.filterStatus.join(',');
    } else {
      delete newParams.status;
    }

    if (isEqual(params, newParams)) return;

    setSearchParams({ ...newParams }, { replace: true });
  };
  const handleFilterMobile = (data: ParamsFilter) => {
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

    if (isEqual(params, newParams)) return;

    setSearchParams({ ...newParams }, { replace: true });
  };

  if (fetching && !listNFT) return <Loading />;

  return (
    <MaxWidthContent>
      <Container className="py-3 py-lg-5  p-container">
        <div className="container-fluid p-0">
          <div className="row m-0">
            {isFilterHome && isDesktop && (
              <div className="col col-3 ps-0 br-filter">
                <WrapNavFilter>
                  <HomeFilter
                    filterPrice={{
                      listFilter: listFilterPrice,
                    }}
                    filterStatus={{
                      listFilter: listFilterStatus,
                    }}
                    filterSort={{
                      listFilter: listFilterSort,
                    }}
                    value={filterValue}
                    onChange={(filter) => {
                      handleFilter(filter);
                    }}
                  />
                </WrapNavFilter>
              </div>
            )}

            {listNFT && (
              <div
                className={isFilterHome && isDesktop ? 'col col-9 pe-0' : 'p-0'}
              >
                {listNFT.length ? (
                  <InfiniteScroll
                    className="container-list"
                    dataLength={listNFT.length}
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
                    {!![...searchParams].length && (
                      <WrapperTotal>
                        <Total>
                          {countNFT?.toLocaleString('en-US')}{' '}
                          {countNFT === 1 ? 'item' : 'items'}
                        </Total>
                      </WrapperTotal>
                    )}

                    <ListNFT
                      listData={listNFT}
                      isDotVisible={false}
                      className="row gy-3 gx-3 mx-0"
                    />
                  </InfiniteScroll>
                ) : fetching ? (
                  <Loading />
                ) : (
                  <NoResultS
                    title="No results found"
                    subTitle="Sorry, we did not find any NFTs."
                  />
                )}
              </div>
            )}
          </div>
        </div>
        {/* <Footer /> */}
      </Container>

      {!isDesktop && (
        <FixedIconFilter
          onFilterMobile={handleFilterMobile}
          isHomeSearch={true}
          position="fixed"
        />
      )}
    </MaxWidthContent>
  );
};

const minHeightStyle = css`
  min-height: calc(100vh - 65px - 6rem);

  @media (max-width: 991.98px) {
    min-height: calc(100vh - 65px - 2rem);
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  .wrap {
    flex: 1;
  }

  .container-fluid {
    ${minHeightStyle}

    & > .row {
      width: 100%;
    }
  }

  .container-list {
    ${minHeightStyle}
    overflow-x: hidden !important;
    padding: 0;
  }

  .br-filter {
    border-right: 1px solid ${Colors.strokeLevel3};
  }
`;

const NoResultS = styled(NoResult)`
  ${minHeightStyle}
`;

const WrapperTotal = styled.div`
  height: 45px;
`;

const Total = styled(Body3)`
  display: inline-block;
  color: ${Colors.textLevel3};
  font-weight: 700;
  padding: 0 0.5rem;
`;

const WrapNavFilter = styled.div`
  position: sticky;
  top: 64px;
  left: 0;
  height: auto;
`;

export default Home;
