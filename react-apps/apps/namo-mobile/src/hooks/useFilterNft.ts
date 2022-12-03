import { InfoNFT, nftApi, ParamGetNft } from '@namo-workspace/services';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';

const useFilterNft = (params: ParamGetNft | undefined, skip?: boolean) => {
  const [isLoading, setIsLoading] = useState(false);

  const [listNFT, setListNFT] = useState<InfoNFT[]>([]);
  const [countNFT, setCountNFT] = useState<undefined | number>();
  const [totalPage, setTotalPage] = useState<number>(0);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const [callTime, setCallTime] = useState(0);

  const isEmpty = useMemo(() => {
    if (skip) return true;
    if (callTime <= 1 && listNFT.length === 0) {
      return true;
    }
    return false;
  }, [callTime, listNFT.length, skip]);

  const fetchData = useCallback(() => {
    if (skip) return;
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
  }, [params, skip]);

  useFocusEffect(fetchData);

  const refreshData = useCallback(() => {
    if (skip) return;
    if (params) {
      setIsLoading(true);
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
          setIsLoading(false);
        });
    }
  }, [params, skip]);

  const loadMore = useCallback(() => {
    if (skip) return;
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
  }, [currentPage, listNFT, params, skip, totalPage]);

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
    callTime,
  };
};
export default useFilterNft;
