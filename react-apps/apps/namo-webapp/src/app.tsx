import { ReactComponent as IcError } from '@assets/images/common/ic_error.svg';
import { ReactComponent as IcSuccess } from '@assets/images/common/ic_success.svg';
import { ReactComponent as IcWarning } from '@assets/images/common/ic_warning.svg';
import { AppStyles } from '@assets/styles/global.style';
import { ROUTES } from '@constants/routes';
import { useAuth } from '@context/auth';
import { FilterSearchProvider } from '@context/filter-search';
import { useNavigateWithoutPrompt } from '@context/prompt-modal';
import { useWalletAuth } from '@context/wallet-auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'cropperjs/dist/cropper.css';
import { toLower } from 'lodash';
import 'nprogress/nprogress.css';
import { useCallback, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { IconProps, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Main from './pages/Main';

export function App() {
  const { account } = useWalletAuth();
  const { isLoggedIn, userInfo, login } = useAuth();
  const navigateWithoutPrompt = useNavigateWithoutPrompt();

  useEffect(() => {
    const handleChangeAccount = async () => {
      if (isLoggedIn && !!userInfo && !!userInfo.address && !!account) {
        if (toLower(userInfo.address) !== toLower(account)) {
          await login(account);
          navigateWithoutPrompt(ROUTES.HOME);
        }
      }
    };
    handleChangeAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, login]);

  const renderIcon = useCallback(({ type }: IconProps) => {
    switch (type) {
      case 'error':
        return <IcError />;
      case 'success':
        return <IcSuccess />;
      case 'warning':
        return <IcWarning />;
      default:
        return null;
    }
  }, []);

  return (
    <>
      <AppStyles />
      <FilterSearchProvider>
        <Main />
      </FilterSearchProvider>
      <ToastContainer
        position="top-center"
        theme="colored"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        closeButton={false}
        icon={renderIcon}
      />
    </>
  );
}

export default App;
