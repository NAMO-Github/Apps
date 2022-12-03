import React, { FC } from 'react';
import {
  DefaultTheme,
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import { navigationService } from '../services/navigation';
import AppRoute from './App.route';
import { Colors } from '@namo-workspace/themes';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.white,
  },
};
const RootRoute: FC = () => {
  return (
    <NavigationContainer
      key="1"
      ref={(a: NavigationContainerRef<unknown>) => {
        navigationService.navigator = a;
      }}
      theme={MyTheme}
    >
      <AppRoute />
    </NavigationContainer>
  );
};

export default RootRoute;
