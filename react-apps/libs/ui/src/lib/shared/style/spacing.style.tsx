import { css } from 'styled-components';

export type Spacing = Partial<{
  mt: number;
  ml: number;
  mb: number;
  mr: number;
  ma: number;
  mx: number;
  my: number;
  pt: number;
  pl: number;
  pb: number;
  pr: number;
  pa: number;
  px: number;
  py: number;
}>;

const Space = 4;

export const SpaceCss = css<Spacing>`
  ${(props) =>
    props.ma &&
    css`
      margin: ${props.ma * Space}px;
    `}
  ${(props) =>
    props.mx &&
    css`
      margin-right: ${props.mx * Space}px;
      margin-left: ${props.mx * Space}px;
    `}
  ${(props) =>
    props.my &&
    css`
      margin-top: ${props.my * Space}px;
      margin-bottom: ${props.my * Space}px;
    `}
  ${(props) =>
    props.mt &&
    css`
      margin-top: ${props.mt * Space}px;
    `}
  ${(props) =>
    props.mb &&
    css`
      margin-bottom: ${props.mb * Space}px;
    `}
  ${(props) =>
    props.ml &&
    css`
      margin-left: ${props.ml * Space}px;
    `}
  ${(props) =>
    props.mr &&
    css`
      margin-right: ${props.mr * Space}px;
    `}
  ${(props) =>
    props.pa &&
    css`
      padding: ${props.pa * Space}px;
    `}
  ${(props) =>
    props.px &&
    css`
      padding-left: ${props.px * Space}px;
      padding-right: ${props.px * Space}px;
    `}
  ${(props) =>
    props.py &&
    css`
      padding-top: ${props.py * Space}px;
      padding-bottom: ${props.py * Space}px;
    `}
  ${(props) =>
    props.pt &&
    css`
      padding-top: ${props.pt * Space}px;
    `}
  ${(props) =>
    props.pb &&
    css`
      padding-bottom: ${props.pb * Space}px;
    `}
  ${(props) =>
    props.pl &&
    css`
      padding-left: ${props.pl * Space}px;
    `}
  ${(props) =>
    props.pr &&
    css`
      padding-right: ${props.pr * Space}px;
    `}
`;
