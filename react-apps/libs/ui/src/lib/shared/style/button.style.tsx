import {
  Colors,
  ElementHeightFromSize,
  FontHeight,
  FontSize,
} from '@namo-workspace/themes';
import { css } from 'styled-components';

export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonColor = 'main' | 'white';
// common
export const buttonStyle = css<{
  size?: ButtonSize;
  color?: ButtonColor;
}>`
  padding: 0 16px;
  border-radius: 8px;
  outline: none;
  ${(props) => {
    switch (props.size) {
      case 'small':
        return css`
          height: ${ElementHeightFromSize.small}px;
        `;
      case 'large':
        return css`
          height: ${ElementHeightFromSize.large}px;
        `;
      case 'medium':
      default:
        return css`
          height: ${ElementHeightFromSize.medium}px;
        `;
    }
  }};
  ${({ color }) => {
    switch (color) {
      case 'white':
        return buttonWhiteStyle;
      case 'main':
      default:
        return buttonMainStyle;
    }
  }};

  @media (max-width: 575.98px) {
    height: 32px;
  }
`;

export const textButtonStyle = css<{ size?: ButtonSize; color?: ButtonColor }>`
  font-size: ${FontSize.body2}px;
  line-height: ${FontHeight.body2}px;
  font-weight: 600;
  ${({ color }) => {
    switch (color) {
      case 'white':
        return textWhiteButtonStyle;
      case 'main':
      default:
        return textMainButtonStyle;
    }
  }};

  @media (max-width: 575.98px) {
    font-size: ${FontSize.body3}px;
    line-height: ${FontHeight.body3}px;
  }
`;

export const modifierStyle = css<{ color?: ButtonColor; isLoading?: boolean }>`
  display: inline-flex;
  align-items: center;
  cursor: ${(props) => (props.isLoading ? 'wait !important' : 'pointer')};
  ${({ color }) => {
    switch (color) {
      case 'white':
        return buttonWhiteModifierStyle;
      case 'main':
      default:
        return buttonMainModifierStyle;
    }
  }};
`;

// main button
export const buttonMainStyle = css`
  background: ${Colors.primaryOrange};
  border: none;
  min-width: 120px;
`;

export const textMainButtonStyle = css`
  color: ${Colors.white};
`;

export const buttonMainModifierStyle = css<{ isLoading?: boolean }>`
  transition: all 0.2ms;
  &:hover {
    background: ${Colors.primaryOrangePlus2};
  }
  &:active {
    background: ${Colors.primaryOrangePlus1};
  }
  &:disabled,
  &[disabled] {
    cursor: not-allowed;
    background: ${Colors.primaryOrangeMinus5};
  }
  ${(props) =>
    props.isLoading &&
    css`
      background: ${Colors.primaryOrangeMinus5} !important;
    `};
`;

// white button
export const buttonWhiteStyle = css`
  background: ${Colors.background};
  border: 1px solid ${Colors.primaryOrange};
  min-width: 120px;
`;

export const textWhiteButtonStyle = css`
  color: ${Colors.primaryOrange};
`;

export const buttonWhiteModifierStyle = css<{ isLoading?: boolean }>`
  transition: all 0.2ms;
  &:hover {
    background: ${Colors.primaryOrangeMinus7};
  }
  &:active {
    background: ${Colors.primaryOrangeMinus8};
  }
  &:disabled,
  &[disabled] {
    cursor: not-allowed;
    background: ${Colors.background};
    color: ${Colors.primaryOrangeMinus5};
    border-color: ${Colors.primaryOrangeMinus5};
  }
  ${(props) =>
    props.isLoading &&
    css`
      background: ${Colors.background} !important;
    `};
`;

export const buttonPrefixStyle = css`
  margin-right: 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const buttonSuffixStyle = css`
  margin-left: 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
