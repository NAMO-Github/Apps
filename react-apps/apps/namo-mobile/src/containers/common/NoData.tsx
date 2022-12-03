import { Colors } from '@namo-workspace/themes';
import { Body3, Body4 } from '@namo-workspace/ui/Typography';
import React, { FC } from 'react';
import styled from 'styled-components/native';
import IconNoData from '../../assets/images/common/ic_no_data.svg';

interface Props {
  title?: string;
  subTitle?: string;
}
const NoData: FC<Props> = ({ title, subTitle }) => {
  return (
    <Container>
      <IconNoData />
      <MainText fontWeight="600" color={Colors.body3}>
        {title || 'No data'}
      </MainText>
      <Body4 color={Colors.body4}>
        {subTitle || 'There are no NFTs for rent'}
      </Body4>
    </Container>
  );
};

export default NoData;

const Container = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
`;
const MainText = styled(Body3)`
  margin: 5px 0;
`;
