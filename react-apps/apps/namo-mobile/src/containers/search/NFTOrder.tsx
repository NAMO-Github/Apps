import { STATUS } from '@constants/rent';
import ImageNFT from '@containers/common/ImageNFT';
import Images from '@images';
import {
  convertPricePerDay,
  formDateWithoutTime,
  Order,
} from '@namo-workspace/services';
import { Colors } from '@namo-workspace/themes';
import { Body3, Body4, Sub } from '@namo-workspace/ui/Typography';
import View from '@namo-workspace/ui/view/View';
import { parseWei } from '@namo-workspace/utils';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileRouter } from '@routes/routes.constants';
import { ProfileStackParams } from '@routes/routes.model';
import React, { FC, memo, useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { css } from 'styled-components';
import styled from 'styled-components/native';

interface NFTOrderProps {
  item?: Order;
}

const { IcEthereum } = Images;

export type OrderDetailsProps = NativeStackNavigationProp<
  ProfileStackParams,
  'PROFILE'
>;

const NFTCard: FC<NFTOrderProps> = ({ item }) => {
  const nftDetail = useMemo(() => {
    try {
      return JSON.parse(item?.nftDetails);
    } catch (e) {
      return null;
    }
  }, [item?.nftDetails]);

  const navigation = useNavigation<OrderDetailsProps>();
  const handleTail = (val: string) => {
    if (!val || val?.length < 15) return val;
    return `${val.slice(0, 6)}...${val.slice(val.length - 4, val.length)}`;
  };
  return (
    <SingleItem
      onPress={() =>
        navigation.navigate(ProfileRouter.ORDER_DETAILS, {
          shouldShowStatus: false,
          infoNFT: JSON.parse(item.nftDetails),
          detail: item,
        })
      }
      activeOpacity={0.8}
    >
      <Container flexRow>
        <ImageNFT detailNft={nftDetail} size={88} />
        <Container ml={4} style={{ flex: 1 }}>
          <Container flexRow alignCenter mb={1}>
            <ImageAvatar
              source={
                item?.lender?.avatar
                  ? { uri: item?.lender?.avatar }
                  : require('../../assets/images/img_avatar.png')
              }
            />
            <Description
              fontSize={14}
              fontWeight="400"
              fontStyle="normal"
              color={Colors.textLevel2}
            >
              {item?.lender?.name || 'Unnamed'}
            </Description>
          </Container>
          <Description
            fontSize={14}
            fontWeight="600"
            fontStyle="normal"
            color={Colors.textLevel1}
            style={{ flexShrink: 1 }}
          >
            {nftDetail?.name}
          </Description>
          <Container flexRow mt={1}>
            <Description
              fontSize={14}
              fontWeight="600"
              fontStyle="normal"
              color={Colors.textLevel1}
            >
              Duration:{' '}
              <Details
                fontSize={14}
                fontWeight="400"
                fontStyle="normal"
                color={Colors.textLevel4}
              >
                {item?.pickedLabel}
              </Details>
            </Description>
          </Container>
        </Container>
      </Container>
      <Container mt={2.5} flexRow justifySpaceBetween>
        <Container flexRow alignCenter>
          <Description
            fontSize={14}
            fontWeight="500"
            fontStyle="normal"
            color={Colors.textLevel1}
          >
            Order ID:{' '}
            <Details
              fontSize={14}
              fontWeight="600"
              fontStyle="normal"
              color={Colors.textLevel3}
              mr={1}
            >
              {handleTail(item?.id)}{' '}
            </Details>
          </Description>
        </Container>
        <Description
          fontSize={14}
          fontWeight="500"
          fontStyle="normal"
          color={Colors.textLevel1}
        >
          Date:{' '}
          <Details
            fontSize={14}
            fontWeight="400"
            fontStyle="normal"
            color={Colors.textLevel3}
          >
            {formDateWithoutTime(item?.createdAt)}
          </Details>
        </Description>
      </Container>
      <Container mt={2.5} flexRow justifySpaceBetween>
        <Container flexRow alignCenter>
          <IcEthereum width={20} height={20} />
          <Details
            fontSize={12}
            fontWeight="600"
            fontStyle="normal"
            color={Colors.textLevel2}
          >
            {' '}
            {item?.totalPrice / Math.pow(10, 18)}{' '}
            <Details
              fontSize={12}
              fontWeight="400"
              fontStyle="normal"
              color={Colors.textLevel4}
            >
              (
              {convertPricePerDay(
                parseWei(item?.totalPrice),
                item?.pickedDuration
              )}
              /day)
            </Details>
          </Details>
        </Container>
        <Status status={STATUS[item?.status]}>
          <StatusText status={STATUS[item?.status]}>
            {STATUS[item?.status]}
          </StatusText>
        </Status>
      </Container>
    </SingleItem>
  );
};

export default memo(NFTCard);

const Container = styled(View)`
  flex: 1;
`;

const ImageAvatar = styled.Image`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  margin-right: 4px;
`;

const Description = styled(Body3)`
  line-height: 20px;
`;

const Details = styled(Body4)`
  line-height: 20px;
`;

const Status = styled(View)`
  padding: 5px 8px;
  border-radius: 20px;

  ${({ status }) => {
    switch (status) {
      case STATUS.PROCESSING:
        return css`
          background-color: ${Colors.yellow};
        `;
      case STATUS.PENDING:
        return css`
          background-color: ${Colors.yellow};
        `;
      case STATUS.FORRENT:
        return css`
          background-color: ${Colors.primaryGreen};
        `;
      case STATUS.RENTED:
      case STATUS.ORDERED:
        return css`
          background-color: ${Colors.primaryRed};
        `;
      case STATUS.TOPAY:
        return css`
          background-color: ${Colors.primaryRed};
        `;
      case STATUS.UNAVAILABLE:
        return css`
          border-width: 1px;
          border-color: ${Colors.strokeLevel3};
          background-color: ${Colors.background2};
        `;
      default:
        return css`
          background-color: ${Colors.primaryGreen};
        `;
    }
  }};
`;

const StatusText = styled(Sub)`
  color: ${Colors.white};
  font-weight: 600;
  text-transform: uppercase;
`;

const SingleItem = styled(TouchableOpacity)`
  /* flex: 1; */
  width: 100%;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${Colors.strokeLevel3};
`;
