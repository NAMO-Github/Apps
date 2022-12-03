import { authApi, UserInfo } from '@namo-workspace/services';
import React, {
  Children,
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth } from '@context/auth/Auth';

interface UserInfoContextValue {
  userInfo: UserInfo | null;
  isLoggedIn: boolean;
  refreshUserInfo: () => Promise<UserInfo>;
}

const UserInfoContext = createContext<UserInfoContextValue | null>(null);

const UserInfoProvider = ({ children }: PropsWithChildren) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>({
    bio: '',
    avatar: '',
    email: '',
    coverImage: '',
    userName: '',
    socialMediaLink: '',
    address: '',
    follower: 0,
    following: 0,
    name: '',
    createdAt: '',
    isSigned: '',
    nonce: '',
    role: '',
    updatedAt: '',
    id: '',
  });
  const { isLoggedIn } = useAuth();
  const fetchAPIProfile = useCallback(async () => {
    return authApi.getUserInfo().then((res) => {
      setUserInfo(res);
      return res;
    });
  }, []);
  useEffect(() => {
    if (isLoggedIn) {
      fetchAPIProfile();
    } else {
      setUserInfo(null);
    }
  }, [fetchAPIProfile, isLoggedIn]);
  return (
    <UserInfoContext.Provider
      value={useMemo(() => {
        return {
          userInfo,
          refreshUserInfo: fetchAPIProfile,
          isLoggedIn,
        };
      }, [fetchAPIProfile, isLoggedIn, userInfo])}
    >
      {Children.only(children)}
    </UserInfoContext.Provider>
  );
};

export default UserInfoProvider;

export const useUserInfo = () => {
  const userInfo = useContext(UserInfoContext);
  if (!userInfo) {
    throw new Error('Please wrap in provider');
  }
  return userInfo;
};
