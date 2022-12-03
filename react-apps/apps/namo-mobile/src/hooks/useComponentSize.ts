import { useCallback, useState } from 'react';
import { ViewProps } from 'react-native';
interface Size {
  width: number;
  height: number;
}
const useComponentSize = () => {
  const [size, setSize] = useState<Size>(null);

  const onLayout = useCallback<NonNullable<ViewProps['onLayout']>>((event) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  }, []);

  return [size, onLayout];
};

export default useComponentSize;
