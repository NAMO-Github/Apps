import { Colors } from '@namo-workspace/themes';
import { Body3 } from '@namo-workspace/ui/Typography';
import React, { FC } from 'react';
import styled from 'styled-components/native';
import IcAppNamo from '../../assets/images/common/ic_app_namo.svg';

interface Props {
  title?: string;
  subTitle?: string;
}
const NamoLoading: FC<Props> = ({ title, subTitle }) => {
  return (
    <Container>
      <IcAppNamo />
      <MainText fontWeight="600" color={Colors.body3}>
        {title || 'Loading'}
      </MainText>
    </Container>
  );
};

export default NamoLoading;

const Container = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
`;
const MainText = styled(Body3)`
  margin: 5px 0;
`;
