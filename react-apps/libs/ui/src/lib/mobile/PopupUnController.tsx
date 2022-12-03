import { Colors } from '@namo-workspace/themes';
import React, { FC } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components';
import { Body1, Body2 } from './Typography';

export interface PopupProps {
  title?: string;
  logo?: React.ReactNode;
  description?: string;
  extraView?: React.ReactNode;
  visible: boolean;
  onRequestClose?: () => void;
}

const PopupUnController: FC<PopupProps> = (props) => {
  const { title, logo, description, extraView, visible, onRequestClose } =
    props;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
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
              {extraView ? <ExtraView>{extraView}</ExtraView> : null}
            </ModalField>
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

const ExtraView = styled(View)`
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const ModalField = styled(View)`
  padding: 16px 0px;
`;

const ModalLogo = styled(View)`
  align-items: center;
  margin-top: 16px;
`;

export default PopupUnController;
