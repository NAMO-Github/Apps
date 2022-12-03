import { STATUS } from '@constants/rent';
import ImageNFT from '@containers/common/ImageNFT';
import Images from '@images';
import {
  formDateWithoutTime,
  InfoNFT,
  Order,
  Resolution,
} from '@namo-workspace/services';
import { Colors } from '@namo-workspace/themes';
import { Body2, Body3, Body4, Sub } from '@namo-workspace/ui/Typography';
import View from '@namo-workspace/ui/view/View';
import { ERROR, SUCCESS } from '@namo-workspace/utils';
import Clipboard from '@react-native-clipboard/clipboard';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase } from '@react-navigation/routers';
import { MainTab } from '@routes/routes.constants';
import { AppRootParams } from '@routes/routes.model';
import { showMessageError, showMessageSuccess } from '@services/showMessage';
import { add, format, parseISO } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import styled, { css } from 'styled-components/native';

export type OrderDetailsProp = NativeStackNavigationProp<
  AppRootParams,
  'PROFILE'
>;

const OrderDetails = () => {
  const { params } = useRoute<RouteProp<ParamListBase & InfoNFT>>();
  const [copy, setCopy] = useState<boolean>(false);
  const [textCopied, setTextCopied] = useState<string>('');
  const detail: Order = params['detail'];
  const infoNFT: InfoNFT = params['infoNFT'];
  const shouldShowStatus: boolean = params['shouldShowStatus'] || false;
  const { IcCopy, IcEthereum } = Images;
  const navigation = useNavigation<OrderDetailsProp>();

  const handleCopy = (value) => {
    Clipboard.setString(value);
    setTextCopied(value);
    setCopy(!copy);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (copy) {
        setCopy(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [copy]);

  useEffect(() => {
    if (shouldShowStatus) {
      if (STATUS[detail?.status] === STATUS.COMPLETED) {
        showMessageSuccess(SUCCESS.RENTED_NFT);
      }

      if (STATUS[detail?.status] === STATUS.FAILED) {
        showMessageError(ERROR.ER_PAYMENT_FAILED);
      }
    }
  }, [detail, shouldShowStatus]);

  const handleTail = (val: string) => {
    if (!val || val?.length < 15) return val;
    return `${val.slice(0, 6)}...${val.slice(val.length - 4, val.length)}`;
  };

  const renderDescription = () => {
    switch (STATUS[detail?.status]) {
      case STATUS.COMPLETED:
        return (
          <Container mt={4} flexRow justifySpaceBetween>
            {detail?.createdAt && (
              <Description
                fontSize={14}
                fontStyle="normal"
                fontWeight="500"
                color={Colors.textLevel1}
              >
                From:{' '}
                <Description
                  fontSize={14}
                  fontStyle="normal"
                  fontWeight="500"
                  color={Colors.textLevel3}
                >
                  {formDateWithoutTime(detail?.createdAt)}
                </Description>
              </Description>
            )}
            {detail?.receivingNftDate && (
              <Description
                fontSize={14}
                fontStyle="normal"
                fontWeight="500"
                color={Colors.textLevel1}
              >
                To:{' '}
                <Description
                  fontSize={14}
                  fontStyle="normal"
                  fontWeight="500"
                  color={Colors.textLevel3}
                >
                  {detail?.receivingNftDate &&
                    detail?.pickedDuration &&
                    format(
                      add(parseISO(detail?.receivingNftDate), {
                        seconds: detail?.pickedDuration,
                      }),
                      'dd/MM/yyyy'
                    )}
                </Description>
              </Description>
            )}
          </Container>
        );
      default:
        break;
    }
  };

  const handleBack = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: MainTab.HOME }],
    });
  };

  const renderButton = () => {
    switch (STATUS[detail?.status]) {
      case STATUS.PROCESSING:
        return (
          <ButtonBox>
            <ButtonHandle
              disabled={true}
              style={{ backgroundColor: Colors.primaryOrangeMinus5 }}
            >
              <TitleHandle
                fontWeight="600"
                fontSize={16}
                color={Colors.background}
              >
                Processing
              </TitleHandle>
            </ButtonHandle>
          </ButtonBox>
        );
      default:
        return (
          <ButtonBox>
            <ButtonHandle onPress={handleBack}>
              <TitleHandle
                fontWeight="600"
                fontSize={16}
                color={Colors.background}
              >
                Back to Homepage
              </TitleHandle>
            </ButtonHandle>
          </ButtonBox>
        );
    }
  };

  const renderDate = () => {
    switch (STATUS[detail?.status]) {
      case STATUS.COMPLETED:
        return (
          <>
            <Container flexRow justifySpaceBetween alignCenter mb={2} mx={4}>
              <Description
                fontSize={14}
                fontWeight="500"
                fontStyle="normal"
                color={Colors.textLevel1}
              >
                Transaction Hash
              </Description>
              <Container flexRow alignCenter>
                <Details
                  fontSize={14}
                  fontWeight="600"
                  fontStyle="normal"
                  color={Colors.blue}
                  mr={1}
                >
                  {handleTail(detail?.txHash)}
                </Details>
                <ButtonCopy onPress={() => handleCopy(detail?.txHash)}>
                  <IcCopy />
                </ButtonCopy>
                {copy && textCopied === detail?.txHash ? (
                  <View
                    style={{
                      backgroundColor: Colors.foreground,
                      padding: 8,
                      right: 20,
                      borderRadius: 8,
                      position: 'absolute',
                    }}
                  >
                    <Body3 fontWeight="400" fontSize={14} color={Colors.white}>
                      Copied
                    </Body3>
                  </View>
                ) : null}
              </Container>
            </Container>
            <Container flexRow justifySpaceBetween alignCenter mb={2} mx={4}>
              <Description
                fontSize={14}
                fontWeight="500"
                fontStyle="normal"
                color={Colors.textLevel1}
              >
                Payment date
              </Description>
              <Description
                fontSize={14}
                fontWeight="400"
                fontStyle="normal"
                color={Colors.textLevel3}
              >
                {format(parseISO(detail?.createdAt), 'HH:mm - dd/MM/yyyy')}
              </Description>
            </Container>

            <Container flexRow justifySpaceBetween alignCenter mx={4} mb={2}>
              <Description
                fontSize={14}
                fontWeight="500"
                fontStyle="normal"
                color={Colors.textLevel1}
              >
                Receiving NFT date
              </Description>
              <Details
                fontSize={14}
                fontWeight="400"
                fontStyle="normal"
                color={Colors.textLevel3}
              >
                {format(
                  parseISO(detail?.receivingNftDate),
                  'HH:mm - dd/MM/yyyy'
                )}
              </Details>
            </Container>
          </>
        );
      default:
        return (
          <Container flexRow justifySpaceBetween alignCenter mx={4} mb={4}>
            <Description
              fontSize={14}
              fontWeight="500"
              fontStyle="normal"
              color={Colors.textLevel1}
            >
              Transaction Hash
            </Description>
            <Container flexRow alignCenter>
              <Details
                fontSize={14}
                fontWeight="600"
                fontStyle="normal"
                color={Colors.blue}
                mr={1}
              >
                {handleTail(detail?.txHash)}
              </Details>
              {copy && textCopied === detail?.txHash ? (
                <View
                  style={{
                    backgroundColor: Colors.foreground,
                    right: 20,
                    padding: 8,
                    borderRadius: 8,
                    position: 'absolute',
                  }}
                >
                  <Body3 fontWeight="400" fontSize={14} color={Colors.white}>
                    Copied
                  </Body3>
                </View>
              ) : null}
              <ButtonCopy onPress={() => handleCopy(detail?.txHash)}>
                <IcCopy />
              </ButtonCopy>
            </Container>
          </Container>
        );
    }
  };

  return (
    <DetailContainer>
      <ScrollView>
        <Information>
          <Container>
            <Container flexRow justifySpaceBetween>
              <Description
                fontSize={14}
                fontWeight="500"
                fontStyle="normal"
                color={Colors.textLevel1}
              >
                Order Status
              </Description>
              <Status status={STATUS[detail?.status]}>
                <StatusText status={STATUS[detail?.status]}>
                  {STATUS[detail?.status]}
                </StatusText>
              </Status>
            </Container>
            {renderDescription()}
            <Container mt={4} flexRow>
              <ImageNFT
                detailNft={infoNFT}
                resolution={Resolution.VeryLow}
                size={88}
              />
              <Container ml={4} style={{ flex: 1 }}>
                <Container flexRow alignCenter mb={1}>
                  <ImageAvatar
                    source={
                      infoNFT?.avatarOfOwner
                        ? { uri: infoNFT?.avatarOfOwner }
                        : require('../../assets/images/img_avatar.png')
                    }
                  />
                  <Description
                    fontSize={14}
                    fontWeight="400"
                    fontStyle="normal"
                    color={Colors.textLevel2}
                  >
                    {infoNFT?.ownerName ?? 'Lender Name'}
                  </Description>
                </Container>
                <Description
                  fontSize={14}
                  fontWeight="600"
                  fontStyle="normal"
                  color={Colors.textLevel1}
                  style={{ flexShrink: 1 }}
                >
                  {infoNFT?.name}
                </Description>
              </Container>
            </Container>
            <RentalDuration flexRow justifyCenter mt={4}>
              <Details
                fontSize={12}
                fontWeight="400"
                fontStyle="normal"
                color={Colors.textLevel3}
                pa={2}
              >
                Rental Duration:{' '}
                <Details fontWeight="600">{detail?.pickedLabel}</Details>
              </Details>
            </RentalDuration>
            <Container
              mt={4}
              style={{
                borderWidth: 1,
                borderRadius: 16,
                borderColor: Colors.strokeLevel3,
              }}
            >
              <Description
                fontSize={14}
                fontWeight="700"
                fontStyle="normal"
                color={Colors.textLevel1}
                ma={4}
              >
                Payment Details
              </Description>
              <Divider />
              <Container flexRow justifySpaceBetween alignCenter ma={4}>
                <Description
                  fontSize={14}
                  fontWeight="500"
                  fontStyle="normal"
                  color={Colors.textLevel1}
                >
                  Rental Price
                </Description>
                <Container flexRow alignCenter>
                  <IcEthereum width={20} height={20} />
                  <Details
                    fontSize={12}
                    fontWeight="600"
                    fontStyle="normal"
                    color={Colors.textLevel2}
                  >
                    {' '}
                    {detail?.totalPrice / Math.pow(10, 18)}
                  </Details>
                </Container>
              </Container>
            </Container>
            <Container
              mt={4}
              style={{
                borderWidth: 1,
                borderRadius: 16,
                borderColor: Colors.strokeLevel3,
              }}
            >
              <Description
                fontSize={14}
                fontWeight="700"
                fontStyle="normal"
                color={Colors.textLevel1}
                ma={4}
              >
                Transaction Information
              </Description>
              <Divider />
              <Container
                flexRow
                justifySpaceBetween
                alignCenter
                mt={4}
                mx={4}
                mb={2}
              >
                <Description
                  fontSize={14}
                  fontWeight="500"
                  fontStyle="normal"
                  color={Colors.textLevel1}
                >
                  Order ID
                </Description>
                <Container flexRow alignCenter>
                  <Details
                    fontSize={14}
                    fontWeight="600"
                    fontStyle="normal"
                    color={Colors.textLevel3}
                    mr={1}
                  >
                    {handleTail(detail?.id)}
                  </Details>
                </Container>
              </Container>
              {renderDate()}
              {infoNFT?.wrappedContractAddress ? (
                <Container
                  flexRow
                  justifySpaceBetween
                  alignCenter
                  mx={4}
                  mb={2}
                >
                  <Description
                    fontSize={14}
                    fontWeight="500"
                    fontStyle="normal"
                    color={Colors.textLevel1}
                  >
                    Wrapped Token Address
                  </Description>
                  <Container flexRow alignCenter>
                    <Details
                      fontSize={14}
                      fontWeight="600"
                      fontStyle="normal"
                      color={Colors.blue}
                      mr={1}
                    >
                      {handleTail(infoNFT?.wrappedContractAddress)}
                    </Details>
                    <ButtonCopy
                      onPress={() =>
                        handleCopy(infoNFT?.wrappedContractAddress)
                      }
                    >
                      <IcCopy />
                    </ButtonCopy>
                    {copy && textCopied === infoNFT?.wrappedContractAddress ? (
                      <View
                        style={{
                          backgroundColor: Colors.foreground,
                          padding: 8,
                          right: 20,
                          borderRadius: 8,
                          position: 'absolute',
                        }}
                      >
                        <Body3
                          fontWeight="400"
                          fontSize={14}
                          color={Colors.white}
                        >
                          Copied
                        </Body3>
                      </View>
                    ) : null}
                  </Container>
                </Container>
              ) : (
                <Container mb={1} />
              )}
              {infoNFT?.wrappedTokenId ? (
                <Container
                  flexRow
                  justifySpaceBetween
                  alignCenter
                  mx={4}
                  mb={4}
                >
                  <Description
                    fontSize={14}
                    fontWeight="500"
                    fontStyle="normal"
                    color={Colors.textLevel1}
                  >
                    Wrapped Token ID
                  </Description>
                  <Container flexRow alignCenter>
                    <Details
                      fontSize={14}
                      fontWeight="600"
                      fontStyle="normal"
                      color={Colors.blue}
                      mr={1}
                    >
                      {handleTail(infoNFT?.wrappedTokenId)}
                    </Details>
                    <ButtonCopy
                      onPress={() => handleCopy(infoNFT?.wrappedTokenId)}
                    >
                      <IcCopy />
                    </ButtonCopy>
                    {copy && textCopied === infoNFT?.wrappedTokenId ? (
                      <View
                        style={{
                          backgroundColor: Colors.foreground,
                          padding: 8,
                          right: 20,
                          borderRadius: 8,
                          position: 'absolute',
                        }}
                      >
                        <Body3
                          fontWeight="400"
                          fontSize={14}
                          color={Colors.white}
                        >
                          Copied
                        </Body3>
                      </View>
                    ) : null}
                  </Container>
                </Container>
              ) : (
                <Container mb={1} />
              )}
            </Container>
          </Container>
        </Information>
        {/* <PopupLoadingMetamask visible={loading && shouldShowStatus} /> */}
      </ScrollView>
      {renderButton()}
    </DetailContainer>
  );
};

export default OrderDetails;

const Container = styled(View)``;

const Divider = styled(View)`
  height: 1.5px;
  background-color: ${Colors.strokeLevel3};
`;

const DetailContainer = styled(View)`
  flex: 1;
  padding-top: 24px;
`;

const Information = styled(View)`
  background-color: ${Colors.background};
  padding: 16px;
  flex: 1;
`;

const ButtonBox = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  padding: 16px;
`;

const ButtonHandle = styled(TouchableOpacity)`
  flex: 1;
  padding: 10px 16px;
  background-color: ${Colors.primaryOrange};
  border-radius: 8px;
`;

const TitleHandle = styled(Body2)`
  text-align: center;
  line-height: 24px;
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

const RentalDuration = styled(View)`
  background-color: ${Colors.background2};
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
  text-transform: uppercase;
  ${({ status }) => {
    switch (status) {
      case STATUS.UNAVAILABLE:
        return css`
          color: ${Colors.textLevel4};
        `;
      default:
        return css`
          color: ${Colors.white};
        `;
    }
  }}
`;

const ButtonCopy = styled(TouchableOpacity)``;
