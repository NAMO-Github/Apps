import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MenuStackParams } from './routes.model';
import { MenuRouter } from './routes.constants';
import { Colors } from '@namo-workspace/themes';
import Menu from '@screens/menu/Menu';
import AboutUs from '@screens/about-us/AboutUs';
import Term from '@screens/term/Term';
import HeaderLeft from '@containers/navigator/HeaderLeft';
import FAQ from '@screens/faq/FAQ';
import Help from '@screens/help/Help';

const Stack = createNativeStackNavigator<MenuStackParams>();

const MenuStack: FC = () => {
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
      initialRouteName={MenuRouter.MENU}
    >
      <Stack.Screen
        name={MenuRouter.MENU}
        component={Menu}
        options={{
          title: 'Menu',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name={MenuRouter.ABOUT_US}
        component={AboutUs}
        options={{
          title: 'About Us',
          headerShown: true,
          headerLeft: HeaderLeft,
        }}
      />
      <Stack.Screen
        name={MenuRouter.TERM_POLICY}
        component={Term}
        options={{
          title: 'Terms & Conditions',
          headerShown: true,
          headerLeft: HeaderLeft,
        }}
      />
      <Stack.Screen
        name={MenuRouter.FAQ}
        component={FAQ}
        options={{
          title: 'FAQ',
          headerShown: true,
          headerLeft: HeaderLeft,
        }}
      />
      <Stack.Screen
        name={MenuRouter.HELP_CENTER}
        component={Help}
        options={{
          title: 'Help Centre',
          headerShown: true,
          headerLeft: HeaderLeft,
        }}
      />
    </Stack.Navigator>
  );
};

export default MenuStack;
