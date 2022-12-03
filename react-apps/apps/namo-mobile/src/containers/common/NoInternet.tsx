import { Colors } from '@namo-workspace/themes';
import { Body3, Body4 } from '@namo-workspace/ui/Typography';
import React, { FC } from 'react';
import styled from 'styled-components/native';
import IconNoInternet from '../../assets/images/common/ic_no_internet.svg';

const NoInternet: FC = () => {
  return (
    <Container>
      <IconNoInternet />
      <MainText fontWeight="600">No connection</MainText>
      <SubText>No internet connection found.</SubText>
      <SubText>Check your connection or try again.</SubText>
    </Container>
  );
};

export default NoInternet;

const Container = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 0 48px;
`;
const MainText = styled(Body3)`
  color: ${Colors.body3};
  margin: 5px 0;
`;
const SubText = styled(Body4)`
  text-align: center;
  color: ${Colors.body4};
`;
