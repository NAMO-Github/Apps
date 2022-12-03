/* eslint-disable @typescript-eslint/no-empty-function */
import ModalConfirm, {
  ModalConfirmProps,
} from '@components/Modal/ModalConfirm';
import { useBlocker } from '@hooks/useCallbackPrompt';
import { Transition } from 'history';
import { isNumber } from 'lodash';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { NavigateOptions, To, useNavigate } from 'react-router';
interface PromptModalContextValue {
  setModalProps?: React.Dispatch<React.SetStateAction<ModalConfirmProps>>;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}
export const PromptModalContext = createContext<PromptModalContextValue>({});

type Props = {
  children: ReactNode;
};
export function PromptModalProvider({ children }: Props) {
  const [modalProps, setModalProps] = useState<
    Omit<ModalConfirmProps, 'isOpen'>
  >({});

  const [isOpen, setIsOpen] = useState(false);

  return (
    <PromptModalContext.Provider value={{ setModalProps, setIsOpen }}>
      {children}
      <ModalConfirm isOpen={isOpen} {...modalProps} />
    </PromptModalContext.Provider>
  );
}

export const usePromptModal = (
  modalProps: Omit<ModalConfirmProps, 'isOpen'>,
  when?: boolean
) => {
  const { onClose, onOk } = modalProps;
  const retryFn = useRef(() => {});

  const { setModalProps, setIsOpen } = useContext(PromptModalContext);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);

  useEffect(() => {
    if (confirmedNavigation && retryFn) {
      retryFn.current();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmedNavigation]);

  const handleBlockNavigation = useCallback(
    ({ retry }: Transition) => {
      if (when) {
        const handleOk = () => {
          setConfirmedNavigation(true);
          onOk && onOk();
          setIsOpen && setIsOpen(false);
        };
        const handleClose = () => {
          setConfirmedNavigation(false);
          onClose && onClose();
          setIsOpen && setIsOpen(false);
        };
        setModalProps &&
          setModalProps({
            ...modalProps,
            onOk: handleOk,
            onClose: handleClose,
          });
        setIsOpen && setIsOpen(true);

        if (retryFn) retryFn.current = retry;
      } else {
        retry();
        if (retryFn)
          retryFn.current = () => {
            //
          };
      }
    },
    [modalProps, onClose, onOk, retryFn, setIsOpen, setModalProps, when]
  );

  useBlocker(handleBlockNavigation, !confirmedNavigation);
};

export const useNavigateWithoutPrompt = () => {
  const { setIsOpen } = useContext(PromptModalContext);
  const navigate = useNavigate();

  const navigateWithoutPrompt = useCallback(
    (to: To | number, options?: NavigateOptions) => {
      if (isNumber(to)) {
        navigate(to);
      } else {
        navigate(to, {
          ...options,
          state: { ...(options?.state || {}), force: true },
        });
      }
      setIsOpen && setIsOpen(false);
    },
    [navigate, setIsOpen]
  );

  return navigateWithoutPrompt;
};
