import { fontStyles, fontText, withStyle } from '../shared/style/text.style';
import styled, { css, StyledComponentBase } from 'styled-components';
import { HTMLAttributes } from 'react';

const noMargin = css`
  margin: 0;
`;

export const H1: StyledComponentBase<
  'h2',
  HTMLAttributes<HTMLSpanElement>
> = withStyle(styled.h1``, fontText, fontStyles.h1, noMargin);

export const H2: StyledComponentBase<
  'h2',
  HTMLAttributes<HTMLSpanElement>
> = withStyle(styled.h2``, fontText, fontStyles.h2, noMargin);

export const H3: StyledComponentBase<
  'h3',
  HTMLAttributes<HTMLSpanElement>
> = withStyle(styled.h3``, fontText, fontStyles.h3, noMargin);
export const H4: StyledComponentBase<
  'h4',
  HTMLAttributes<HTMLSpanElement>
> = withStyle(styled.h4``, fontText, fontStyles.h4, noMargin);

export const Body1: StyledComponentBase<
  'p',
  HTMLAttributes<HTMLSpanElement>
> = withStyle(styled.p``, fontText, fontStyles.body1, noMargin);

export const Body2: StyledComponentBase<
  'p',
  HTMLAttributes<HTMLSpanElement>
> = withStyle(styled.p``, fontText, fontStyles.body2, noMargin);

export const Body3: StyledComponentBase<
  'p',
  HTMLAttributes<HTMLSpanElement>
> = withStyle(styled.p``, fontText, fontStyles.body3, noMargin);

export const Body4: StyledComponentBase<
  'p',
  HTMLAttributes<HTMLSpanElement>
> = withStyle(styled.p``, fontText, fontStyles.body4, noMargin);

export const Sub: StyledComponentBase<
  'p',
  HTMLAttributes<HTMLSpanElement>
> = withStyle(styled.p``, fontText, fontStyles.sub, noMargin);
