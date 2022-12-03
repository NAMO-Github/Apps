import styled from 'styled-components';
import { Colors, FontHeight, FontSize } from '@namo-workspace/themes';
import { memo, ReactNode } from 'react';
import { fontText } from '../shared/style/text.style';

export interface WarningProps {
  icon?: ReactNode;
  message?: string;
}

const Warning = ({ icon, message }: WarningProps) => {
  return (
    <WarningContainer>
      {icon}
      <Message>{message}</Message>
    </WarningContainer>
  );
};

const WarningContainer = styled.span`
  display: inline-flex;
  align-items: center;
  margin-top: 4px;
`;

const Message = styled.span`
  font-weight: 400;
  ${fontText};
  color: ${Colors.error};
  max-width: calc(100% - 24px);

  @media (max-width: 575.98px) {
    font-size: ${FontSize.body3}px;
    line-height: ${FontHeight.body3}px;
  }
`;

export default memo(Warning);
