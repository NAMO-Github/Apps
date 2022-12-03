import { Colors } from '@namo-workspace/themes';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import BottomTabNavigator from './MainTab.route';
import { AppRouter } from './routes.constants';
import { AppRootParams } from './routes.model';
import { publicProfileRoutes } from '@routes/reusableRoutes';

const Stack = createNativeStackNavigator<AppRootParams>();

const AppRoute: FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        orientation: 'portrait',
        headerBackTitleVisible: false,
        headerShown: false,
        animationTypeForReplace: 'push',
        headerStyle: {
          backgroundColor: Colors.white,
        },
        headerTintColor: Colors.foreground,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name={AppRouter.TABS}
        component={BottomTabNavigator}
        options={{
          title: '',
        }}
      />
      {/* {publicProfileRoutes(Stack)} */}
    </Stack.Navigator>
  );
};

export default AppRoute;
