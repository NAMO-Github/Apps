import { ReactComponent as IcETH } from '@assets/images/ic-Etherium.svg';
import { convertPricePerDay, Packages } from '@namo-workspace/services';
import { Colors } from '@namo-workspace/themes';
import { Body4 } from '@namo-workspace/ui/Typography';
import { parseWei } from '@namo-workspace/utils';
import { FC } from 'react';
import styled, { css } from 'styled-components';
interface DurationProps {
  duration: Packages;
  disabled?: boolean;
  isSelected?: boolean;
  onChange?: (isSelected: boolean) => void;
}

const Duration: FC<DurationProps> = ({
  duration,
  isSelected,
  onChange,
  disabled = false,
}) => {
  const handleClick = () => {
    onChange && onChange(!isSelected);
  };
  return (
    <Container
      disabled={disabled}
      isSelected={isSelected}
      onClick={handleClick}
    >
      <WrapPrice>
        <IcETH width={16} height={16} />
        <Price>{parseWei(duration.price)}</Price>
        <PriceOneDay>
          ({convertPricePerDay(parseWei(duration.price), duration.duration)}
          /day)
        </PriceOneDay>
      </WrapPrice>

      <WrapDuration>
        Rental Duration: <DurationLabel>{duration.label}</DurationLabel>
      </WrapDuration>
    </Container>
  );
};

const Container = styled.button<{ isSelected?: boolean }>`
  outline: none;

  ${(props) =>
    props.disabled
      ? css`
          border: none !important;
          background: #f5f5f5 !important;

          @media (max-width: 767.98px) {
            background: #ffffff !important;
            border: 1px solid #dedede !important;
          }
        `
      : css`
          border: 1px solid ${Colors.strokeLevel3};
          background: white;
        `}

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 12px;
  border-radius: 4px;
  width: 100%;
  min-height: 52px;
  ${(props) =>
    props.isSelected &&
    css`
      border: 1px solid ${Colors.primaryOrange};
      background: ${Colors.secondary};
    `}
`;

const WrapPrice = styled.div`
  display: flex;
  align-items: center;
  min-height: 16px;
  margin-bottom: 4px;
`;

const Price = styled(Body4)`
  font-weight: 600;
  color: ${Colors.textLevel2};
  margin: 0 2px;
`;

const PriceOneDay = styled(Body4)`
  color: ${Colors.textLevel4};
  font-weight: 400;
  margin-bottom: 0;
`;

const WrapDuration = styled.div`
  font-size: 12px;
  line-height: 16px;
  color: ${Colors.textLevel3};
  font-weight: 400;
`;

const DurationLabel = styled(Body4)`
  display: inline-block;
  color: ${Colors.textLevel2};
  font-weight: 600;
  margin-bottom: 0;
`;

export default Duration;
