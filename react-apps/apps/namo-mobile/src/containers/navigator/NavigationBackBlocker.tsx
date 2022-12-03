import React, { useEffect, useRef } from 'react';
import { CommonActions, useNavigation } from '@react-navigation/native';
import Popup from '@namo-workspace/ui/Popup';

interface Props {
  when: boolean;
  getCanByPass: () => boolean;
  title?: string;
  description?: string;
  cancelButton?: string;
  confirmButton?: string;
}

const NavigationBackBlocker = ({
  when,
  getCanByPass,
  confirmButton = 'Leave',
  cancelButton = 'Cancel',
  title = 'Information will not be saved',
  description = 'Are you sure? Information entered will not be saved.',
}: Props) => {
  const popUpRef = useRef(null);
  const latestCanByPass = useRef(null);
  latestCanByPass.current = getCanByPass;
  const navigation = useNavigation();
  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        const canByPass = latestCanByPass.current
          ? latestCanByPass.current()
          : false;
        if (!when || canByPass) {
          // If we don't have unsaved changes, then we don't need to do anything
          return;
        }
        e.preventDefault();
        popUpRef?.current?.open(() => navigation.dispatch(e.data.action));
      }),
    [navigation, when]
  );
  return (
    <Popup
      ref={popUpRef}
      title={title}
      description={description}
      buttonCancel={cancelButton}
      buttonHandle={confirmButton}
      handleFunction={() => navigation.dispatch(CommonActions.goBack())}
    />
  );
};

export default NavigationBackBlocker;
