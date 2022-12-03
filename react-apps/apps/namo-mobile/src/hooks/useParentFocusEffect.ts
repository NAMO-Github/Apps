import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

type EffectCallback = () => undefined | void | (() => void);
export default function useParentFocusEffect(effect: EffectCallback) {
  const navigation = useNavigation();

  useEffect(() => {
    const parent = navigation.getParent();
    return parent.addListener('focus', effect);
  }, [navigation, effect]);
}
