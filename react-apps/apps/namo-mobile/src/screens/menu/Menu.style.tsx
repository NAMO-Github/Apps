import styled from 'styled-components/native';

import { Colors, FontSize } from '@namo-workspace/themes';
import { Body2 } from '@namo-workspace/ui/Typography';

export const Container = styled.View`
  flex: 1;
  padding: ${FontSize.body2}px;
`;

export const MenuItem = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
`;

export const MenuText = styled(Body2)`
  color: ${Colors.strokeLevel1};
`;
