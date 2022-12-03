import {
  fontStyles,
  fontText,
  TextAlignment,
  withStyle,
} from '../shared/style/text.style';
import Text from './view/Text';
import { Text as RNText, TextProps, TextStyle } from 'react-native';
import { Spacing } from '../shared/style/spacing.style';
import { css, StyledComponentBase } from 'styled-components';
import { FontSize, Inter } from '@namo-workspace/themes';

type FontWeight = TextStyle['fontWeight'];
type FontStyle = TextStyle['fontStyle'];
type Color = string;
type FontSize = TextStyle['fontSize'];

interface FontWeightStyle {
  fontWeight?: FontWeight;
  fontStyle?: FontStyle;
  color?: Color;
  fontSize?: FontSize;
}

interface Fonts {
  Regular: string;
  Italic: string;
  Light: string;
  LightItalic: string;
  ExtraLight: string;
  ExtraLightItalic: string;
  Bold: string;
  BoldItalic: string;
  ExtraBold: string;
  ExtraBoldItalic: string;
  Medium: string;
  MediumItalic: string;
  SemiBoldItalic: string;
  SemiBold: string;
  Thin: string;
  ThinItalic: string;
}

export function getFonts(
  font: Partial<Fonts>,
  fontWeight: FontWeight = '400',
  fontStyle?: FontStyle
) {
  const sizeToFontText = {
    normal: 'Normal',
    bold: 'Bold',
    medium: 'Medium',
    '100': 'Thin',
    '200': 'ExtraLight',
    '300': 'Light',
    '400': 'Regular',
    '500': 'Medium',
    '600': 'SemiBold',
    '700': 'Bold',
    '800': 'ExtraBold',
    '900': 'Black',
  };
  const fontStyleToText = {
    normal: '',
    italic: 'Italic',
  };
  const weight = sizeToFontText[fontWeight!] || 'Regular';
  const size = fontStyleToText[fontStyle!] || '';
  return font[(weight + size) as keyof typeof font] ?? font.Regular;
}

const fontWeightStyle = css<FontWeightStyle>`
  font-family: ${(props) =>
    getFonts(Inter, props.fontWeight ?? '400', props.fontStyle ?? 'normal')};
  ${(props) =>
    props.fontSize
      ? css`
          font-size: ${props.fontSize}px;
        `
      : ''};
  ${(props) =>
    props.color
      ? css`
          color: ${props.color};
        `
      : ''};
`;

export const H1: StyledComponentBase<
  typeof RNText,
  TextProps,
  Spacing & TextAlignment & FontWeightStyle
> = withStyle(Text, fontText, fontStyles.h1, fontWeightStyle);

export const H2: StyledComponentBase<
  typeof RNText,
  TextProps,
  Spacing & TextAlignment & FontWeightStyle
> = withStyle(Text, fontText, fontStyles.h2, fontWeightStyle);

export const H3: StyledComponentBase<
  typeof RNText,
  TextProps,
  Spacing & TextAlignment & FontWeightStyle
> = withStyle(Text, fontText, fontStyles.h3, fontWeightStyle);

export const H4: StyledComponentBase<
  typeof RNText,
  TextProps,
  Spacing & TextAlignment & FontWeightStyle
> = withStyle(Text, fontText, fontStyles.h4, fontWeightStyle);

export const Body1: StyledComponentBase<
  typeof RNText,
  TextProps,
  Spacing & TextAlignment & FontWeightStyle
> = withStyle(Text, fontText, fontStyles.body1, fontWeightStyle);

export const Body2: StyledComponentBase<
  typeof RNText,
  TextProps,
  Spacing & TextAlignment & FontWeightStyle
> = withStyle(Text, fontText, fontStyles.body2, fontWeightStyle);

export const Body3: StyledComponentBase<
  typeof RNText,
  TextProps,
  Spacing & TextAlignment & FontWeightStyle
> = withStyle(Text, fontText, fontStyles.body3, fontWeightStyle);

export const Body4: StyledComponentBase<
  typeof RNText,
  TextProps,
  Spacing & TextAlignment & FontWeightStyle
> = withStyle(Text, fontText, fontStyles.body4, fontWeightStyle);

export const Sub: StyledComponentBase<
  typeof RNText,
  TextProps,
  Spacing & TextAlignment & FontWeightStyle
> = withStyle(Text, fontText, fontStyles.sub, fontWeightStyle);
