import { FILTER_PROFILE } from '@constants/common';
import { PROFILE_ROUTES } from '@constants/routes';
import { FilterSearchContext, ParamsQuery } from '@context/filter-search';
import { Colors, FontHeight, FontSize } from '@namo-workspace/themes';
import Loading from '@namo-workspace/ui/Loading';
import { Body3 } from '@namo-workspace/ui/Typography';
import { ReactNode, Suspense, useContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';
import styled, { css } from 'styled-components';

interface NavTabItemProps {
  active?: boolean;
}

export interface NavTab {
  path: string;
  label: string | ReactNode;
  icon: string | ReactNode;
}

export type TabsProps<T = unknown> = {
  className?: string;
  tabs: NavTab[];
} & T;

export default function NavTabs<T>({ className, tabs, ...rest }: TabsProps<T>) {
  const { pathname } = useLocation();
  const { setIsFilterProfile, setIsSearchProfile } =
    useContext(FilterSearchContext);
  const navigate = useNavigate();

  const [paramsGallery, setParamsGallery] = useState<ParamsQuery>({});
  const [paramsForRent, setParamsForRent] = useState<ParamsQuery>({});
  const [paramsRentals, setParamsRentals] = useState<ParamsQuery>({});
  const [isReLoad, setIsReLoad] = useState<boolean>(false);

  useEffect(() => {
    const filterLocal = JSON.parse(
      localStorage.getItem(FILTER_PROFILE) || '{}'
    );
    if (filterLocal.gallery) {
      setParamsGallery(filterLocal.gallery);
    }
    if (filterLocal.rentals) {
      setParamsRentals(filterLocal.rentals);
    }
    if (filterLocal.forRent) {
      setParamsForRent(filterLocal.forRent);
    }
  }, [isReLoad]);

  const handleNavigateTab = (to: string) => {
    const paramsQuery =
      to === PROFILE_ROUTES.FOR_RENT
        ? paramsForRent
        : to === PROFILE_ROUTES.GALLERY
        ? paramsGallery
        : paramsRentals;

    if (Object.keys(paramsQuery).length !== 0) {
      navigate({
        pathname: to,
        search: createSearchParams({ ...paramsQuery }).toString(),
      });
    } else {
      navigate(to);
    }

    setIsFilterProfile(false);
    setIsSearchProfile(false);
    setIsReLoad((prev) => !prev);
  };

  return (
    <TabsContainer className={className}>
      <TabsHeader>
        {tabs.map((tab) => (
          <TabItem
            key={tab.path}
            active={pathname.includes(tab.path)}
            className="flex-grow-0 flex-grow-1 tab-itemM"
            onClick={() => handleNavigateTab(tab.path)}
          >
            <Icon>{tab.icon}</Icon>
            <TextHeader>{tab.label}</TextHeader>
          </TabItem>
        ))}
      </TabsHeader>

      <TabsBody>
        <Suspense fallback={<Loading />}>
          <Outlet context={{ ...rest }} />
        </Suspense>
      </TabsBody>
    </TabsContainer>
  );
}

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
  padding: 0;
  width: 100%;
  overflow-x: scroll;
  border-bottom: 1px solid ${Colors.strokeLevel3};
  border-radius: 16px 16px 0px 0px;
  margin-bottom: 0;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabsBody = styled.div`
  flex: 1;
  padding: 20px 0;
`;

const TabItem = styled.div<NavTabItemProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 180px;
  height: 100%;
  cursor: pointer;
  text-decoration: none;

  &:hover span {
    font-size: 15px;
  }

  ${({ active }) =>
    active &&
    css`
      border-bottom: 2px solid ${Colors.primaryOrange};
    `};

  @media (max-width: 991.98px) {
    min-width: 140px;
  }

  @media (max-width: 575.98px) {
    min-width: 110px;
  }
`;

const TextHeader = styled(Body3)`
  display: inline-block;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
  color: ${Colors.textLevel3};
  transition: all 0.2ms cubic-bezier(0.075, 0.82, 0.165, 1);

  @media (max-width: 575.98px) {
    font-size: ${FontSize.sub}px;
    line-height: ${FontHeight.sub}px;
  }
`;

const Icon = styled.span`
  width: 20px;
  height: 20px;
  margin-right: 6px;
  line-height: 14px;
  transition: all 0.2ms cubic-bezier(0.075, 0.82, 0.165, 1);

  @media (max-width: 575.98px) {
    margin-right: 4px;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;
