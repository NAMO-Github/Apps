import { HeaderBackButtonProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import TouchableOpacity from '@namo-workspace/ui/view/TouchableOpacity';
import { Platform } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Images from '@images';

const { IcArrowLeftAndroid, IcArrowRight } = Images;

export function HeaderLeft({ canGoBack }: HeaderBackButtonProps) {
  const navigation = useNavigation();
  return canGoBack ? (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      hitSlop={{ top: 10, right: 10, left: 10, bottom: 10 }}
    >
      {Platform.OS === 'android' ? (
        <IcArrowLeftAndroid />
      ) : (
        <IcArrowRight style={{ transform: [{ rotate: '180deg' }] }} />
      )}
    </TouchableOpacity>
  ) : null;
}

export default HeaderLeft;
