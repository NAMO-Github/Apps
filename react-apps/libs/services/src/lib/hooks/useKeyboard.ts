import { useEffect, useState } from 'react';
import { onKeyboardChange } from '@namo-workspace/utils';

export function useKeyboard() {
  const [showKeyboard, setShowKeyboard] = useState(false);
  useEffect(() => {
    return onKeyboardChange((show) => {
      setShowKeyboard(!!show);
    });
  }, []);
  return showKeyboard;
}
