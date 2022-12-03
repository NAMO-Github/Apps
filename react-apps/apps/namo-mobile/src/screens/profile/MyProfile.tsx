import React, { FC } from 'react';
import MyProfileContainer from '../../containers/profile/MyProfile';
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

interface Props {
  profile?: Profile;
}

const MyProfileScreen: FC<Props> = (props) => {
  return <MyProfileContainer profile={props.profile} />;
};
export default MyProfileScreen;
