import { ComponentType } from 'react';
import styled from 'styled-components';
import { TextAlignment, TextAlignmentCss } from '../style/text.style';
import { Flex, FlexCss, Position, PositionCss } from '../style/position.style';
import { SpaceCss, Spacing } from '../style/spacing.style';

export function withTextAlignment<T>(Component: ComponentType<T>) {
  return styled(Component)<TextAlignment>`
    ${TextAlignmentCss}
  `;
}

export function withFlex<T>(Component: ComponentType<T>) {
  return styled(Component)<Flex>`
    ${FlexCss}
  `;
}

export function withPosition<T>(Component: ComponentType<T>) {
  return styled(Component)<Position>`
    ${PositionCss}
  `;
}

export function withSpacing<T>(Component: ComponentType<T>) {
  return styled(Component)<Spacing>`
    ${SpaceCss}
  `;
}

export function withAllStyleUtils<T>(Component: ComponentType<T>) {
  return styled(Component)<Spacing & Flex & Position>`
    ${SpaceCss}
    ${PositionCss}
    ${FlexCss}
  `;
}
