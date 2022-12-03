import View from '@namo-workspace/ui/view/View';
import { TouchableOpacity } from 'react-native';
import styled, { css } from 'styled-components/native';
import { Body1, Body2, Body3, Body4, Sub } from '@namo-workspace/ui/Typography';
import { Colors } from '@namo-workspace/themes';
import { STATUS } from '@constants/rent';

export const Container = styled(View)``;

export const Divider = styled(View)`
  height: 1.5px;
  background-color: ${Colors.strokeLevel3};
`;

export const ModalContainer = styled(View)`
  flex: 1;
  justify-content: center;
  width: 100%;
`;

export const Overlay = styled(TouchableOpacity)`
  background-color: rgba(153, 153, 153, 0.5);
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: absolute;
  height: 100%;
`;

export const ModalView = styled(View)`
  margin-horizontal: 16px;
  background-color: ${Colors.background};
  border-radius: 15px;
  padding: 16px;
`;

export const ModalTitle = styled(Body1)`
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  font-weight: 700;
  color: ${Colors.foreground};
`;

export const ButtonBox = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`;

export const ModalField = styled(View)``;

export const ButtonCancel = styled(TouchableOpacity)`
  flex: 1;
  padding: 10px 16px;
  border-color: ${Colors.primaryOrange};
  border-width: 1px;
  border-radius: 8px;
`;

export const ButtonHandle = styled(TouchableOpacity)`
  flex: 1;
  padding: 10px 16px;
  background-color: ${Colors.primaryOrange};
  border-radius: 8px;
`;

export const TitleHandle = styled(Body2)`
  text-align: center;
  line-height: 24px;
`;

export const ImageAvatar = styled.Image`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  margin-right: 4px;
`;

export const Description = styled(Body3)`
  line-height: 20px;
`;

export const Details = styled(Body4)`
  line-height: 20px;
`;

export const RentalDuration = styled(View)`
  background-color: ${Colors.background2};
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
