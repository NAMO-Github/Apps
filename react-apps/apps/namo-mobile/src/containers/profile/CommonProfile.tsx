import { Colors, ElementHeightFromSize } from '@namo-workspace/themes';
import { Body4, Sub } from '@namo-workspace/ui/Typography';
import TouchableOpacity from '@namo-workspace/ui/view/TouchableOpacity';
import View from '@namo-workspace/ui/view/View';
import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import {
  MaterialTabBar,
  MaterialTabBarProps,
  TabItemProps,
} from 'react-native-collapsible-tab-view';
import styled from 'styled-components/native';

const { width } = Dimensions.get('window');
export const CustomTabBar = (props: MaterialTabBarProps<string>) => (
  <MaterialTabBar
    {...props}
    indicatorStyle={{
      backgroundColor: Colors.primaryOrange,
      borderWidth: 1,
      borderColor: Colors.primaryOrange,
    }}
    style={{
      borderBottomColor: Colors.foregroundDisable,
      borderBottomWidth: 1,
    }}
  />
);

export const TabItem = ({
  index,
  label,
  icon,
}: Pick<TabItemProps<string>, 'index' | 'indexDecimal'> & {
  label: string;
  icon: React.ReactNode;
}) => {
  return (
    <TabItemContainer key={index}>
      {icon}
      <LabelItem
        ml={1.5}
        fontSize={10}
        fontWeight="600"
        fontStyle="normal"
        color={Colors.textLevel3}
      >
        {label}
      </LabelItem>
    </TabItemContainer>
  );
};

export const customLabel =
  (label: string, icon: React.ReactNode) =>
  (props: TabItemProps<string> & React.ReactNode) =>
    (
      <TabItem
        index={props.index}
        indexDecimal={props.indexDecimal}
        label={label}
        icon={icon}
      />
    );

const TabItemContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;
const LabelItem = styled(Sub)``;

export const HeaderContainer = styled(View)`
  flex: 1;
  background-color: ${Colors.white};
`;

export const SearchContainer = styled(View)`
  width: ${width}px;
  flex-direction: row;
  position: absolute;
  align-items: center;
  justify-content: space-between;
  bottom: -108px;
  padding: 10px;
  background-color: ${Colors.white};
`;

export const FooterContainer = styled(View)`
  width: 100%;
  align-self: center;
  margin: 8px 0;
  height: ${ElementHeightFromSize.medium}px;
  flex-direction: row;
  padding-horizontal: 8px;
`;

export const stylesButtonGroup = StyleSheet.create({
  btn_group: {
    justifyContent: 'space-between',
  },
  btn_select: {
    width: '48%',
  },
});
export const ButtonSearch = styled(TouchableOpacity)`
  border-width: 1px;
  border-color: ${Colors.border};
  border-radius: 19px;
  width: 38px;
  height: 38px;
  align-items: center;
  justify-content: center;
`;
export const ButtonSetVisible = styled(TouchableOpacity)`
  border-width: 1px;
  border-color: ${Colors.border};
  border-radius: 24px;
  align-items: center;
  justify-content: center;
  align-self: flex-end;
  padding: 9px 12px;
`;
export const TextVisible = styled(Body4)`
  color: ${Colors.textLevel3};
`;
