import React, { FC } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Keyboard, ViewProps } from 'react-native';
import { useKeyboard } from '@namo-workspace/services';
import TouchableWithoutFeedback from './TouchableWithoutFeedback';
import { Spacing } from '../../shared/style/spacing.style';
import { Flex, Position } from '../../shared/style/position.style';
import View from './View';
import { getStatusBarHeight } from 'react-native-status-bar-height';

interface Props {
  withHeader?: boolean;
  headerHeight?: number;
  withTabBar?: boolean;
  dismissKeyboardOnPress?: boolean;
}

const AppContainer: FC<ViewProps & Spacing & Flex & Position & Props> = ({
  children,
  style,
  withHeader = true,
  withTabBar = true,
  dismissKeyboardOnPress,
  headerHeight,
  ...other
}) => {
  const { bottom } = useSafeAreaInsets();
  const isKeyboardShow = useKeyboard();
  const tabBarHeight = withTabBar ? (!isKeyboardShow ? 90 : 0) : 0; // tab bar will hide when keyboard shown
  const paddingBottom = Math.max(bottom, 0) + tabBarHeight;
  const currentHeaderHeight = withHeader ? headerHeight ?? 58 : 0;
  const renderView = () => {
    return (
      <View
        flexGrow
        style={[
          {
            paddingTop: currentHeaderHeight + getStatusBarHeight(true),
            paddingBottom,
          },
          style,
        ]}
        {...other}
      >
        {children}
      </View>
    );
  };
  if (dismissKeyboardOnPress) {
    return (
      <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
        {renderView()}
      </TouchableWithoutFeedback>
    );
  }
  return renderView();
};

export default AppContainer;
