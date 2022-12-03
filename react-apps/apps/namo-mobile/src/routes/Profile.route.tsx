import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParams } from './routes.model';
import { ProfileRouter } from './routes.constants';
import { Colors } from '@namo-workspace/themes';
import Profile from '../screens/profile/Profile';
import More from '@screens/more/More';
import EditProfile from '@screens/profile/EditProfile';
import {
  checkoutRoutes,
  nftDetailRoutes,
  publicProfileRoutes,
} from '@routes/reusableRoutes';
import HeaderLeft from '@containers/navigator/HeaderLeft';

const Stack = createNativeStackNavigator<ProfileStackParams>();

const ProfileStack: FC = () => {
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
      initialRouteName={ProfileRouter.PROFILE}
    >
      <Stack.Screen
        name={ProfileRouter.PROFILE}
        component={Profile}
        options={{
          title: 'Profile',
          headerShown: true,
        }}
      />
      {nftDetailRoutes(Stack)}
      {checkoutRoutes(Stack)}
      {publicProfileRoutes(Stack)}
      <Stack.Screen
        name={ProfileRouter.MORE}
        component={More}
        options={{ title: 'More', headerShown: true }}
      />
      <Stack.Screen
        name={ProfileRouter.EDIT_PROFILE}
        component={EditProfile}
        options={{
          title: 'Edit Profile',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
