import styled from 'styled-components/native';
import { Colors, FontSize } from '@namo-workspace/themes';
import { StyleSheet } from 'react-native';
import { Body2, Body3, Body4 } from '@namo-workspace/ui/Typography';

export const styles = StyleSheet.create({
  btn_group: {
    justifyContent: 'space-between',
  },
  btn_edit: {
    width: '48%',
  },
});

export const DetailContainer = styled.View`
  flex: 1;
  padding: ${FontSize.body2}px;
`;

export const ToastNotification = styled.View`
  border-radius: 8px;
  padding: 10px 17px;
  background-color: #eff5fe;
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

export const ToastMessage = styled(Body3)`
  font-weight: 500;
  margin-left: 10px;
`;

export const PackageContent = styled.View`
  background-color: ${Colors.background2};
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
`;

export const PackageHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${Colors.strokeLevel3};
`;

export const PackageTitle = styled(Body3)`
  font-weight: 700;
  color: ${Colors.foreground};
`;

export const PackageClear = styled.TouchableOpacity``;

export const Price = styled.View`
  flex-direction: row;
  margin: 16px 0 8px 0;
`;

export const PricePerDay = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 2px ${FontSize.body2}px;
  background-color: ${Colors.background2};
  border-radius: 6px;
`;

export const PriceText = styled(Body4)`
  color: ${Colors.textLevel2};
  margin-left: 2px;
`;

export const AddPackageBtn = styled.Pressable`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${Colors.border};
  margin-bottom: 16px;
`;

export const AddPackageText = styled(Body2)`
  font-weight: 600;
  margin-left: 12px;
`;

export const WrapButtons = styled.View`
  width: 100%;
  align-self: center;
  justify-content: space-between;
  margin-top: 8px;
  height: ${FontSize.h2}px;
  flex-direction: row;
`;
