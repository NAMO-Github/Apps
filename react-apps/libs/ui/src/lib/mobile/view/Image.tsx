import { ComponentType } from 'react';
import { Image as RNImage, ImageProps } from 'react-native';
import { Spacing } from '../../shared/style/spacing.style';
import { withSpacing } from '../../shared/hoc/style';

const Image: ComponentType<ImageProps & Spacing> = withSpacing(RNImage);
export default Image;
