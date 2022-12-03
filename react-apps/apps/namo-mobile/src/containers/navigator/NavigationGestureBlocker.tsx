import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

interface Props {
  when: boolean;
}

const NavigationGestureBlocker = ({ when }: Props) => {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: !when,
    });
  }, [navigation, when]);
  return null;
};

export default NavigationGestureBlocker;
