import styled from 'styled-components';
import { Colors } from '@namo-workspace/themes';
import { LabelHTMLAttributes, memo, PropsWithChildren, ReactNode } from 'react';
import { fontStyles, fontText } from '../shared/style/text.style';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  require?: boolean;
  tip?: ReactNode;
  label?: string;
  hiddenLabel?: boolean;
}

const Label = ({
  label,
  require = false,
  tip,
  hiddenLabel,
  children,
  ...props
}: PropsWithChildren<LabelProps>) => {
  return (
    <LabelContainer {...props}>
      <LabelText>
        <span className={`${hiddenLabel ? 'invisible' : ''}`}>{label}</span>
        {require && <RequireContainer>*</RequireContainer>}
        <TipStyle>{tip}</TipStyle>
      </LabelText>
      {children}
    </LabelContainer>
  );
};

const LabelContainer = styled.label`
  width: 100%;
  margin-bottom: 16px;
  align-items: center;
  color: ${Colors.foreground1};
`;

const LabelText = styled.span`
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
  text-transform: capitalize;
  font-weight: 600;
  ${fontText}

  @media (max-width: 575.98px) {
    ${fontStyles.body3}
  }
`;

const RequireContainer = styled.span`
  color: ${Colors.primaryRed};
  margin-left: 0.25rem;
`;

const TipStyle = styled.span`
  display: inherit;
  margin-left: 0.25rem;
  color: ${Colors.textLevel4};
  font-weight: 400;
`;

export default memo(Label);
