import { Body2 } from '@namo-workspace/ui/Typography';
import { ReactComponent as BxUserCircle } from '@assets/images/common/ic-bx-user-circle.svg';
import { ReactComponent as BxLogOut } from '@assets/images/common/ic-bx-log-out.svg';
import { ReactComponent as Metamask } from '@assets/images/common/ic-metamask.svg';
import { ReactComponent as IcBxChevronLeft } from '@assets/images/common/ic_bx_chevron_left.svg';
import styled from 'styled-components';
import { Colors, FontHeight, FontSize } from '@namo-workspace/themes';
import { ROUTES } from '@constants/routes';
import { useAuth } from '@context/auth';
import { useLocation, useNavigate } from 'react-router';
import { SetStateAction, useEffect } from 'react';
import { tokenManager } from '@namo-workspace/services';
import { optionExplore } from '../layout/Header/contanst';

interface PropsMenuScreenMobile {
  onSetIsMenu: React.Dispatch<SetStateAction<boolean>>;
}

const MenuScreenMobile = ({ onSetIsMenu }: PropsMenuScreenMobile) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleClickProfile = () => {
    const route = isLoggedIn ? ROUTES.PROFILE : ROUTES.LOGIN;
    navigate(route);
    onSetIsMenu(false);
  };

  const handleLogout = () => {
    tokenManager.doLogout();
    onSetIsMenu(false);
    navigate(ROUTES.LOGIN);
  };

  const handleNavOptionExplore = (to: string) => {
    navigate(to);
    onSetIsMenu(false);
  };

  useEffect(() => {
    const bodyE = document.querySelector('body');

    if (bodyE) {
      bodyE.style.overflow = 'hidden';
    }

    return () => {
      const bodyE = document.querySelector('body');
      if (bodyE) {
        bodyE.style.overflow = 'visible';
      }
    };
  }, []);

  return (
    <Container>
      <MenuList>
        <MenuItem
          className={pathname.startsWith(`${ROUTES.PROFILE}/`) ? 'active' : ''}
          onClick={handleClickProfile}
        >
          {isLoggedIn ? (
            <WrapItem>
              <BxUserCircle />
              <Content>Profile</Content>
            </WrapItem>
          ) : (
            <WrapItem>
              <Metamask />
              <Content>Connect with Metamask</Content>
            </WrapItem>
          )}
        </MenuItem>

        {isLoggedIn && (
          <MenuItem onClick={handleLogout}>
            <WrapItem>
              <BxLogOut />
              <Content>Log out</Content>
            </WrapItem>
          </MenuItem>
        )}

        <hr />

        {optionExplore.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => handleNavOptionExplore(item.to)}
            className={pathname === item.to ? 'active' : ''}
          >
            <WrapItem className="justify-content-between">
              <Content>{item.title}</Content>
              <WrapChevron>
                <IcBxChevronLeft />
              </WrapChevron>
            </WrapItem>
          </MenuItem>
        ))}
      </MenuList>
    </Container>
  );
};

const Container = styled.div`
  height: calc(100vh - 64px);
  width: 100%;
  background-color: ${Colors.background};
  position: absolute;
  top: 64px;
  left: 0;
  z-index: 1051;
`;

const MenuList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 16px;
`;

const MenuItem = styled.li`
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &.active {
    background: ${Colors.background2};
  }

  &:hover {
    background: ${Colors.background2};
  }
`;

const WrapItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  height: 48px;

  svg {
    width: 24px;
    height: 24px;
    margin-right: 8px;

    @media (max-width: 575.98px) {
      width: 20px;
      height: 20px;
      margin-right: 6px;
    }
  }
`;

const WrapChevron = styled.span`
  svg {
    transform: rotateZ(180deg);
    margin-right: 0;
  }
`;

const Content = styled(Body2)`
  display: inline-block;
  color: ${Colors.textLevel3};

  @media (max-width: 575.98px) {
    font-size: ${FontSize.body3}px;
    line-height: ${FontHeight.body3}px;
  }
`;

export default MenuScreenMobile;
