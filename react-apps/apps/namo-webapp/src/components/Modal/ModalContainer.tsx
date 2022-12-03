import { ReactComponent as Close } from '@assets/images/common/ic_clear.svg';
import { ReactNode } from 'react';
import {
  ButtonContainerS,
  CloseS,
  DescriptionS,
  ModalC,
  ModalSize,
  TitleS,
} from './modal.styled';

export type PropsModal = {
  isOpen?: boolean;
  onClose?: () => void;
  onOk?: () => void;
  title?: string;
  description?: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  closeButton?: boolean;
  backdrop?: boolean | 'static';
  zIndex?: number;
};

export default function ModalContainer({
  title,
  description,
  footer,
  isOpen,
  size,
  closeButton,
  backdrop = true,
  onClose,
}: PropsModal) {
  return (
    <ModalC isOpen={isOpen} centered size={size} backdrop={backdrop}>
      <TitleS>
        {title}
        {closeButton && (
          <CloseS onClick={onClose}>
            <Close />
          </CloseS>
        )}
      </TitleS>
      <DescriptionS>{description}</DescriptionS>
      <ButtonContainerS>{footer}</ButtonContainerS>
    </ModalC>
  );
}
