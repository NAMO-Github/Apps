import {
  Colors,
  ElementHeightFromSize,
  FontSize,
} from '@namo-workspace/themes';
import { Image, TouchableOpacity, View } from 'react-native';
import styled, { css } from 'styled-components/native';

import { STATUS } from '@constants/rent';
import { Body3, Body4, Sub } from '@namo-workspace/ui/Typography';

export const DetailContainer = styled(View)`
  flex: 1;
  padding: ${FontSize.body2}px 0;
`;

export const ErrorField = styled(View)`
  background-color: #ffeef0;
  border-radius: 8px;
  flex-direction: row;
  padding-horizontal: 16px;
  padding-vertical: 10px;
  align-items: center;
  margin: 16px;
`;

export const Visibility = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const LenderContainer = styled(View)`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: ${FontSize.body2}px;
  padding: 0 ${FontSize.body2}px;
`;

export const ImageAvatar = styled(Image)`
  height: ${ElementHeightFromSize.small}px;
  width: ${ElementHeightFromSize.small}px;
  border-radius: ${FontSize.body2}px;
`;

export const LenderName = styled(Body3)`
  width: 100%;
  margin-left: 8px;
  padding-right: 32px;
  font-weight: 700;
  color: ${Colors.textLevel1};
`;

export const ImageContainer = styled(Image)`
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  border-radius: ${FontSize.body2}px;
`;

export const ContentContainer = styled(View)`
  padding: ${FontSize.body2}px;
`;

export const Total = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px 22px;
`;
export const WrapPrice = styled(View)`
  flex-direction: row;
  align-items: center;
  align-self: center;
`;
export const Price = styled(Body4)`
  color: ${Colors.textLevel2};
  margin: 0 3px;
`;
export const PricePerDay = styled(Body4)`
  color: ${Colors.textLevel4};
`;
export const Status = styled(View)`
  padding: 5px 8px;
  border-radius: 20px;

  ${({ status }) => {
    switch (status) {
      case STATUS.PROCESSING:
        return css`
          background-color: ${Colors.yellow};
        `;
      case STATUS.PENDING:
        return css`
          background-color: ${Colors.yellow};
        `;
      case STATUS.FORRENT:
        return css`
          background-color: ${Colors.primaryGreen};
        `;
      case STATUS.RENTED:
      case STATUS.ORDERED:
        return css`
          background-color: ${Colors.primaryRed};
        `;
      case STATUS.TOPAY:
        return css`
          background-color: ${Colors.primaryRed};
        `;
      case STATUS.UNAVAILABLE:
        return css`
          border-width: 1px;
          border-color: ${Colors.strokeLevel3};
          background-color: ${Colors.background2};
        `;
      default:
        return css`
          background-color: ${Colors.primaryGreen};
        `;
    }
  }};
`;
export const StatusText = styled(Sub)`
  color: ${Colors.white};
  text-transform: uppercase;
  ${({ status }) => {
    switch (status) {
      case 'unavailable':
        return css`
          color: ${Colors.textLevel4};
        `;
      default:
        return css`
          color: ${Colors.white};
        `;
    }
  }}
`;
export const Duration = styled(TouchableOpacity)`
  margin: 8px 16px;
  padding: 8px 12px;
  border-radius: 5px;
  border-width: 1px;
`;
export const DurationText = styled(Body4)`
  color: ${Colors.textLevel3};
  text-align: center;
`;
export const DurationValue = styled(Body4)``;

export const NFTName = styled(Body3)`
  color: ${Colors.textLevel1};
  padding: 0 ${FontSize.body2}px ${FontSize.body2}px ${FontSize.body2}px;
`;

export const GroupNFTAction = styled(View)`
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: ${FontSize.body2}px;
`;

export const NFTAction = styled(TouchableOpacity)`
  background-color: ${Colors.background2};
  width: 48%;
  border-radius: 8px;
  padding: 12px 10px;
  margin-bottom: 16px;
`;

export const NFTActionTitle = styled(Body4)`
  color: ${Colors.textLevel4};
  text-align: center;
`;

export const NFTActionName = styled(Body3)`
  color: ${Colors.textLevel1};
  text-align: center;
  margin: 4px 0;
`;

export const NFTValueInfo = styled(Body3)`
  color: ${Colors.textLevel3};
  padding: ${FontSize.body2}px;
`;

export const NFTHeader = styled(TouchableOpacity)`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-top-width: 1px;
  border-top-color: ${Colors.strokeLevel3};
  border-bottom-width: ${(props) => (props.isCollapse === false ? '1px' : 0)};
  border-bottom-color: ${Colors.strokeLevel3};
  padding: 16px;
`;

export const NFTHeaderText = styled(Body3)`
  color: ${Colors.textLevel1};
`;

export const NFTItem = styled(View)`
  width: 100%;
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

export const NFTLabel = styled(Body3)`
  flex: 1;
  color: ${Colors.textLevel1};
`;

export const NFTValue = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 30%;
`;

export const CopyToast = styled(View)`
  background-color: ${Colors.foreground};
  right: 20px;
  padding: 8px;
  border-radius: 8px;
  position: absolute;
`;

export const CopyField = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
`;

export const PriceLabel = styled(Body3)``;

export const HistoryBox = styled(View)`
  margin-bottom: 16px;
  background-color: ${Colors.background2};
  padding: 16px;
  border-radius: 8px;
`;

export const NFTValueText = styled(Body4)`
  flex-direction: row;
  text-align: right;
  color: ${(props) => (props.isBlue ? Colors.blue : Colors.textLevel3)};
  margin-right: 3px;
`;

export const FooterContainer = styled(View)`
  width: 100%;
  align-self: center;
  padding: 16px 16px 0px;
  border-top-width: 1px;
  border-color: ${Colors.strokeLevel3};
`;

export const SwitchContainer = styled(View)`
  width: 44px;
  height: 24px;
  border-radius: 40px;
  justify-content: center;
`;

export const Avatar = styled.Image`
  width: 32px;
  height: 32px;
  max-width: 32px;
  max-height: 32px;
  border-radius: 16px;
`;

export const Button = styled(TouchableOpacity)`
  width: 48%;
`;
