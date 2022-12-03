import { Colors, FontHeight, FontSize } from '@namo-workspace/themes';
import { Body2, Body3 } from '@namo-workspace/ui/Typography';
import styled from 'styled-components';

interface zIndex {
  zIndex: number;
}

export const HeaderContainerS = styled.div`
  background-color: ${Colors.background};
  border-bottom: 1px solid ${Colors.strokeLevel3};

  position: sticky;
  top: 0;
  left: 0;
  z-index: 11;
`;

export const Content = styled.div`
  height: 64px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  padding: 4px 9%;
`;

export const LogoNamoContainerS = styled.div`
  display: flex;
  flex-flow: row nowrap;
  text-decoration: none;
  align-items: center;
  cursor: pointer;
`;

export const LogoNamoTextS = styled.div`
  text-transform: uppercase;
  color: ${Colors.textLevel1};
  font-weight: 700;
  font-size: ${FontSize.h4}px;
  line-height: ${FontHeight.h4}px;
  margin-left: 0.5rem;
`;

export const WrapSearchS = styled.div`
  flex: 1;
  position: relative;
  max-width: 580px;

  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 2rem;
`;

export const ActionContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  height: 100%;
`;

export const ActionContainerS = styled(ActionContainer)`
  & > li:not(:first-child) {
    margin-left: 1rem;
  }
`;

export const ItemAction = styled.li`
  padding: 0;
  margin: 0;
  height: 100%;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  position: relative;
  transition: all 0.3s ease-in-out;
  cursor: pointer;

  svg {
    transition: all 0.2s ease-in-out;
    cursor: pointer;
  }

  &:hover svg {
    transform: scale(1.1);
  }

  &:hover {
    color: ${Colors.primaryOrangePlus1};
  }

  &:hover .popup-explore {
    transform: translateY(4px);
    opacity: 1;
    visibility: visible;
  }
`;

export const PopupExplore = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 250%;
  border-radius: 16px;
  background: ${Colors.white};
  box-shadow: 0px 0.6px 1.8px rgb(0 0 0 / 11%), 0px 3.2px 7.2px rgb(0 0 0 / 13%);
  border: 1px solid ${Colors.strokeLevel3};
  overflow: hidden;
  transition: all 0.2s ease-in-out;
  z-index: 5;
  transform: translateY(-2px);
  opacity: 0;
  visibility: hidden;
`;

export const ListLink = styled.ul`
  padding: 0;
  list-style-type: none;

  & > li:not(:last-child) {
    border-bottom: 1px solid ${Colors.strokeLevel3};
  }
`;

export const NavItem = styled.li`
  padding: 12px 16px;
  font-size: ${FontSize.body2}px;
  line-height: ${FontHeight.body2}px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  color: #000000;

  &:hover {
    background: ${Colors.background2};
  }
`;

export const WrapUserCircle = styled.span`
  &:first-child::before {
    content: '';
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 4px;
    background-color: ${Colors.primaryOrange};
    border-radius: 1000px 1000px 0px 0px;
  }
`;

export const ActionMessage = styled(Body2)`
  font-weight: 600;
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

// styled header tablet
export const LogoNamoText = styled(LogoNamoTextS)`
  font-size: ${FontSize.body2}px;
  line-height: ${FontHeight.body2}px;
`;

export const ActionContainerT = styled(ActionContainer)`
  & > span:not(:last-child) {
    margin-right: 1rem;
  }
`;

export const Icon = styled.span`
  cursor: pointer;

  svg {
    transition: all 0.3s ease-in-out;
    width: 24px;
    height: 24px;
  }

  &:hover svg {
    transform: scale(0.95);
  }
`;

export const Cancel = styled(Body3)<zIndex>`
  font-weight: 400;
  color: ${Colors.textLevel3};
  margin: 0;
  display: inline-block;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  border-radius: 4px;
  position: relative;
  z-index: ${({ zIndex }) => zIndex};

  &:hover {
    background: #f7f7f7;
  }

  @media (max-width: 575.98px) {
    padding: 8px 16px;
    font-size: ${FontSize.body4}px;
    line-height: ${FontHeight.body4}px;
  }
`;

export const WrapSearchT = styled(WrapSearchS)`
  max-width: initial;
  margin-right: 16px;

  span {
    border: none;
  }
`;
