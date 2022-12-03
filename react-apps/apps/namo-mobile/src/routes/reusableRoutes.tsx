import React from 'react';
import { ProfileRouter, SearchRouter } from '@routes/routes.constants';
import NFTForRent from '@screens/nft-for-rent/NFTForRent';
import {
  ParamListBase,
  StackNavigationState,
  TypedNavigator,
} from '@react-navigation/native';
import {
  NativeStackNavigationEventMap,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { NativeStackNavigatorProps } from 'react-native-screens/lib/typescript/native-stack/types';
import NFTDetailForRent from '@screens/nft-detail-for-rent/NFTDetailForRent';
import { limitTitleHeader } from '@namo-workspace/utils';
import NFTDetailScreen from '@screens/search/NFTDetailScreen';
import OrderDetails from '@screens/search/OrderDetails';
import Checkout from '@screens/search/Checkout';
import PublicProfileScreen from '@screens/profile/PublicProfile';
import HeaderLeft from '@containers/navigator/HeaderLeft';

type StackType<T extends ParamListBase> = TypedNavigator<
  T,
  StackNavigationState<ParamListBase>,
  NativeStackNavigationOptions,
  NativeStackNavigationEventMap,
  ({
    id,
    initialRouteName,
    children,
    screenListeners,
    screenOptions,
    ...rest
  }: NativeStackNavigatorProps) => JSX.Element
>;

export function nftDetailRoutes<T extends ParamListBase>(Stack: StackType<T>) {
  return [
    <Stack.Screen
      key={ProfileRouter.NFT_FOR_RENT}
      name={ProfileRouter.NFT_FOR_RENT}
      component={NFTForRent}
      options={{
        title: 'Set NFT for Rent',
        headerShown: true,
        headerLeft: HeaderLeft,
        headerTitleAlign: 'center',
      }}
    />,
    <Stack.Screen
      key={SearchRouter.NFT_DETAIL}
      name={SearchRouter.NFT_DETAIL}
      component={NFTDetailScreen}
      options={({ route }) => ({
        title: limitTitleHeader(route.params['title']),
        headerShown: true,
        headerLeft: HeaderLeft,
      })}
    />,
    <Stack.Screen
      key={ProfileRouter.NFT_DETAIL_FOR_RENT}
      name={ProfileRouter.NFT_DETAIL_FOR_RENT}
      component={NFTDetailForRent}
      options={({ route }) => ({
        title: limitTitleHeader(route.params['title']),
        headerShown: true,
        headerLeft: HeaderLeft,
      })}
    />,
  ];
}
export function checkoutRoutes<T extends ParamListBase>(Stack: StackType<T>) {
  return [
    <Stack.Screen
      key={SearchRouter.CHECKOUT}
      name={SearchRouter.CHECKOUT}
      component={Checkout}
      options={{
        title: 'Checkout',
        headerShown: true,
        headerLeft: HeaderLeft,
        headerTitleAlign: 'center',
      }}
    />,
    <Stack.Screen
      key={ProfileRouter.ORDER_DETAILS}
      name={ProfileRouter.ORDER_DETAILS}
      component={OrderDetails}
      options={{
        title: 'Order Details',
        headerShown: true,
        headerTitleAlign: 'center',
        headerLeft: HeaderLeft,
      }}
    />,
  ];
}
export function publicProfileRoutes<T extends ParamListBase>(
  Stack: StackType<T>
) {
  return [
    <Stack.Screen
      key={SearchRouter.PUBLIC_PROFILE}
      name={SearchRouter.PUBLIC_PROFILE}
      component={PublicProfileScreen}
      options={{
        title: '',
        headerShown: true,
        headerLeft: HeaderLeft,
      }}
    />,
  ];
}
