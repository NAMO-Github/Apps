import { ComponentType } from 'react';
import {
  TouchableOpacity as RNTouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { Spacing } from '../../shared/style/spacing.style';
import { Flex, Position } from '../../shared/style/position.style';
import { withAllStyleUtils } from '../../shared/hoc/style';

const TouchableOpacity: ComponentType<
  TouchableOpacityProps & Spacing & Flex & Position
> = withAllStyleUtils(RNTouchableOpacity);
export default TouchableOpacity;
