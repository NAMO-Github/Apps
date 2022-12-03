import { ReactComponent as IcForRent } from '@assets/images/common/ic_forRent.svg';
import { ReactComponent as IcGallery } from '@assets/images/common/ic_gallery.svg';
import { ReactComponent as IcMyOrder } from '@assets/images/common/ic_MyOrder.svg';
import { ReactComponent as IcRentals } from '@assets/images/common/ic_rentals.svg';
import NavTabs, { NavTab } from '@components/Route/NavTabs';
import { PROFILE_ROUTES, ROUTES } from '@constants/routes';
import { TabProps } from '@containers/profile/components/TabContent';
import Profile from '@containers/profile/Profile';
import { useAuth } from '@context/auth';
import { useWalletAuth } from '@context/wallet-auth';
import useTypeLocation from '@hooks/useTypeLocation';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

interface LocationType {
  from?: string;
}
const ProfilePage = () => {
  const { account, isConnected } = useWalletAuth();

  const { isLoggedIn, login, getUserInfo, userInfo, isLoading } = useAuth();
  const navigate = useNavigate();
  const { state } = useTypeLocation<LocationType>();

  const [isEditProfile, setIsEditProfile] = useState<boolean>(false);

  const navTabs: NavTab[] = useMemo(
    () => [
      {
        path: PROFILE_ROUTES.FOR_RENT,
        label: 'FOR RENT',
        icon: <IcForRent />,
      },
      {
        path: PROFILE_ROUTES.RENTALS,
        label: 'RENTALS',
        icon: <IcRentals />,
      },
      {
        path: PROFILE_ROUTES.GALLERY,
        label: 'GALLERY',
        icon: <IcGallery />,
      },
      {
        path: PROFILE_ROUTES.ORDERS,
        label: 'ORDERS',
        icon: <IcMyOrder />,
      },
    ],

    []
  );

  useEffect(() => {
    if (!isConnected) {
      navigate(ROUTES.LOGIN);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  useEffect(() => {
    if (!isLoggedIn && account) {
      if (state?.from === ROUTES.LOGIN) {
        login(account, true);
      } else {
        navigate(ROUTES.LOGIN);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, isLoggedIn, login]);

  useEffect(() => {
    if (isLoggedIn) getUserInfo();
  }, [getUserInfo, isLoggedIn]);

  useEffect(() => {
    if (isEditProfile) {
      getUserInfo();
      setIsEditProfile(false);
    }
  }, [getUserInfo, isEditProfile, setIsEditProfile]);

  return (
    <Profile
      userInfo={userInfo}
      onSetIsEditProfile={setIsEditProfile}
      isLoading={isLoading}
    >
      <NavTabs<TabProps>
        tabs={navTabs}
        statusPublic={false}
        address={account}
      />
    </Profile>
  );
};

export default ProfilePage;
