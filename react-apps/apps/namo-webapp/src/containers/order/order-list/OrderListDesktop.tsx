import { ReactComponent as IcETH } from '@assets/images/ic-Etherium.svg';
import NoResult from '@components/NoResult';
import { SORT } from '@constants/filterNft';
import { ROUTES } from '@constants/routes';
import { Container } from '@containers/profile/components/tab.styled';
import { useAuth } from '@context/auth';
import {
  ListOrderResponse,
  orderApi,
  ParamsGetListOrder,
  RequestError,
  Sort,
} from '@namo-workspace/services';
import Loading from '@namo-workspace/ui/Loading';
import Paginate from '@namo-workspace/ui/Paginate';
import { ellipsisCenter, parseWei } from '@namo-workspace/utils';
import { AxiosError } from 'axios';
import { format, parseISO } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Table } from 'reactstrap';
import { getColorByStatus } from '../OrderDetail';
import NftNameCard from './components/NftNameCard';
import {
  Date,
  HeaderCellS,
  HeaderS,
  OrderID,
  TagStatus,
  TotalPriceS,
} from './order.styled';

export default function OrderListDesktop() {
  const { userInfo } = useAuth();
  const initialParams: ParamsGetListOrder = useMemo(
    () => ({
      page: 1,
      limit: 10,
      updatedAt: SORT.DESC as Sort,
      renterAddress: userInfo?.address ? userInfo.address : undefined,
    }),
    [userInfo]
  );

  const [params, setParams] = useState<ParamsGetListOrder>(initialParams);
  const [listOrder, setListOrder] = useState<ListOrderResponse>();
  const [isFetch, setIsFetch] = useState<boolean>(false);

  useEffect(() => {
    setIsFetch(true);
    orderApi
      .getListOfOrders(params)
      .then((res) => {
        setListOrder(res);
      })
      .catch((error: AxiosError<RequestError>) => {
        !!error.response?.data?.message &&
          toast.error(error.response?.data?.message);
      })
      .finally(() => setIsFetch(false));
  }, [params]);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    setParams((prev) => ({ ...prev, page: 1, limit: pageSize }));
  }, []);

  const handlePageChange = useCallback(({ selected }: { selected: number }) => {
    setParams((prev) => ({ ...prev, page: selected + 1 }));
  }, []);

  if (isFetch && !listOrder?.data.length) return <Loading />;

  if (!listOrder || !listOrder.data.length)
    return (
      <NoResult title="No data" subTitle="You have not ordered any NFTs" />
    );

  return (
    <Container>
      <Table borderless responsive>
        <HeaderS>
          <tr>
            <HeaderCellS>Order ID</HeaderCellS>
            <HeaderCellS>Date</HeaderCellS>
            <HeaderCellS>NFT Name</HeaderCellS>
            <HeaderCellS>Status</HeaderCellS>
            <HeaderCellS>Total payment</HeaderCellS>
          </tr>
        </HeaderS>

        <tbody>
          {listOrder.data.map((order) => (
            <tr key={order.id}>
              <td>
                <OrderID to={`${ROUTES.ORDER}/${order.txHash}`}>
                  {ellipsisCenter(order.id)}
                </OrderID>
              </td>
              <Date>{format(parseISO(order.createdAt), 'dd/MM/yyyy')}</Date>
              <td>
                <NftNameCard nftRaw={order.nftDetails} />
              </td>
              <td>
                <TagStatus color={getColorByStatus(order.status)}>
                  {order.status}
                </TagStatus>
              </td>
              <td>
                <TotalPriceS>
                  <span className="me-1">
                    <IcETH width={16} height={16} />
                  </span>
                  {parseWei(order.totalPrice)}
                </TotalPriceS>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Paginate
        page={params.page}
        totalRecord={listOrder?.count || 0}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        pageCount={listOrder?.totalPage || 0}
      ></Paginate>
    </Container>
  );
}
