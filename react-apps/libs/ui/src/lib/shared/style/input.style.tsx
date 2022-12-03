import {
  Colors,
  ElementHeightFromSize,
  FontHeight,
  FontSize,
} from '@namo-workspace/themes';
import { Platform } from 'react-native';
import { css } from 'styled-components';

export type InputSize = 'small' | 'medium' | 'large';

export interface InputContainerStyle {
  isError?: boolean;
}
export interface InputStyle {
  size?: InputSize;
}

export const inputContainerStyle = css<InputContainerStyle>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-width: 1px;
  border-color: ${(props) =>
    props.isError ? Colors.primaryRed : Colors.strokeLevel3};
  border-radius: 8px;
  width: 100%;
  padding: ${Platform.OS === 'ios' ? '12px 15px' : '0px 15px'};
`;

export const inputStyle = css<InputStyle>`
  align-items: center;
  display: inline-flex;
  padding: 12px 16px;
  width: 100%;
  background: ${Colors.background};
  border: 1px solid ${Colors.strokeLevel3};
  border-radius: 8px;
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

  @media (max-width: 575.98px) {
    height: 32px;
  }
`;
// height: 48px;

export const modifierStyle = css`
  &:focus {
  }
  &:hover {
  }
`;

export const inputTextStyle = css`
  font-style: normal;
  font-weight: 400;
  font-size: ${FontSize.body2}px;
  color: ${Colors.textLevel1};

  @media (max-width: 575.98px) {
    font-size: ${FontSize.body4}px;
    line-height: ${FontHeight.body4}px;
  }
`;

export const inputPrefixStyle = css`
  margin-right: 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const inputSuffixStyle = css`
  margin-left: 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
