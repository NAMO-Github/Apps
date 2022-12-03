import React, { FC } from 'react';
import { Container } from './NoInternet.style';
import NoInternetElement from '@containers/common/NoInternet';

const NoInternet: FC = () => {
  return (
    <Container>
      <NoInternetElement />
    </Container>
  );
};
export default NoInternet;
