import { Colors } from '@namo-workspace/themes';
import { memo, ReactNode, useCallback, useState } from 'react';
import styled, { css } from 'styled-components';
import { Body3 } from './Typography';

interface ITabItemProps {
  active?: boolean;
}

interface ITabsChildrenProps {
  activeKey: string;
  setActiveKey: (activeTab: string) => void;
}
export interface ITab {
  key: string;
  label: string | ReactNode;
  icon: string | ReactNode;
}

export interface ITabsProps {
  className?: string;
  tabs: ITab[];
  defaultActiveKey?: string;
  children({ activeKey, setActiveKey }: ITabsChildrenProps): ReactNode;
}
const Tabs = ({ className, defaultActiveKey, tabs, children }: ITabsProps) => {
  const [activeKey, setActiveKey] = useState(
    defaultActiveKey || tabs[0]?.key || ''
  );

  const handleTabClick = useCallback((tabKey: string) => {
    setActiveKey(tabKey);
  }, []);

  return (
    <TabsContainer className={className}>
      <TabsHeader>
        {tabs.map((tab) => (
          <TabItem
            key={tab.key}
            onClick={() => handleTabClick(tab.key)}
            active={activeKey === tab.key}
          >
            <Icon>{tab.icon}</Icon>
            <TextHeader>{tab.label}</TextHeader>
          </TabItem>
        ))}
      </TabsHeader>

      <TabsBody>{children({ activeKey, setActiveKey })}</TabsBody>
    </TabsContainer>
  );
};

const TabsContainer = styled.div`
  display: flex;
  flex-flow: column;
`;

const TabsHeader = styled.ul`
  list-style: none;
  display: flex;
  flex-flow: row;
  align-items: center;
  height: 48px;
  border-bottom: 1px solid ${Colors.strokeLevel3};
  border-radius: 16px 16px 0px 0px;
  padding: 0;
`;
const TabsBody = styled.div`
  flex: 1;
  margin-bottom: 20px;
`;

const TabItem = styled.li<ITabItemProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 180px;
  height: 100%;
  cursor: pointer;

  &:hover span {
    font-size: 15px;
  }

  ${({ active }) =>
    active &&
    css`
      border-bottom: 2px solid ${Colors.primaryOrange};
    `};
`;

const TextHeader = styled(Body3)`
  display: inline-block;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
  color: ${Colors.textLevel3};
  transition: all 0.2ms cubic-bezier(0.075, 0.82, 0.165, 1);
`;

const Icon = styled.span`
  width: 20px;
  height: 20px;
  margin-right: 6px;
  line-height: 14px;
  transition: all 0.2ms cubic-bezier(0.075, 0.82, 0.165, 1);
`;

export default memo(Tabs);
