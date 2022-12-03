import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchStackParams } from './routes.model';
import { SearchRouter } from './routes.constants';
import { Colors } from '@namo-workspace/themes';
import SearchScreen from '@screens/search/Search';
import NoInternet from '@screens/noInternet/NoInternet';
import SearchNFT from '@screens/search/SearchNFT';
import {
  checkoutRoutes,
  nftDetailRoutes,
  publicProfileRoutes,
} from '@routes/reusableRoutes';
import HeaderLeft from '@containers/navigator/HeaderLeft';

const Stack = createNativeStackNavigator<SearchStackParams>();

const SearchStack: FC = () => {
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
      initialRouteName={SearchRouter.NFT_LIST}
    >
      <Stack.Screen
        name={SearchRouter.NFT_LIST}
        component={SearchScreen}
        options={{
          title: 'Search',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name={SearchRouter.NFT_SEARCH}
        component={SearchNFT}
        options={{
          title: 'Search',
          headerShown: true,
          headerBackVisible: false,
          presentation: 'transparentModal',
        }}
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

export default SearchStack;
