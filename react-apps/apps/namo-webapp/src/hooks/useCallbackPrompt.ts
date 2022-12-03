import { History, Transition } from 'history';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  UNSAFE_NavigationContext as NavigationContext,
  useLocation,
} from 'react-router-dom';

interface LastLocation {
  path: string;
  retry: () => void;
}

export type ExtendNavigator = Navigator & Pick<History, 'block'>;

export function useBlocker(blocker: (tx: Transition) => void, when = true) {
  const navigator = useContext(NavigationContext)
    .navigator as unknown as ExtendNavigator;

  useEffect(() => {
    if (!when) return;

    const unblock = navigator.block((tx) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          unblock();
          tx.retry();
        },
      } as Transition;

      blocker(autoUnblockingTx);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((tx.location.state as any)?.force) {
        autoUnblockingTx.retry();
      }
    });

    return unblock;
  }, [navigator, blocker, when]);
}

export function useCallbackPrompt(
  when: boolean
): [boolean, () => void, () => void] {
  const location = useLocation();
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [lastLocation, setLastLocation] = useState<LastLocation>({
    path: '',
    retry: () => undefined,
  });

  const [confirmedNavigation, setConfirmedNavigation] = useState(false);

  const cancelNavigation = useCallback(() => {
    setShowPrompt(false);
  }, []);

  const handleBlockedNavigation = useCallback(
    (nextLocation: Transition) => {
      if (
        !confirmedNavigation &&
        nextLocation.location.pathname !== location.pathname
      ) {
        setShowPrompt(true);
        setLastLocation({
          path: nextLocation.location.pathname,
          retry: nextLocation.retry,
        });
        return false;
      }
      return true;
    },
    [confirmedNavigation, location]
  );

  const confirmNavigation = useCallback(() => {
    lastLocation.retry();
    setShowPrompt(false);
    setConfirmedNavigation(true);
  }, [lastLocation]);

  useBlocker(handleBlockedNavigation, when);

  return [showPrompt, confirmNavigation, cancelNavigation];
}
