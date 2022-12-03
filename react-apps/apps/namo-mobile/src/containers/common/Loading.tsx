import { Body3 } from '@namo-workspace/ui/Typography';
import React, { FC } from 'react';
import { Dimensions } from 'react-native';
import { Portal } from 'react-native-portalize';
import styled from 'styled-components/native';
import IcAppNamo from '../../assets/images/common/ic_app_namo.svg';

interface Props {
  visible: boolean;
  content?: string;
}

const { width, height } = Dimensions.get('window');

const Loading: FC<Props> = ({ visible, content = '' }) => {
  if (!visible) return null;
  return (
    <Portal>
      <Container>
        <BackDrop />
        <IcAppNamo />
        {content ? <Body3 mt={2}>{content}</Body3> : null}
      </Container>
    </Portal>
  );
};

export default Loading;

const Container = styled.View`
  width: ${width}px;
  height: ${height}px;
  align-items: center;
  justify-content: center;
`;

const BackDrop = styled.View`
  position: absolute;
  width: ${width}px;
  height: ${height}px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: gray;
  opacity: 0.5;
`;
