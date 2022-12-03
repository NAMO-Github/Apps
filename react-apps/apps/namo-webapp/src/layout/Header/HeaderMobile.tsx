import { ReactComponent as LogoNamoNoName } from '@assets/images/common/ic-logo-namo-no-name.svg';
import { ReactComponent as IcBxMenu } from '@assets/images/common/ic_bx_menu.svg';
import { ReactComponent as IcBxSearch } from '@assets/images/ic-bx-search.svg';
import { ReactComponent as IcXCrossExit } from '@assets/images/common/ic_bx_x.svg';
import { ROUTES } from '@constants/routes';
import { memo, useEffect, useState } from 'react';
import ContainerSearch from '@components/ListSearch/ContainerSearch';
import MenuScreenMobile from '@components/MenuScreenMobile';
import {
  ActionContainerT,
  Cancel,
  Content,
  HeaderContainerS,
  Icon,
  LogoNamoContainerS,
  LogoNamoText,
  WrapSearchT,
} from './header.styled';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ParamsQuery } from '@context/filter-search';

const HeaderMobile = () => {
  const [searchParams, setSearchParams] = useSearchParams({});
  const [isSearch, setIsSearch] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const [valueSearch, setValueSearch] = useState('');
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleClickLogo = () => {
    if (pathname !== ROUTES.HOME) {
      navigate(ROUTES.HOME);
    }
    setIsMenu(false);
  };

  const handleShowInputSearch = () => {
    setIsSearch(true);
    setIsMenu(false);
  };

  const handleCancelSearch = () => {
    const params: ParamsQuery = Object.fromEntries([...searchParams]);
    setIsSearch(false);
    setValueSearch('');

    if (params.search) {
      const { search, ...newParams } = params;
      setSearchParams({ ...newParams }, { replace: true });
    }
  };

  useEffect(() => {
    if (pathname === ROUTES.HOME) {
      const params: ParamsQuery = Object.fromEntries([...searchParams]);
      if (Object.keys(params).length !== 0 && params.search) {
        setValueSearch(params.search);
        setIsSearch(true);
      } else {
        setValueSearch('');
        setIsSearch(false);
      }
    } else {
      setIsSearch(false);
    }
  }, [pathname, searchParams]);

  return (
    <HeaderContainerS>
      <Content className="ps-4 pe-4">
        {isSearch ? (
          <WrapSearchT className="ms-0">
            <ContainerSearch
              valueSearch={valueSearch}
              onSetValueSearch={setValueSearch}
              listKeyLocal={'listKeySearch'}
              isSearchHome={true}
              zIndex={10}
            />
          </WrapSearchT>
        ) : (
          <LogoNamoContainerS onClick={handleClickLogo}>
            <LogoNamoNoName />
            <LogoNamoText>NAMO</LogoNamoText>
          </LogoNamoContainerS>
        )}

        {isSearch ? (
          <Cancel onClick={handleCancelSearch} zIndex={10}>
            Cancel
          </Cancel>
        ) : (
          <ActionContainerT>
            <Icon onClick={handleShowInputSearch}>
              <IcBxSearch />
            </Icon>

            <Icon onClick={() => setIsMenu((pre) => !pre)}>
              {isMenu ? <IcXCrossExit /> : <IcBxMenu />}
            </Icon>
          </ActionContainerT>
        )}

        {isMenu && <MenuScreenMobile onSetIsMenu={setIsMenu} />}
      </Content>
    </HeaderContainerS>
  );
};

export default memo(HeaderMobile);
