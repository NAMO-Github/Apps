import styled, {
  css,
  DefaultTheme,
  FlattenInterpolation,
  FlattenSimpleInterpolation,
  ThemedStyledProps,
} from 'styled-components';
import { FontHeight, FontSize } from '@namo-workspace/themes';
import { ComponentType } from 'react';
import { TextStyle } from 'react-native';

export type TextAlignment = Partial<{
  center: boolean;
  left: boolean;
  right: boolean;
  wrap: boolean;
}>;
export const TextAlignmentCss = css<TextAlignment>`
  ${(props) =>
    props.center &&
    css`
      text-align: center;
    `};
  ${(props) =>
    props.left &&
    css`
      text-align: left;
    `};
  ${(props) =>
    props.right &&
    css`
      text-align: right;
    `};
  ${(props) =>
    props.wrap === false &&
    css`
      white-space: nowrap;
    `};
`;

export const fontText = css`
  font-size: ${FontSize.body2}px;
  line-height: ${FontHeight.body2}px;
`;

export const fontStyles = {
  h1: css`
    font-size: ${FontSize.h1}px;
    line-height: ${FontHeight.h1}px;
  `,
  h2: css`
    font-size: ${FontSize.h2}px;
    line-height: ${FontHeight.h2}px;
  `,
  h3: css`
    font-size: ${FontSize.h3}px;
    line-height: ${FontHeight.h3}px;
  `,
  h4: css`
    font-size: ${FontSize.h4}px;
    line-height: ${FontHeight.h4}px;
  `,
  body1: css`
    font-size: ${FontSize.body1}px;
    line-height: ${FontHeight.body1}px;
  `,
  body2: css`
    font-size: ${FontSize.body2}px;
    line-height: ${FontHeight.body2}px;
  `,
  body3: css`
    font-size: ${FontSize.body3}px;
    line-height: ${FontHeight.body3}px;
  `,
  body4: css`
    font-size: ${FontSize.body4}px;
    line-height: ${FontHeight.body4}px;
  `,
  sub: css`
    font-size: ${FontSize.sub}px;
    line-height: ${FontHeight.sub}px;
  `,
};

export function withStyle<T, Y extends TextStyle>(
  component: ComponentType<T>,
  ...styles:
    | FlattenSimpleInterpolation[]
    | FlattenInterpolation<ThemedStyledProps<Y, DefaultTheme>>
) {
  return styled(component)`
    ${styles}
  `;
}
