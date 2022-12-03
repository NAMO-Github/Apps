import { ReactComponent as IconNamo } from '@assets/images/common/ic-logo-namo-no-name.svg';
import styled from 'styled-components';
import { Colors } from '@namo-workspace/themes';
import ModalCustom from './ModalCustom';

type Props = {
  isOpen: boolean;
};

export default function ModalWaitingMetamask({ isOpen }: Props) {
  return (
    <ModalCustom
      isOpen={isOpen}
      size="small"
      zIndex={1100}
      description={
        <div className="mt-2 d-flex flex-column align-items-center justify-content-center mt-2">
          <span>Waiting for blockchain confirmation</span>
          <IcLoading className="mt-2" width={30} height={30} />
        </div>
      }
    />
  );
}

const IcLoading = styled(IconNamo)`
  circle {
    fill: ${Colors.primaryOrange};
  }
`;
