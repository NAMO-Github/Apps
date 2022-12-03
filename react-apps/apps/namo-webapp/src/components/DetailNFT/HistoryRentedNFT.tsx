import { Colors, FontHeight, FontSize } from '@namo-workspace/themes';
import { Body2 } from '@namo-workspace/ui/Typography';
import styled from 'styled-components';
import { ReactComponent as IcCopy } from '@assets/images/profile/ic-bx-copy.svg';
import { ReactComponent as IcETH } from '@assets/images/ic-Etherium.svg';
import { Transactions } from '@namo-workspace/services';
import { ellipsisCenter, parseWei } from '@namo-workspace/utils';
import { Dispatch, SetStateAction } from 'react';
import {
  InfoItemLabelS,
  InfoItemValueLinkS,
  InfoItemValueS,
} from './detailNFT.styled';
import { format, parseISO } from 'date-fns';
import { environment } from '@namo-workspace/environments';
import { useAuth } from '@context/auth';
import { DEFAULT_USERNAME } from '@constants/common';

interface HistoryRentedNFTProps {
  onSetIsCopy: Dispatch<SetStateAction<boolean>>;
  history: Transactions;
}

const HistoryRentedNFT = ({ onSetIsCopy, history }: HistoryRentedNFTProps) => {
  const { userInfo } = useAuth();

  const handleCopy = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    text: string
  ) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    onSetIsCopy(true);
  };

  const handleNavigateEthScan = (txHash: string) => {
    window.open(
      `${environment.blockExplorerUrls}/tx/${txHash}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <Container>
      <div className="d-flex flex-column">
        <div className="d-flex flex-row mb-1 mb-md-2">
          <InfoItemLabelS>Rental Period</InfoItemLabelS>
          <InfoItemValueS>{`${format(
            parseISO(history.createdAt),
            'dd/MM/yyyy'
          )} - ${format(
            parseISO(history.endDate),
            'dd/MM/yyyy'
          )}`}</InfoItemValueS>
        </div>

        <div className="d-flex flex-row mb-1 mb-md-2">
          <InfoItemLabelS>Renter</InfoItemLabelS>
          <InfoItemValueS>
            {history.renterName || DEFAULT_USERNAME}
          </InfoItemValueS>
        </div>

        <div className="d-flex flex-row mb-1 mb-md-2">
          <InfoItemLabelS>Price</InfoItemLabelS>
          <InfoItemValueS>
            <WrapPrice>
              <IcETH width={20} height={20} />
              <Price>{parseWei(history.price)}</Price>
            </WrapPrice>
          </InfoItemValueS>
        </div>

        <div className="d-flex flex-row mb-1 mb-md-2">
          <InfoItemLabelS>Transaction Hash</InfoItemLabelS>
          <InfoItemValueLinkS
            onClick={() => handleNavigateEthScan(history.txHash)}
          >
            {ellipsisCenter(history.txHash)}
            <IcCopy
              data-tip="Copy"
              data-place="top"
              data-effect="solid"
              onClick={(e) => handleCopy(e, history.txHash)}
            />
          </InfoItemValueLinkS>
        </div>

        {history.txHashReturn &&
          userInfo?.address === history?.lenderAddress?.toLowerCase() && (
            <div className="d-flex flex-row mb-1 mb-md-2">
              <InfoItemLabelS>Return Transaction Hash</InfoItemLabelS>
              <InfoItemValueLinkS
                onClick={() => handleNavigateEthScan(history.txHashReturn)}
              >
                {ellipsisCenter(history.txHashReturn)}
                <IcCopy
                  data-tip="Copy"
                  data-place="top"
                  data-effect="solid"
                  onClick={(e) => handleCopy(e, history.txHashReturn)}
                />
              </InfoItemValueLinkS>
            </div>
          )}
      </div>
    </Container>
  );
};

const Container = styled.div`
  background: ${Colors.background2};
  border-radius: 8px;
  padding: 16px 24px;

  @media (max-width: 767.98px) {
    padding: 12px 16px;
  }
`;

const WrapPrice = styled.div`
  display: flex;
  align-items: center;
  min-height: 16px;

  @media (max-width: 767.98px) {
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const Price = styled(Body2)`
  display: inline-block;
  font-weight: 600;
  color: ${Colors.textLevel2};
  margin: 0 2px;

  @media (max-width: 767.98px) {
    font-size: ${FontSize.body4}px;
    line-height: ${FontHeight.body4}px;
  }
`;

export default HistoryRentedNFT;
