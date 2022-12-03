import { ParamListBase } from '@react-navigation/native';
import {
  AppRouter,
  MenuRouter,
  ProfileRouter,
  SearchRouter,
} from './routes.constants';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export interface ExtendParams extends ParamListBase {
  CONNECT_META_MASK: null;
}

export type AppRootParams = {
  [key in keyof Omit<typeof AppRouter, keyof ExtendParams>]: null;
} & ExtendParams;

export type ProfileStackParams = {
  [key in keyof Omit<typeof ProfileRouter, keyof ExtendParams>]: null;
} & ExtendParams;

export type SearchStackParams = {
  [key in keyof Omit<typeof SearchRouter, keyof ExtendParams>]: null;
} & ExtendParams;

export type MenuStackParams = {
  [key in keyof Omit<typeof MenuRouter, keyof ExtendParams>]: null;
} & ExtendParams;

export type MainTabParams = {
  HOME: null;
  SEARCH_STACK: null;
  PROFILE_STACK: null;
  MENU_STACK: null;
};

export type MainStackScreenProps<Screen extends keyof AppRootParams> =
  NativeStackScreenProps<AppRootParams, Screen>;

export type MainTabScreenProps<Screen extends keyof MainTabParams> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParams, Screen>,
    NativeStackScreenProps<AppRootParams>
  >;
