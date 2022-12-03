import { ReactComponent as Close } from '@assets/images/common/ic_clear.svg';
import { useEffect, useState } from 'react';
import {
  ButtonContainerS,
  CloseS,
  ContainerModal,
  DescriptionS,
  ModalCustomS,
  TitleS,
} from './modal.styled';
import { PropsModal } from './ModalContainer';

const ModalCustom = ({
  title,
  description,
  footer,
  isOpen,
  size,
  closeButton,
  onClose,
  zIndex,
}: PropsModal) => {
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsShow(true));
      const bodyE = document.querySelector('body');

      if (bodyE) {
        bodyE.style.overflow = 'hidden';
      }
    }

    return () => {
      setIsShow(false);
      const bodyE = document.querySelector('body');
      const listModalE = document.querySelectorAll('.show-modal');
      const listModalContent = document.querySelectorAll('.modal-content');

      if (bodyE && !(listModalE.length || listModalContent.length)) {
        bodyE.style.overflow = 'visible';
      }
    };
  }, [isOpen]);

  return isOpen ? (
    <ModalCustomS zIndex={zIndex}>
      <ContainerModal size={size} className={isShow ? 'show-modal' : ''}>
        <TitleS style={{ marginBottom: !title ? 0 : 20 }}>
          {title}
          {closeButton && (
            <CloseS onClick={onClose}>
              <Close />
            </CloseS>
          )}
        </TitleS>
        <DescriptionS>{description}</DescriptionS>
        <ButtonContainerS>{footer}</ButtonContainerS>
      </ContainerModal>
    </ModalCustomS>
  ) : null;
};

export default ModalCustom;
