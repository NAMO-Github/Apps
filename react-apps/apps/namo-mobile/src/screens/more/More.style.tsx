import styled from 'styled-components/native';

import { Colors, FontSize } from '@namo-workspace/themes';
import { TouchableOpacity } from 'react-native';
import { Body2, Body3, Body4 } from '@namo-workspace/ui/Typography';
import View from '@namo-workspace/ui/view/View';

export const Container = styled.View`
  flex: 1;
  padding: ${FontSize.body2}px;
`;

export const ProfileLink = styled(Body2)`
  color: ${Colors.strokeLevel1};
`;

export const ProfileDescription = styled(Body4)`
  color: ${Colors.textLevel4};
  border-bottom-width: 1px;
  border-bottom-color: ${Colors.strokeLevel3};
  padding: 2px 0 5px 0;
`;

export const ProfileLinkValue = styled(Body3)`
  color: ${Colors.strokeLevel1};
  padding-top: 5px;
`;

export const GroupActions = styled.View`
  flex-direction: row;
  padding: 15px 0;
`;

export const ActionButton = styled(TouchableOpacity)`
  border: 1px solid ${Colors.border};
  border-radius: 5px;
  margin-right: 10px;
  padding: 5px 5px;
  min-width: 90px;
`;

export const ActionText = styled(Body3)`
  color: ${Colors.strokeLevel1};
  text-align: center;
`;

export const LogoutButton = styled.TouchableOpacity`
  padding: 3px 0;
  flex-direction: row;
  align-items: center;
`;

export const LogoutText = styled(Body3)`
  color: ${Colors.strokeLevel1};
  margin-left: 5px;
`;

export const CopyToast = styled(View)`
  background-color: ${Colors.foreground};
  padding: 5px 8px;
  border-radius: 8px;
`;

export const Message = styled(Body3)``;
