import { ReactComponent as BxUserCircle } from '@assets/images/common/ic-bx-user-circle.svg';
import { ReactComponent as BxLogOut } from '@assets/images/common/ic-bx-log-out.svg';
import { ReactComponent as LogoNamoNoName } from '@assets/images/common/ic-logo-namo-no-name.svg';
import { ReactComponent as IconFilter } from '@assets/images/common/ic_filter.svg';
import { ReactComponent as IconFilterActive } from '@assets/images/common/ic_filter_active.svg';
import { ROUTES } from '@constants/routes';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { memo, useContext, useEffect, useState } from 'react';
import { useAuth } from '@context/auth';
import { tokenManager } from '@namo-workspace/services';
import ContainerSearch from '@components/ListSearch/ContainerSearch';
import {
  ActionContainerS,
  Content,
  HeaderContainerS,
  LogoNamoContainerS,
  LogoNamoTextS,
  ItemAction,
  WrapFilter,
  WrapSearchS,
  WrapUserCircle,
  ActionMessage,
  PopupExplore,
  ListLink,
  NavItem,
} from './header.styled';
import { FilterSearchContext, ParamsQuery } from '@context/filter-search';
import { optionExplore } from './contanst';
import { MaxWidthContent } from '@namo-workspace/ui/MaxWidthContent.styled';

const Header = () => {
  const { isFilterHome, setIsFilterHome, setIsFilterProfile } =
    useContext(FilterSearchContext);
  const [searchParams] = useSearchParams({});

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isLoggedIn } = useAuth();
  const [valueSearch, setValueSearch] = useState<string>('');

  useEffect(() => {
    if (pathname !== ROUTES.HOME) {
      setValueSearch('');
      return;
    }

    const params: ParamsQuery = Object.fromEntries([...searchParams]);
    if (Object.keys(params).length !== 0) {
      setValueSearch(params.search || '');
    } else {
      setValueSearch('');
    }
  }, [pathname, searchParams]);

  const handleClickProfile = () => {
    const route = isLoggedIn ? ROUTES.PROFILE : ROUTES.LOGIN;
    setValueSearch('');
    navigate(route);
  };

  const handleLogout = () => {
    setValueSearch('');
    tokenManager.doLogout();
    navigate(ROUTES.LOGIN);
  };

  const handleClickLogo = () => {
    if (pathname !== ROUTES.HOME) {
      navigate(ROUTES.HOME);
      setIsFilterHome(false);
    }
    setIsFilterProfile(false);
  };

  return (
    <HeaderContainerS>
      <MaxWidthContent>
        <Content>
          <LogoNamoContainerS onClick={handleClickLogo}>
            <LogoNamoNoName />
            <LogoNamoTextS>NAMO</LogoNamoTextS>
          </LogoNamoContainerS>

          <WrapSearchS>
            {pathname === ROUTES.HOME && (
              <WrapFilter onClick={() => setIsFilterHome((prev) => !prev)}>
                {isFilterHome ? <IconFilterActive /> : <IconFilter />}
              </WrapFilter>
            )}

            <ContainerSearch
              valueSearch={valueSearch}
              onSetValueSearch={setValueSearch}
              listKeyLocal={'listKeySearch'}
              isSearchHome={true}
              zIndex={10}
            />
          </WrapSearchS>

          <ActionContainerS>
            <ItemAction className="position-relative">
              <ActionMessage>Explore</ActionMessage>

              <PopupExplore className="popup-explore">
                <ListLink>
                  {optionExplore.map((item, index) => (
                    <NavItem key={index} onClick={() => navigate(item.to)}>
                      {item.title}
                    </NavItem>
                  ))}
                </ListLink>
              </PopupExplore>
            </ItemAction>

            <ItemAction onClick={handleClickProfile}>
              {pathname.startsWith(`${ROUTES.PROFILE}/`) ? (
                <WrapUserCircle>
                  <BxUserCircle />
                </WrapUserCircle>
              ) : (
                <BxUserCircle />
              )}
            </ItemAction>
            {isLoggedIn && (
              <ItemAction onClick={handleLogout}>
                <BxLogOut />
              </ItemAction>
            )}
          </ActionContainerS>
        </Content>
      </MaxWidthContent>
    </HeaderContainerS>
  );
};

export default memo(Header);
