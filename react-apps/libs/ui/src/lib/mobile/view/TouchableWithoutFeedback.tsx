import { ComponentType } from 'react';
import {
  TouchableOpacityProps,
  TouchableWithoutFeedback as RNTouchableWithoutFeedback,
} from 'react-native';
import { Spacing } from '../../shared/style/spacing.style';
import { Flex, Position } from '../../shared/style/position.style';
import { withAllStyleUtils } from '../../shared/hoc/style';

const TouchableWithoutFeedback: ComponentType<
  TouchableOpacityProps & Spacing & Flex & Position
> = withAllStyleUtils(RNTouchableWithoutFeedback);
export default TouchableWithoutFeedback;
