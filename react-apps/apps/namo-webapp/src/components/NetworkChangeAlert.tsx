import { useWalletAuth } from '@context/wallet-auth';
import useToggle from '@hooks/useToggle';
import { environment } from '@namo-workspace/environments';
import { memo, ReactNode, useEffect } from 'react';
import { Alert } from 'reactstrap';
import styled from 'styled-components';

type Props = {
  className?: string;
  message: string | ReactNode;
};

const NetworkChangeAlert = ({ className, message }: Props) => {
  const { chainId } = useWalletAuth();
  const { isOpen, open, close } = useToggle();

  useEffect(() => {
    if (chainId) {
      if (!environment.mainnetChainId.includes(chainId)) {
        open();
      } else {
        close();
      }
    }
  }, [chainId, close, open]);

  return (
    <AlertS
      color="warning"
      isOpen={isOpen}
      toggle={close}
      className={className}
    >
      {message}
    </AlertS>
  );
};

const AlertS = styled(Alert)`
  z-index: 1001;
  font-weight: 500;
  font-size: 12px;
  text-align: center;
  padding-top: 6px;
  padding-bottom: 6px;
  button {
    padding: 0 !important;
    top: 50% !important;
    right: 1rem !important;
    transform: translateY(-50%);
  }
`;

export default memo(NetworkChangeAlert);
