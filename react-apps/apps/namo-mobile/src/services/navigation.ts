import { NavigationState } from '@react-navigation/native';
import { NavigationContainerRef } from '@react-navigation/core/lib/typescript/src/types';

export const getActiveRouteName = (state: NavigationState) => {
  const nextRoute = state.routes;
  if (nextRoute && nextRoute[state.index]?.state) {
    return getActiveRouteName(nextRoute[state.index].state as NavigationState);
  }
  return state.routes[state.index].name;
};

export const getActiveRoutes = (state: NavigationState) => {
  const nextRoute = state.routes;
  if (nextRoute && nextRoute[state.index]?.state) {
    return getActiveRoutes(nextRoute[state.index].state as NavigationState);
  }
  return state.routes;
};

export const navigationService: {
  // eslint-disable-next-line
  navigator?: NavigationContainerRef<any>;
} = {
  navigator: undefined,
};
