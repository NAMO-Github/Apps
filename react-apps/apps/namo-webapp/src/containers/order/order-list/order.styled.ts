import { Colors } from '@namo-workspace/themes';
import { Body1, Body2, Body3, Body4, Sub } from '@namo-workspace/ui/Typography';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface ColorsTag {
  color?: string;
}

export const HeaderS = styled.thead`
  background: #f5f5f5;
`;

export const HeaderCellS = styled.td`
  padding: 24px 12px !important;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
`;

export const FilterContainerS = styled.div`
  width: fit-content;
  max-width: 25%;
  margin-right: 1rem;
  display: flex;
  flex-flow: column;
  transition: all 0.3s cubic-bezier(0.39, 0.575, 0.565, 1);
`;

export const WrapFilter = styled.div`
  margin-right: 16px;
  cursor: pointer;

  svg {
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }

  &:hover svg {
    transform: scale(1.2);
  }
`;
export const OrderID = styled(Link)`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: right;
  color: ${Colors.blue};
  text-decoration: none;
`;
export const Date = styled.td`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: ${Colors.strokeLevel1};
`;
export const TotalPriceS = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: ${Colors.strokeLevel1};
`;

export const TagStatus = styled.span<ColorsTag>`
  background: ${({ color }) => color};
  color: ${Colors.background};
  font-weight: 600;
  font-size: 10px;
  line-height: 20px;
  text-align: center;
  text-transform: uppercase;
  border-radius: 1000px;
  height: 20px;
  padding: 0 6px;
  display: inline-block;
`;

export const NftImage = styled.div`
  width: 40px;
  height: 40px;
  object-fit: contain;

  img {
    border-radius: 4px;
  }
`;

export const LenderName = styled(Sub)`
  font-weight: 400;
  color: ${Colors.foreground2};

  @media (max-width: 767.98px) {
    font-size: 14px;
    line-height: 20px;
    margin-left: 4px;
  }
`;

export const NftName = styled(Body2)`
  font-weight: 400;
  color: ${Colors.textLevel2};

  @media (max-width: 767.98px) {
    font-weight: 600;
  }
`;

export const WrapListOrder = styled.div`
  & > a:not(:last-child) {
    border-bottom: 1px solid ${Colors.border};
  }
`;

export const WrapLender = styled.div`
  display: inline-flex;
  align-items: center;
`;

export const ImageLender = styled.img`
  width: 24px;
  height: 24px;

  border-radius: 50%;
`;
export const LabelItem = styled(Body3)`
  font-weight: 500;
`;

export const LabelValue = styled(Body3)`
  font-weight: 400;
`;
export const WrapPrice = styled.div``;

export const Price = styled(Body4)`
  font-weight: 600;
  color: ${Colors.textLevel2};
`;

export const PriceDay = styled(Body4)`
  font-weight: 400;
  color: ${Colors.textLevel4};
  margin-left: 2px;
`;

export const LinkS = styled(Link)`
  text-decoration: none;
  color: initial;
  display: block;

  &:hover {
    color: initial;
  }
`;

export const TextCenter = styled(Body1)`
  height: calc(100vh - 65px - 32px);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;
