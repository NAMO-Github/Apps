import Images from '@images';
import PopupUnController from '@namo-workspace/ui/PopupUnController';
import { Body2 } from '@namo-workspace/ui/Typography';
import React from 'react';

type Props = {
  visible: boolean;
  onRequestClose?: () => void;
  title?: string;
};

const { IcAppNamo } = Images;

const PopupLoadingMetamask = ({
  visible,
  onRequestClose,
  title = 'Waiting for blockchain confirmation',
}: Props) => {
  return (
    <PopupUnController
      visible={visible}
      onRequestClose={onRequestClose}
      extraView={
        <>
          <Body2 mb={3}>{title}</Body2>
          <IcAppNamo />
        </>
      }
    />
  );
};
export default PopupLoadingMetamask;
