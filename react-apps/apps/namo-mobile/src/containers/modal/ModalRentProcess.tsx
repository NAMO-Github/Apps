import { DURATIONS, STATUS, UNITS } from '@constants/rent';
import ImageNFT from '@containers/common/ImageNFT';
import Images from '@images';
import {
  formatDateWithTime,
  formDateWithoutTime,
  InfoNFT,
} from '@namo-workspace/services';
import { Colors } from '@namo-workspace/themes';
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
  useState,
} from 'react';
import { Modal } from 'react-native';
import {
  ButtonBox,
  ButtonCancel,
  ButtonHandle,
  Container,
  Description,
  Details,
  Divider,
  ImageAvatar,
  ModalContainer,
  ModalField,
  ModalTitle,
  ModalView,
  Overlay,
  RentalDuration,
  Status,
  StatusText,
  TitleHandle,
} from './RentProcess.styled';

export interface PopupProps {
  title?: string;
  description?: string;
  buttonCancel?: string;
  buttonHandle?: string;
  handleFunction(): void;
  closeFunction?(): void;
  item: InfoNFT;
  disabled?: boolean;
}

interface PopupHandler {
  open: () => void;
  close: () => void;
}

const RentProcess: ForwardRefRenderFunction<PopupHandler, PopupProps> = (
  props,
  ref
) => {
  const {
    title,
    buttonCancel,
    buttonHandle,
    closeFunction,
    handleFunction,
    item,
    disabled,
    description,
  } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const { IcEthereum, IcCopy } = Images;
  function open() {
    setModalVisible(true);
  }
  function close() {
    setModalVisible(false);
  }
  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  const handleTail = (val: string) => {
    if (!val || val?.length < 15) return val;
    return `${val.slice(0, 6)}...${val.slice(val.length - 5, val.length - 1)}`;
  };

  const renderStatus = () => {
    switch (STATUS[item?.status]) {
      case STATUS.COMPLETED:
        return (
          <Container mt={6} flexRow justifySpaceBetween>
            {item?.startDate && (
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
                  {formDateWithoutTime(item?.startDate)}
                </Description>
              </Description>
            )}
            {item?.endDate && (
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
                  {formDateWithoutTime(item?.endDate)}
                </Description>
              </Description>
            )}
          </Container>
        );
      case STATUS.TOPAY:
        return (
          <Container mt={6}>
            <Description
              fontSize={14}
              fontWeight="400"
              fontStyle="normal"
              color={Colors.textLevel2}
              style={{ textAlign: 'center' }}
            >
              {description}
            </Description>
            <Container mt={8} flexRow justifySpaceBetween>
              <Description
                fontSize={14}
                fontWeight="500"
                fontStyle="normal"
                color={Colors.textLevel1}
              >
                Payment status
              </Description>
              <Status status={STATUS[item?.status]}>
                <StatusText status={STATUS[item?.status]}>
                  {STATUS[item?.status]}
                </StatusText>
              </Status>
            </Container>
          </Container>
        );
      case STATUS.UNAVAILABLE:
        return (
          <Container mt={6}>
            <Description
              fontSize={14}
              fontWeight="500"
              fontStyle="normal"
              color={Colors.textLevel2}
              style={{ textAlign: 'center' }}
            >
              {description}
            </Description>
          </Container>
        );
      default:
        return (
          <Container mt={6} flexRow justifySpaceBetween>
            <Description
              fontSize={14}
              fontWeight="500"
              fontStyle="normal"
              color={Colors.textLevel1}
            >
              Payment status
            </Description>
            <Status status={STATUS[item?.status]}>
              <StatusText status={STATUS[item?.status]}>
                {STATUS[item?.status]}
              </StatusText>
            </Status>
          </Container>
        );
    }
  };

  const renderDateInfo = () => {
    switch (STATUS[item?.status]) {
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
                Payment date
              </Description>
              <Description
                fontSize={14}
                fontWeight="400"
                fontStyle="normal"
                color={Colors.textLevel3}
              >
                {formatDateWithTime(item?.startDate)}
              </Description>
            </Container>

            <Container flexRow justifySpaceBetween alignCenter mx={4} mb={4}>
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
                {formatDateWithTime(item?.endDate)}
              </Details>
            </Container>
          </>
        );
      case STATUS.UNAVAILABLE:
        return (
          <>
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
                {formatDateWithTime(item?.startDate)}
              </Description>
            </Container>

            <Container flexRow justifySpaceBetween alignCenter mx={4} mb={4}>
              <Description
                fontSize={14}
                fontWeight="500"
                fontStyle="normal"
                color={Colors.textLevel1}
              >
                Refund amount
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
                  {item?.price + item?.price * 0.025}
                </Details>
              </Container>
            </Container>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ModalContainer>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => close()}
        statusBarTranslucent={true}
      >
        <Overlay activeOpacity={1} onPress={() => close()}>
          <ModalContainer>
            <ModalView>
              <ModalField mb={2}>
                {title ? (
                  <ModalTitle numberOfLines={2}>{title}</ModalTitle>
                ) : null}
              </ModalField>
              {renderStatus()}
              <Container mt={8} flexRow>
                <ImageNFT detailNft={item} size={88} />
                <Container ml={4} style={{ flex: 1 }}>
                  <Container flexRow alignCenter mb={1}>
                    <ImageAvatar
                      source={require('../../assets/images/img_avatar.png')}
                    />
                    <Description
                      fontSize={14}
                      fontWeight="400"
                      fontStyle="normal"
                      color={Colors.textLevel2}
                    >
                      {item?.ownerName ?? 'Lender Name'}
                    </Description>
                  </Container>
                  <Description
                    fontSize={14}
                    fontWeight="600"
                    fontStyle="normal"
                    color={Colors.textLevel1}
                    style={{ flexShrink: 1 }}
                  >
                    {item?.name}
                  </Description>
                </Container>
              </Container>
              <RentalDuration flexRow justifyCenter mt={8}>
                <Details
                  fontSize={12}
                  fontWeight="400"
                  fontStyle="normal"
                  color={Colors.textLevel3}
                  pa={2}
                >
                  Rental Duration:{' '}
                  <Details fontWeight="600">
                    {item?.duration && item?.unit
                      ? item?.duration / (86400 * DURATIONS[item?.unit])
                      : 0}{' '}
                    {item?.unit ? UNITS[item?.unit] : 'day'}
                  </Details>
                </Details>
              </RentalDuration>
              <Container
                mt={8}
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
                      color={Colors.blue}
                      mr={1}
                    >
                      {item?.blockNumber}
                    </Details>
                    <IcCopy />
                  </Container>
                </Container>
                <Container
                  flexRow
                  justifySpaceBetween
                  alignCenter
                  mb={2}
                  mx={4}
                >
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
                      {handleTail(item?.address)}
                    </Details>
                    <IcCopy />
                  </Container>
                </Container>
                <Container
                  flexRow
                  justifySpaceBetween
                  alignCenter
                  mb={2}
                  mx={4}
                >
                  <Description
                    fontSize={14}
                    fontWeight="500"
                    fontStyle="normal"
                    color={Colors.textLevel1}
                  >
                    Total Payment Amount
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
                      {item?.price + item?.price * 0.025}
                    </Details>
                  </Container>
                </Container>
                {renderDateInfo()}
              </Container>
              <ButtonBox mt={8}>
                {buttonCancel ? (
                  <ButtonCancel
                    style={buttonHandle ? { marginRight: 8 } : null}
                    onPress={() => {
                      closeFunction();
                      close();
                    }}
                  >
                    <TitleHandle
                      fontWeight="600"
                      fontSize={16}
                      color={Colors.primaryOrange}
                    >
                      {buttonCancel}
                    </TitleHandle>
                  </ButtonCancel>
                ) : null}
                {buttonHandle ? (
                  <ButtonHandle
                    style={
                      buttonCancel
                        ? { marginLeft: 8 }
                        : disabled
                        ? { backgroundColor: Colors.primaryOrangeMinus5 }
                        : null
                    }
                    onPress={() => {
                      handleFunction();
                      close();
                    }}
                    disabled={disabled}
                  >
                    <TitleHandle
                      fontWeight="600"
                      fontSize={16}
                      color={Colors.background}
                    >
                      {buttonHandle}
                    </TitleHandle>
                  </ButtonHandle>
                ) : null}
              </ButtonBox>
            </ModalView>
          </ModalContainer>
        </Overlay>
      </Modal>
    </ModalContainer>
  );
};

export default forwardRef(RentProcess);
