import { InfoNFT, nftApi, ParamGetNft } from '@namo-workspace/services';
import { useCallback, useEffect, useMemo, useState } from 'react';

const useFilterNftWithoutFocusEffect = (params: ParamGetNft | undefined) => {
  const [isLoading, setIsLoading] = useState(false);

  const [listNFT, setListNFT] = useState<InfoNFT[]>([]);
  const [countNFT, setCountNFT] = useState<undefined | number>();
  const [totalPage, setTotalPage] = useState<number>(0);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const [callTime, setCallTime] = useState(0);

  const isEmpty = useMemo(() => {
    if (callTime <= 1 && listNFT.length === 0) {
      return true;
    }
    return false;
  }, [callTime, listNFT]);

  useEffect(() => {
    if (params) {
      setIsLoading(true);
      setCurrentPage(params.page);
      nftApi
        .fetchListNFT(params)
        .then(({ data, count, totalPage }) => {
          setCallTime((prev) => (prev += 1));

          setListNFT(data);
          setCountNFT(count);
          setTotalPage(totalPage);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [params]);

  const refreshData = useCallback(() => {
    if (params) {
      setIsLoadingMore(true);
      nftApi
        .fetchListNFT({ ...params, page: 1 })
        .then(({ data, currentPage, count, totalPage }) => {
          setCallTime(1);
          setCurrentPage(currentPage);
          setCountNFT(count);
          setListNFT(data);
          setTotalPage(totalPage);
        })
        .finally(() => {
          setIsLoadingMore(false);
        });
    }
  }, [params]);

  const loadMore = useCallback(() => {
    if (params) {
      if (currentPage < totalPage) {
        setIsLoadingMore(true);
        nftApi
          .fetchListNFT({ ...params, page: currentPage + 1 })
          .then(({ data, currentPage }) => {
            setCurrentPage(currentPage);
            setListNFT([...listNFT, ...data]);
          })
          .finally(() => {
            setIsLoadingMore(false);
          });
      }
    }
  }, [currentPage, listNFT, params, totalPage]);

  return {
    isLoading,
    isLoadingMore,
    listNFT,
    countNFT,
    totalPage,
    refreshData,
    loadMore,
    isEmpty,
    setCallTime,
  };
};
export default useFilterNftWithoutFocusEffect;
