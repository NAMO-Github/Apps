import React from 'react';
import Images from '@images';
import styled from 'styled-components';
import View from '@namo-workspace/ui/view/View';
import { Body2 } from '@namo-workspace/ui/Typography';
import { Colors } from '@namo-workspace/themes';

const { IcAppNamo } = Images;

const LogoTitle = () => {
  return (
    <LogoContainer>
      <IcAppNamo />
      <LogoText fontWeight="600">NAMO</LogoText>
    </LogoContainer>
  );
};

const LogoContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const LogoText = styled(Body2)`
  margin-left: 8px;
  color: ${Colors.textLevel1};
`;

export default LogoTitle;
