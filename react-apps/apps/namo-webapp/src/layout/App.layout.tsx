import useMediaQuery, { QUERY } from '@hooks/useMediaQuery';
import { FC, PropsWithChildren } from 'react';
import styled from 'styled-components';
import Header from './Header';
import HeaderMobile from './Header/HeaderMobile';
import NoInternetConnection from './NoInternetConnection';

const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  const isDesktop = useMediaQuery(QUERY.DESKTOP);

  return (
    <div>
      {isDesktop ? <Header /> : <HeaderMobile />}

      <NoInternetConnection>
        <ChildContainerS>{children}</ChildContainerS>
      </NoInternetConnection>
    </div>
  );
};

const ChildContainerS = styled.div`
  min-height: calc(100vh - 65px);
  position: relative;
`;

export default AppLayout;
