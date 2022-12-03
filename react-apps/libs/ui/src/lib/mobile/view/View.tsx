import { ComponentType } from 'react';
import { View as RNView, ViewProps } from 'react-native';
import { Flex, Position } from '../../shared/style/position.style';
import { Spacing } from '../../shared/style/spacing.style';
import { withAllStyleUtils } from '../../shared/hoc/style';

const View: ComponentType<ViewProps & Spacing & Flex & Position> =
  withAllStyleUtils(RNView);
export default View;
