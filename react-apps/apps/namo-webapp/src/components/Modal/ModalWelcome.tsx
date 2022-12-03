import { ReactComponent as LogoNamoNoName } from '@assets/images/common/ic-logo-namo-no-name.svg';
import Button from '@namo-workspace/ui/Button';
import styled from 'styled-components';
import ModalContainer from './ModalContainer';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onOk: () => void;
  isLoading: boolean;
};

export default function ModalWelcome({
  isOpen,
  onClose,
  onOk,
  isLoading,
}: Props) {
  return (
    <ModalContainer
      isOpen={isOpen}
      size="small"
      title="Welcome to NAMO"
      description={
        <>
          <WrapLogoMamo>
            <LogoNamoNoName width={60} height={60} />
          </WrapLogoMamo>
          <MessageDes>
            By connecting your wallet and using NAMO, you agree to our Terms of
            Service and Privacy Policy
          </MessageDes>
        </>
      }
      footer={
        <>
          <ButtonS mr={4} color="white" onClick={onClose}>
            Cancel
          </ButtonS>
          <ButtonS onClick={onOk} isLoading={isLoading}>
            Accept & Sign
          </ButtonS>
        </>
      }
    />
  );
}

const WrapLogoMamo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const MessageDes = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #424242;
`;

const ButtonS = styled(Button)`
  flex: 1;
`;
