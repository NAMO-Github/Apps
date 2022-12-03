import { ROUTES } from '@constants/routes';
import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface Props {
  children: ReactElement;
  isLoggedIn: boolean;
}

const PrivateRoute: FC<Props> = ({ children, isLoggedIn }) => {
  const location = useLocation();
  return isLoggedIn ? (
    children
  ) : (
    <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} />
  );
};

export default PrivateRoute;
