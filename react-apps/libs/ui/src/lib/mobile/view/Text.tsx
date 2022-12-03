import { Text as RNText, TextProps } from 'react-native';
import { withSpacing, withTextAlignment } from '../../shared/hoc/style';
import { Spacing } from '../../shared/style/spacing.style';
import { TextAlignment, withStyle } from '../../shared/style/text.style';
import { css, StyledComponentBase } from 'styled-components';
import { Inter } from '../../../../../themes/src/lib/fonts';

const defaultFontStyle = css`
  font-family: ${Inter.Regular};
`;

const Text: StyledComponentBase<
  typeof RNText,
  TextProps & Spacing & TextAlignment
> = withStyle(withTextAlignment(withSpacing(RNText)), defaultFontStyle);
export default Text;
