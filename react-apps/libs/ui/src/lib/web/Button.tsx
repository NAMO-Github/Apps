import React, { ButtonHTMLAttributes, FC, memo } from 'react';
import styled from 'styled-components';
import { ReactComponent as IconLoading } from '../../assets/images/ic_loading.svg';
import { withSpacing } from '../shared/hoc/style';
import {
  ButtonColor,
  buttonPrefixStyle,
  ButtonSize,
  buttonStyle,
  buttonSuffixStyle,
  modifierStyle,
  textButtonStyle,
} from '../shared/style/button.style';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'prefix'> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  size?: ButtonSize;
  color?: ButtonColor;
  isLoading?: boolean;
}

const Button: FC<ButtonProps> = ({
  prefix,
  suffix,
  color = 'main',
  children,
  isLoading,
  onClick,
  ...rest
}) => {
  return (
    <ButtonContainer
      color={color}
      isLoading={isLoading}
      onClick={!isLoading ? onClick : undefined}
      {...rest}
    >
      {!!prefix && <PrefixStyled>{prefix}</PrefixStyled>}
      {!!children && (
        <ChildrenContainer>
          {isLoading && (
            <span className="me-2">
              <IconLoading width={24} height={24} />
            </span>
          )}
          {children}
        </ChildrenContainer>
      )}
      {!!suffix && <SuffixStyled>{suffix}</SuffixStyled>}
    </ButtonContainer>
  );
};

const ButtonContainer = styled.button<ButtonProps>`
  ${buttonStyle};
  ${textButtonStyle};
  ${modifierStyle};
`;

const PrefixStyled = styled.span`
  ${buttonPrefixStyle}
`;
const SuffixStyled = styled.span`
  ${buttonSuffixStyle}
`;
const ChildrenContainer = styled.span`
  flex: 1;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: center;
`;
export default memo(withSpacing<ButtonProps>(Button));
