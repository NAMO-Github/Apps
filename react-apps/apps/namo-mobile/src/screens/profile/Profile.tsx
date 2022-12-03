import ConnectWallet from '@containers/profile/ConnectWallet';
import { useAuth } from '@context/auth';
import { useUserInfo } from '@context/auth/UserInfoContext';
import { useIsFocused } from '@react-navigation/native';
import React, { FC, useEffect, useState } from 'react';
import MyProfileScreen from './MyProfile';

interface Profile {
  avatar?: string;
  bio?: string;
  coverImage?: string;
  email?: string;
  follower?: number;
  following?: number;
  name?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  userName?: string;
}

const Profile: FC<Profile> = () => {
  const { isLoggedIn } = useAuth();
  const { userInfo, refreshUserInfo } = useUserInfo();

  const [initialValue, setInitialValue] = useState<Profile>({
    bio: '',
    email: '',
    avatar: '',
    coverImage: '',
    follower: 0,
    following: 0,
    name: '',
    facebook: '',
    instagram: '',
    twitter: '',
    tiktok: '',
    userName: '',
  });
  const isFocused = useIsFocused();

  useEffect(() => {
    if (userInfo) {
      const splitLink = userInfo.socialMediaLink
        ? JSON.parse(userInfo.socialMediaLink)
        : '';
      setInitialValue({
        name: userInfo.name,
        userName: userInfo.userName,
        bio: userInfo.bio,
        email: userInfo.email,
        facebook: splitLink.facebook || '',
        instagram: splitLink.instagram || '',
        twitter: splitLink.twitter || '',
        tiktok: splitLink.tiktok || '',
        avatar: userInfo.avatar,
        coverImage: userInfo.coverImage,
        follower: userInfo.follower,
        following: userInfo.following,
      });
    }
  }, [userInfo]);

  // const fetchAPIProfile = useCallback(async () => {
  //   await authApi
  //     .getUserInfo()
  //     .then((res) => {
  //   const splitLink = res?.socialMediaLink
  //     ? JSON.parse(res?.socialMediaLink)
  //     : '';
  //   setInitialValue({
  //     name: res?.name,
  //     userName: res?.userName,
  //     bio: res?.bio,
  //     email: res?.email,
  //     facebook: splitLink?.facebook || '',
  //     instagram: splitLink?.instagram || '',
  //     twitter: splitLink?.twitter || '',
  //     tiktok: splitLink?.tiktok || '',
  //     avatar: res?.avatar,
  //     coverImage: res?.coverImage,
  //     follower: res?.follower,
  //     following: res?.following,
  //   });
  // })
  //     .catch((err) => {
  //       //err
  //     });
  // }, []);

  useEffect(() => {
    if (isLoggedIn && isFocused) {
      refreshUserInfo();
    }
  }, [refreshUserInfo, isLoggedIn, isFocused]);

  return isLoggedIn ? (
    <MyProfileScreen profile={initialValue} />
  ) : (
    <ConnectWallet />
  );
};

export default Profile;
