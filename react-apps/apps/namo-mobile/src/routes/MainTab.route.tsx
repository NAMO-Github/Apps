import React, { FC } from 'react';
import { MainTab } from './routes.constants';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParams } from './routes.model';
import ProfileStack from './Profile.route';
import { Colors } from '@namo-workspace/themes';
import { Images } from '@images';
import SearchStack from './SearchStack';
import MenuStack from './MenuStack';
import HomeStack from './HomeStack';

const {
  IcHome,
  IcHomeActive,
  IcSearch,
  IcSearchActive,
  IcUser,
  IcUserActive,
  IcMenu,
  IcMenuActive,
} = Images;

const BottomTab = createBottomTabNavigator<MainTabParams>();

const BottomTabNavigator: FC = () => {
  return (
    <BottomTab.Navigator
      screenOptions={() => ({
        tabBarShowLabel: false,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: Colors.white,
          borderBottomWidth: 1,
          borderBottomColor: Colors.strokeLevel3,
        },
        // unmountOnBlur: true,
      })}
      initialRouteName={MainTab.SEARCH_STACK}
    >
      <BottomTab.Screen
        name={MainTab.HOME}
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? <IcHomeActive /> : <IcHome />,
          headerShown: false,
        }}
      />
      <BottomTab.Screen
        name={MainTab.SEARCH_STACK}
        component={SearchStack}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? <IcSearchActive /> : <IcSearch />,
          headerShown: false,
        }}
      />
      <BottomTab.Screen
        name={MainTab.PROFILE_STACK}
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? <IcUserActive /> : <IcUser />,
          headerShown: false,
        }}
      />
      <BottomTab.Screen
        name={MainTab.MENU_STACK}
        component={MenuStack}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? <IcMenuActive /> : <IcMenu />,
          headerShown: false,
        }}
      />
    </BottomTab.Navigator>
  );
};

export default BottomTabNavigator;
