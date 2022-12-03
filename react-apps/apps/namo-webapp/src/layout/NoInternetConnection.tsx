import imgNoInternet from '@assets/images/common/img-no-internet.png';
import { Colors } from '@namo-workspace/themes';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const NoInternetImage = React.createElement('img', {
  src: imgNoInternet,
  alt: 'no internet',
  className: 'mb-3',
});

interface Props {
  children: React.ReactNode;
}
const NoInternetConnection = ({ children }: Props) => {
  const [isOnline, setOnline] = useState(true);

  // preload image

  useEffect(() => {
    setOnline(navigator.onLine);
    const handleOnline = () => {
      setOnline(true);
    };
    const handleOffline = () => {
      setOnline(false);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // event listeners to update the state

  // if user is online, return the child component else return a custom component
  if (isOnline) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  return (
    <ContainerS>
      {NoInternetImage}
      <TitleS className="mb-2">No connection</TitleS>
      <DescriptionS>
        No internet connection found. Check your connection or try again.
      </DescriptionS>
    </ContainerS>
  );
};

const ContainerS = styled.div`
  height: calc(100vh - 64px);
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
`;

const TitleS = styled.div`
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;

  color: ${Colors.textLevel1};
`;

const DescriptionS = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: ${Colors.textLevel3};
  max-width: 270px;
`;
export default NoInternetConnection;
