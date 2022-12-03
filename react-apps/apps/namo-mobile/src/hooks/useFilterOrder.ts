import { Order, orderApi, ParamsGetListOrder } from '@namo-workspace/services';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';

const useFilterOrder = (params: ParamsGetListOrder) => {
  const [isLoading, setIsLoading] = useState(false);

  const [listOrderNFT, setListOrderNFT] = useState<Order[]>([]);
  const [count, setCount] = useState<undefined | number>();
  const [totalPage, setTotalPage] = useState<number>(0);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const [callTime, setCallTime] = useState(0);
  const isEmpty = useMemo(() => {
    if (callTime <= 1 && listOrderNFT.length === 0) {
      return true;
    }
    return false;
  }, [callTime, listOrderNFT]);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      setCurrentPage(params.page);
      orderApi
        .getListOfOrders(params)
        .then(({ data, count, totalPage }) => {
          setCallTime((prev) => (prev += 1));
          setListOrderNFT(data);
          setCount(count);
          setTotalPage(totalPage);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, [params])
  );

  const refreshData = useCallback(() => {
    setIsLoading(true);
    orderApi
      .getListOfOrders({ ...params, page: 1 })
      .then(({ data, currentPage, count, totalPage }) => {
        setCallTime(1);
        setCount(count);
        setCurrentPage(currentPage);
        setListOrderNFT(data);
        setTotalPage(totalPage);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [params]);

  const loadMore = useCallback(() => {
    if (currentPage < totalPage) {
      setIsLoadingMore(true);
      orderApi
        .getListOfOrders({ ...params, page: currentPage + 1 })
        .then(({ data, currentPage }) => {
          setCurrentPage(currentPage);
          setListOrderNFT((prev) => [...prev, ...data]);
        })
        .finally(() => {
          setIsLoadingMore(false);
        });
    }
  }, [currentPage, params, totalPage]);

  return {
    isLoading,
    isLoadingMore,
    listOrderNFT,
    count,
    totalPage,
    refreshData,
    loadMore,
    isEmpty,
  };
};
export default useFilterOrder;
