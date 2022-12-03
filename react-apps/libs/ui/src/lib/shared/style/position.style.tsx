import { css } from 'styled-components';

export type Position = Partial<{
  center: boolean;
  justifyStart: boolean;
  justifyEnd: boolean;
  justifyCenter: boolean;
  justifySpaceBetween: boolean;
  justifySpaceAround: boolean;
  alignStretch: boolean;
  alignStart: boolean;
  alignEnd: boolean;
  alignCenter: boolean;
  alignBaseLine: boolean;
  alignSelfStretch: boolean;
  alignSelfStart: boolean;
  alignSelfEnd: boolean;
  alignSelfCenter: boolean;
  alignSelfBaseLine: boolean;
}>;

export const PositionCss = css<Position>`
  ${(props) =>
    props.center &&
    css`
      justify-content: center;
      align-items: center;
    `})
  ${(props) =>
    props.justifyStart &&
    css`
      justify-content: flex-start;
    `})
  ${(props) =>
    props.justifyEnd &&
    css`
      justify-content: flex-end;
    `})
  ${(props) =>
    props.justifyCenter &&
    css`
      justify-content: center;
    `})
  ${(props) =>
    props.justifySpaceAround &&
    css`
      justify-content: space-around;
    `})
  ${(props) =>
    props.justifySpaceBetween &&
    css`
      justify-content: space-between;
    `})
  ${(props) =>
    props.alignStretch &&
    css`
      align-items: stretch;
    `})
  ${(props) =>
    props.alignStart &&
    css`
      align-items: flex-start;
    `})
  ${(props) =>
    props.alignEnd &&
    css`
      align-items: flex-end;
    `})
  ${(props) =>
    props.alignCenter &&
    css`
      align-items: center;
    `})
  ${(props) =>
    props.alignBaseLine &&
    css`
      align-items: baseline;
    `})
  ${(props) =>
    props.alignSelfStretch &&
    css`
      align-self: stretch;
    `})
  ${(props) =>
    props.alignSelfStart &&
    css`
      align-self: flex-start;
    `})
  ${(props) =>
    props.alignSelfEnd &&
    css`
      align-self: flex-end;
    `})
  ${(props) =>
    props.alignSelfCenter &&
    css`
      align-self: center;
    `})
  ${(props) =>
    props.alignSelfBaseLine &&
    css`
      align-self: baseline;
    `})
`;

export type Flex = Partial<{
  wrap: boolean;
  flexRow: boolean;
  flexRowReverse: boolean;
  flexColumn: boolean;
  flexColumnReverse: boolean;
  flexGrow: number | boolean;
  flexShrink: number | boolean;
  flexBasis: number | string;
}>;

export const FlexCss = css<Flex>`
  ${(props) =>
    props.wrap &&
    css`
      flex-wrap: wrap;
    `})
  ${(props) =>
    props.flexRow &&
    css`
      flex-direction: row;
    `})
  ${(props) =>
    props.flexRowReverse &&
    css`
      flex-direction: row-reverse;
    `})
  ${(props) =>
    props.flexColumn &&
    css`
      flex-direction: column;
    `})
  ${(props) =>
    props.flexColumnReverse &&
    css`
      flex-direction: column-reverse;
    `})
  ${(props) =>
    typeof props.flexGrow === 'boolean' && props.flexGrow
      ? css`
          flex-grow: 1;
        `
      : typeof props.flexGrow === 'number' &&
        props.flexGrow &&
        css`
          flex-grow: ${props.flexGrow};
        `})
  ${(props) =>
    typeof props.flexShrink === 'boolean' && props.flexShrink
      ? css`
          flex-shrink: 1;
        `
      : typeof props.flexShrink === 'number' &&
        props.flexShrink &&
        css`
          flex-shrink: ${props.flexShrink};
        `})
  ${(props) =>
    typeof props.flexBasis === 'number' && props.flexBasis
      ? css`
          flex-basis: ${props.flexBasis}px;
        `
      : props.flexBasis &&
        css`
          flex-basis: ${props.flexBasis};
        `})
`;
