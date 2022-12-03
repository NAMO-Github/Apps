import OrderListDesktop from '@containers/order/order-list/OrderListDesktop';
import OrderListMobile from '@containers/order/order-list/OrderListMobile';
import useMediaQuery, { QUERY } from '@hooks/useMediaQuery';
import { FC } from 'react';
import { TabProps } from './TabContent';

const MyOrder: FC<TabProps> = ({ address, tab }) => {
  const isSmallMobile = useMediaQuery(QUERY.SMALL_MOBILE);

  return isSmallMobile ? <OrderListMobile /> : <OrderListDesktop />;
};

export default MyOrder;
