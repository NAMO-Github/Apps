import { Colors } from '@namo-workspace/themes';
import React, { FC } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import View from './view/View';
import styled from 'styled-components';
import Images from '../../assets/images';
import { Body1, Body2 } from './Typography';

export interface PopupProps {
  title?: string;
  logo?: React.ReactNode;
  description?: string;
  isVisible?: boolean;
  onClose: () => void;
  buttons: {
    title: string;
    loading: boolean;
    disabled: boolean;
    onPress: () => void;
    type: string;
  }[];
}

const { IcClear } = Images;

const PopUpExtra: FC<PopupProps> = (props) => {
  const { title, buttons, isVisible, onClose } = props;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => onClose()}
      statusBarTranslucent={true}
    >
      <Overlay activeOpacity={1}>
        <Container>
          <ModalView>
            <ButtonClose onPress={() => onClose()}>
              <IcClear />
            </ButtonClose>
            {title ? (
              <ModalTitle numberOfLines={2} fontWeight="700">
                {title}
              </ModalTitle>
            ) : null}

            <ButtonBox>
              {buttons.map((item) => (
                <ButtonHandle
                  key={item.type}
                  onPress={() => {
                    item.onPress();
                  }}
                  disabled={item.disabled || item.loading}
                >
                  <TitleHandle fontWeight="600" color={Colors.white}>
                    {item.loading ? '' : item.title}
                  </TitleHandle>
                  {item.loading && <Loading color={Colors.white} size={32} />}
                </ButtonHandle>
              ))}
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
  width: 90%;
`;

const Overlay = styled(TouchableOpacity)`
  background-color: rgba(153, 153, 153, 0.5);
  justify-content: center;
  align-items: center;
  width: 100%;
  position: absolute;
  height: 100%;
`;

const ModalView = styled(View)`
  background-color: white;
  border-radius: 15px;
  align-items: center;
  padding: 16px;
  width: 100%;
`;

const ButtonBox = styled(View)`
  width: 100%;
`;

const ButtonHandle = styled(Pressable)<{ disabled: boolean }>`
  margin-top: 10px;
  padding: 10px 16px;
  background-color: ${(props) =>
    props.disabled ? Colors.primaryOrangeMinus7 : Colors.primaryOrange};
  border-radius: 8px;
`;

const ButtonClose = styled(TouchableOpacity)`
  align-self: flex-end;
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
`;

const ModalTitle = styled(Body1)`
  font-size: 20px;
  text-align: center;
  font-weight: 700;
  color: ${Colors.foreground};
`;

export default PopUpExtra;
