import NoResult from '@components/NoResult';
import { SORT } from '@constants/filterNft';
import { useAuth } from '@context/auth';
import {
  Order,
  orderApi,
  PAGE_LIMIT,
  ParamsGetListOrder,
  RequestError,
} from '@namo-workspace/services';
import Loading from '@namo-workspace/ui/Loading';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'react-toastify';
import OrderItemMobile from './components/OrderItemMobile';
import { WrapListOrder } from './order.styled';

const OrderListMobile = () => {
  const { userInfo } = useAuth();
  const initialParams = useMemo(
    () =>
      ({
        page: 1,
        limit: PAGE_LIMIT,
        updatedAt: SORT.DESC,
        renterAddress: userInfo?.address ? userInfo.address : undefined,
      } as ParamsGetListOrder),
    [userInfo]
  );

  const [paramsPage, setParamsPage] = useState(initialParams);
  const [listOrder, setListOrder] = useState<Order[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [totalPage, setTotalPage] = useState<number>(1);

  const handleFetchOrders = useCallback((params: ParamsGetListOrder) => {
    setFetching(true);
    orderApi
      .getListOfOrders(params)
      .then(({ data, totalPage }) => {
        setListOrder((prev) => [...prev, ...data]);
        setTotalPage(totalPage);
      })
      .catch((error: AxiosError<RequestError>) => {
        !!error.response?.data?.message &&
          toast.error(error.response?.data?.message);
      })
      .finally(() => setFetching(false));
  }, []);

  useEffect(() => {
    handleFetchOrders(paramsPage);
  }, [handleFetchOrders, paramsPage]);

  const fetchMoreData = () => {
    if (fetching) return;
    if (paramsPage.page && paramsPage.page < totalPage) {
      const newParams = { ...paramsPage, page: paramsPage.page + 1 };
      setParamsPage(newParams);
      setFetching(true);
      handleFetchOrders(newParams);
    }
  };

  if (fetching && !listOrder.length) return <Loading />;

  return (
    <div>
      {listOrder.length ? (
        <InfiniteScroll
          className="container-list"
          dataLength={listOrder.length}
          next={fetchMoreData}
          hasMore={(paramsPage?.page && paramsPage.page < totalPage) || false}
          loader={
            paramsPage?.page && paramsPage.page < totalPage - 1 ? (
              <Loading />
            ) : null
          }
          scrollableTarget={'scrollTarget'}
        >
          <WrapListOrder>
            {listOrder?.map((item) => (
              <OrderItemMobile order={item} key={item.id} />
            ))}
          </WrapListOrder>
        </InfiniteScroll>
      ) : (
        <NoResult title="No data" subTitle="You have not ordered any NFTs" />
      )}
    </div>
  );
};

export default OrderListMobile;
