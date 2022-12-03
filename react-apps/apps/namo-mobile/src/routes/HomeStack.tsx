import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchStackParams } from './routes.model';
import { HomeRouter, SearchRouter } from './routes.constants';
import { Colors } from '@namo-workspace/themes';
import HomeScreen from '@screens/home/Home';
import NoInternet from '@screens/noInternet/NoInternet';
import {
  checkoutRoutes,
  nftDetailRoutes,
  publicProfileRoutes,
} from '@routes/reusableRoutes';
import HeaderLeft from '@containers/navigator/HeaderLeft';
import LogoTitle from '@containers/navigator/LogoTitle';

const Stack = createNativeStackNavigator<SearchStackParams>();

const HomeStack: FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        orientation: 'portrait',
        headerTitleAlign: 'center',
        headerBackTitleVisible: false,
        headerShown: false,
        animationTypeForReplace: 'push',
        headerStyle: {
          backgroundColor: Colors.white,
        },
        headerTintColor: Colors.foreground,
        headerShadowVisible: false,
        headerLeft: HeaderLeft,
      }}
      initialRouteName={HomeRouter.HOME}
    >
      <Stack.Screen
        name={HomeRouter.HOME}
        component={HomeScreen}
        options={() => ({
          headerTitle: LogoTitle,
          headerShown: true,
        })}
      />
      {nftDetailRoutes(Stack)}
      {publicProfileRoutes(Stack)}
      {checkoutRoutes(Stack)}
      <Stack.Screen
        name={SearchRouter.NO_INTERNET}
        component={NoInternet}
        options={{
          title: 'NAMO',
          headerShown: true,
          headerLeft: HeaderLeft,
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
