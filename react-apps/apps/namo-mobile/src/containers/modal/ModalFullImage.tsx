import React, { FC } from 'react';
import { Dimensions, Modal } from 'react-native';
import styled from 'styled-components/native';
import IconClear from '../../assets/images/common/ic_clear.svg';

interface Props {
  modalVisible: boolean;
  handleClose: () => void;
  imgUri: string;
}

const { width } = Dimensions.get('window');

const ModalFullImage: FC<Props> = ({ imgUri, modalVisible, handleClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={false}
      visible={modalVisible}
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <Container>
        <ButtonClose onPress={handleClose}>
          <IconClear />
        </ButtonClose>
        <ImageFullScreen resizeMode="contain" source={{ uri: imgUri }} />
      </Container>
    </Modal>
  );
};
export default ModalFullImage;

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const ButtonClose = styled.TouchableOpacity`
  position: absolute;
  top: 48px;
  right: 16px;
`;

const ImageFullScreen = styled.ImageBackground`
  width: ${width}px;
  height: ${width}px;
`;
