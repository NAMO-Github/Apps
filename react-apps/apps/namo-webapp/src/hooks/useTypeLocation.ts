import { useLocation } from 'react-router';

const useTypeLocation = <T>() => {
  const location = useLocation();
  return { ...location, state: location.state as T | undefined };
};

export default useTypeLocation;
