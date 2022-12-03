import { Colors } from '@namo-workspace/themes';
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { ActivityIndicator, Modal, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import { Body1, Body2 } from './Typography';

export interface PopupProps {
  title?: string;
  logo?: React.ReactNode;
  description?: string;
  buttonCancel?: string;
  buttonHandle?: string;
  handleLoading?: boolean;

  handleFunction?(): void;
}

interface PopupHandler {
  open: (callback?: () => void) => void;
  close: () => void;
}

const Popup: ForwardRefRenderFunction<PopupHandler, PopupProps> = (
  props,
  ref
) => {
  const {
    title,
    logo,
    description,
    buttonCancel,
    buttonHandle,
    handleFunction = () => {
      // do nothing
    },
    handleLoading,
  } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const backActionRef = useRef(handleFunction);
  // backActionRef.current = handleFunction;

  function open(backAction?: () => void) {
    if (backAction) {
      backActionRef.current = backAction;
    } else {
      backActionRef.current = handleFunction;
    }
    setModalVisible(true);
  }
  function close() {
    setModalVisible(false);
  }
  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => close()}
      statusBarTranslucent={true}
    >
      <Overlay activeOpacity={1}>
        <Container>
          <ModalView>
            <ModalField>
              {title ? (
                <ModalTitle numberOfLines={2} fontWeight="700">
                  {title}
                </ModalTitle>
              ) : null}
              {logo && <ModalLogo>{logo}</ModalLogo>}
              {description ? (
                <ModalDescription numberOfLines={3}>
                  {description}
                </ModalDescription>
              ) : null}
            </ModalField>
            <ButtonBox>
              {buttonCancel ? (
                <ButtonCancel
                  style={buttonHandle ? { marginRight: 8 } : null}
                  onPress={close}
                  disabled={handleLoading || isLoading}
                >
                  <TitleCancel
                    fontWeight="600"
                    color={isLoading ? Colors.white : Colors.primaryOrange}
                  >
                    {buttonCancel}
                  </TitleCancel>
                </ButtonCancel>
              ) : null}
              {buttonHandle ? (
                <ButtonHandle
                  style={buttonCancel ? { marginLeft: 8 } : null}
                  onPress={async () => {
                    setIsLoading(true);
                    await backActionRef.current();
                    await close();
                    setIsLoading(false);
                  }}
                  disabled={handleLoading || isLoading}
                >
                  <TitleHandle fontWeight="600">{buttonHandle}</TitleHandle>
                  {isLoading && <Loading color={Colors.background} size={32} />}
                </ButtonHandle>
              ) : null}
            </ButtonBox>
          </ModalView>
        </Container>
      </Overlay>
    </Modal>
  );
};

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Overlay = styled(TouchableOpacity)`
  background-color: rgba(153, 153, 153, 0.5);
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: absolute;
  height: 100%;
`;

const ModalView = styled(View)`
  margin: 0 16px;
  background-color: white;
  border-radius: 15px;
  align-items: center;
  padding: 0px 16px 16px;
`;

const ModalTitle = styled(Body1)`
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  font-weight: 700;
  color: ${Colors.foreground};
`;

const ModalDescription = styled(Body2)`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  margin-top: 16px;
`;

const ButtonBox = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`;

const ModalField = styled(View)`
  padding: 16px 0px;
`;

const ButtonCancel = styled(TouchableOpacity)<{ disabled: boolean }>`
  flex: 1;
  padding: 10px 16px;
  border-color: ${Colors.primaryOrange};
  background-color: ${(props) =>
    props.disabled ? Colors.primaryOrangeMinus7 : Colors.white};
  border-width: ${(props) => (props.disabled ? 0 : 1)}px;
  border-radius: 8px;
`;

const ButtonHandle = styled(TouchableOpacity)<{ disabled: boolean }>`
  flex: 1;
  padding: 10px 16px;
  background-color: ${(props) =>
    props.disabled ? Colors.primaryOrangeMinus7 : Colors.primaryOrange};
  border-radius: 8px;
  position: relative;
`;

const Loading = styled(ActivityIndicator)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const TitleHandle = styled(Body2)`
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: ${Colors.white};
`;

const TitleCancel = styled(Body2)`
  text-align: center;
  font-size: 16px;
  font-weight: 600;
`;

const ModalLogo = styled(View)`
  align-items: center;
  margin-top: 16px;
`;

export default forwardRef(Popup);
