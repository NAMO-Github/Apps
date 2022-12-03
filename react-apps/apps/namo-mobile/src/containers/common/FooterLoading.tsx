import React from 'react';
import { Colors } from '@namo-workspace/themes';
import { Body3 } from '@namo-workspace/ui/Typography';

export const ListFooterComponent = () => {
  return (
    <Body3
      fontWeight="bold"
      style={{ textAlign: 'center', padding: 8, color: Colors.textLevel2 }}
    >
      Loading...
    </Body3>
  );
};
