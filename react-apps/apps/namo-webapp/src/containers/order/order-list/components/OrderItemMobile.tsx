import { defaultAvatar } from '@assets/images';
import { getColorByStatus } from '@containers/order/OrderDetail';
import { ReactComponent as IcETH } from '@assets/images/ic-Etherium.svg';
import {
  convertPricePerDay,
  InfoNFT,
  Order,
  parseMetaDataToMoralis,
  Resolution,
} from '@namo-workspace/services';
import { useEffect, useState } from 'react';
import {
  ImageLender,
  LabelItem,
  LabelValue,
  LenderName,
  LinkS,
  NftName,
  Price,
  PriceDay,
  TagStatus,
  WrapLender,
  WrapPrice,
} from '../order.styled';
import { format, parseISO } from 'date-fns';
import { ellipsisCenter, parseWei } from '@namo-workspace/utils';
import { DEFAULT_USERNAME } from '@constants/common';
import ImageNFT from '@components/ImageNFT';
import { ROUTES } from '@constants/routes';

interface Props {
  order: Order;
}

const OrderItemMobile = ({ order }: Props) => {
  const [detailNft, setDetailNft] = useState<InfoNFT>();

  useEffect(() => {
    const effect = async () => {
      try {
        const { nftDetails } = order;
        const nftParsed = JSON.parse(nftDetails) as InfoNFT;
        const result = await parseMetaDataToMoralis(nftParsed);
        setDetailNft(result);
      } catch (error) {
        setDetailNft({});
      }
    };
    effect();
  }, [order]);

  return (
    <LinkS
      to={`${ROUTES.ORDER}/${order?.txHash}`}
      className="container-full mb-3 pb-3"
    >
      <div className="row align-items-center mx-0">
        <div className="col-4 col-sm-3 ps-0">
          <ImageNFT infoNFT={detailNft} size={Resolution.Low} />
        </div>

        <div className="col-8 col-sm-9 pe-0">
          <WrapLender>
            <ImageLender src={order.lender.avatar || defaultAvatar} />
            <LenderName>{order.lender.name || DEFAULT_USERNAME}</LenderName>
          </WrapLender>

          <NftName>{detailNft?.metaData?.name || DEFAULT_USERNAME}</NftName>
          <div className="d-flex align-items-center mt-2">
            <LabelItem>Duration:</LabelItem>
            <LabelValue className="ms-1">{order.pickedLabel}</LabelValue>
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between mt-3">
        <div className="d-flex align-items-center">
          <LabelItem>Order ID:</LabelItem>
          <LabelValue className="ms-1">{ellipsisCenter(order.id)}</LabelValue>
        </div>

        <div className="d-flex align-items-center">
          <LabelItem>Date:</LabelItem>
          <LabelValue className="ms-1">
            {format(parseISO(order.createdAt), 'dd/MM/yyyy')}
          </LabelValue>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between mt-3">
        <WrapPrice className="d-inline-flex align-items-center">
          <IcETH width={16} height={16} />
          <Price className="ms-1">{parseWei(order.totalPrice)}</Price>
          <PriceDay>
            (
            {convertPricePerDay(
              parseWei(order.totalPrice),
              order.pickedDuration
            )}
            /day)
          </PriceDay>
        </WrapPrice>

        <TagStatus color={getColorByStatus(order?.status)}>
          {order.status}
        </TagStatus>
      </div>
    </LinkS>
  );
};

export default OrderItemMobile;
