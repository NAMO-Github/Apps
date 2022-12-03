import Button from '@namo-workspace/ui/Button';
import { ReactNode } from 'react';
import { ModalSize } from './modal.styled';
import ModalCustom from './ModalCustom';

export interface ModalConfirmProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOk?: () => void;
  title?: string;
  description?: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  cancelText?: string;
  okText?: string;
  isLoading?: boolean;
}

export default function ModalConfirm({
  title,
  description,
  cancelText = 'Cancel',
  okText = 'OK',
  isOpen,
  size,
  onClose,
  onOk,
  isLoading,
}: ModalConfirmProps) {
  return (
    <ModalCustom
      title={title}
      isOpen={isOpen}
      size="small"
      zIndex={1100}
      description={description}
      footer={
        <div className="d-flex flex-row w-100 mt-3 mt-md-4">
          <Button
            className="flex-fill me-3 me-md-4"
            type="button"
            color="white"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            className="flex-fill"
            type="button"
            onClick={onOk}
            isLoading={isLoading}
          >
            {okText}
          </Button>
        </div>
      }
    />
  );
}
