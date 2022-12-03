import ModalChooseImage from '@containers/modal/ModalChooseImage';
import ModalFullImage from '@containers/modal/ModalFullImage';
import Images from '@images';
import { Colors } from '@namo-workspace/themes';
import Popup from '@namo-workspace/ui/Popup';
import { Body2, Body4 } from '@namo-workspace/ui/Typography';
import { getMediaLink, MediaType } from '@namo-workspace/utils';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileRouter } from '@routes/routes.constants';
import { ProfileStackParams } from '@routes/routes.model';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Linking, Pressable, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import FollowInfo from './FollowInfo';

const { IcCamera, IcFacebook, IcInstagram, IcTwitter, IcTiktok, IcMore } =
  Images;
const SIZE_IMAGE = 88;

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
  buttonName: string;
  buttonColor?: 'main' | 'white';
  isMyProfile?: boolean;
  profile?: Profile;
  isPublic?: boolean;
}

export type ProfileProp = NativeStackNavigationProp<
  ProfileStackParams,
  'PROFILE'
>;

const HeaderProfile: FC<Props> = ({
  buttonName,
  buttonColor,
  isMyProfile,
  profile,
  isPublic,
}) => {
  const popUpRef = useRef(null);
  const navigation = useNavigation<ProfileProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const [avatar, setAvatar] = useState(profile?.avatar);
  const [cover, setCover] = useState(profile?.coverImage);
  const [visibleChooseImage, setVisibleChooseImage] = useState(false);
  const [isAvatar, setIsAvatar] = useState(false);
  const closeChooseImage = useCallback(() => setVisibleChooseImage(false), []);

  const openChooseImage = useCallback((isAvatar: boolean) => {
    setIsAvatar(isAvatar);
    setVisibleChooseImage(true);
  }, []);

  const handleCloseImage = useCallback(() => {
    setModalVisible(!modalVisible);
  }, [modalVisible]);

  const handleOpenAvatar = useCallback(() => {
    setIsAvatar(true);
    setModalVisible(true);
  }, []);

  const handleMore = () => {
    navigation.navigate(ProfileRouter.MORE, {
      userName: profile?.userName,
    });
  };

  const handleOpenCover = useCallback(() => {
    setIsAvatar(false);
    setModalVisible(true);
  }, []);

  const handleLinking = useCallback(async (media: MediaType, url: string) => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(getMediaLink(url, media));

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(getMediaLink(url, media));
    } else popUpRef?.current?.open();
  }, []);

  const handleClose = () => {
    popUpRef?.current?.close();
  };

  useEffect(() => {
    setAvatar(profile?.avatar);
    setCover(profile?.coverImage);
  }, [profile?.avatar, profile?.coverImage]);

  return (
    <Container pointerEvents="box-none">
      <Pressable disabled={!cover} onPress={handleOpenCover}>
        <HeaderBackground
          source={
            cover
              ? { uri: cover }
              : require('../../assets/images/img_profile_cover.png')
          }
        />
        {isMyProfile && (
          <CoverContainer>
            <Options onPress={handleMore}>
              <IcMore />
            </Options>
            <Options onPress={() => openChooseImage(false)}>
              <IcCamera />
            </Options>
          </CoverContainer>
        )}
      </Pressable>
      <ImageContainer>
        <Pressable disabled={!avatar} onPress={handleOpenAvatar}>
          <ImageAvatar
            source={
              avatar
                ? { uri: avatar }
                : require('../../assets/images/img_avatar.png')
            }
          />
        </Pressable>

        {isMyProfile && (
          <AvatarContainer onPress={() => openChooseImage(true)}>
            <IcCamera />
          </AvatarContainer>
        )}
      </ImageContainer>
      <UserInformation pointerEvents="box-none">
        <UserName
          fontSize={16}
          fontWeight="700"
          fontStyle="normal"
          color={Colors.textLevel1}
          font="Bold"
        >
          {profile?.name || 'Unnamed'}
        </UserName>
        <UserId
          fontSize={12}
          fontWeight="700"
          fontStyle="normal"
          color={Colors.textLevel3}
        >
          @{profile?.userName || 'Username'}
        </UserId>
        {profile?.bio ? (
          <UserStory
            fontSize={12}
            fontWeight="400"
            fontStyle="normal"
            color={Colors.textLevel3}
          >
            {profile?.bio}
          </UserStory>
        ) : null}
        <SocialLink>
          {profile?.facebook ? (
            <SocialItem
              onPress={() => handleLinking('facebook', profile?.facebook)}
              activeOpacity={0.8}
            >
              <IcFacebook />
            </SocialItem>
          ) : null}
          {profile?.instagram ? (
            <SocialItem
              onPress={() => handleLinking('instagram', profile?.instagram)}
              activeOpacity={0.8}
            >
              <IcInstagram />
            </SocialItem>
          ) : null}
          {profile?.twitter ? (
            <SocialItem
              onPress={() => handleLinking('twitter', profile?.twitter)}
              activeOpacity={0.8}
            >
              <IcTwitter />
            </SocialItem>
          ) : null}
          {profile?.tiktok ? (
            <SocialItem
              onPress={() => handleLinking('tiktok', profile?.tiktok)}
              activeOpacity={0.8}
            >
              <IcTiktok />
            </SocialItem>
          ) : null}
        </SocialLink>
      </UserInformation>
      <FollowInfo
        follower={profile?.follower}
        following={profile?.following}
        buttonName={buttonName}
        buttonColor={buttonColor}
        isPublic={isPublic}
      />
      <ModalFullImage
        modalVisible={modalVisible}
        handleClose={handleCloseImage}
        imgUri={isAvatar ? avatar : cover}
      />
      <ModalChooseImage
        isAvatar={isAvatar}
        visible={visibleChooseImage}
        closeChooseImage={closeChooseImage}
        setImgUri={(link: string) => {
          isAvatar ? setAvatar(link) : setCover(link);
        }}
        requiredField={profile}
      />
      <Popup
        ref={popUpRef}
        title="Invalid URL"
        buttonHandle="OK"
        handleFunction={handleClose}
      />
    </Container>
  );
};
export default HeaderProfile;

const Container = styled.View`
  flex: 1;
  background-color: ${Colors.white};
`;

const HeaderBackground = styled.Image`
  width: 100%;
  height: 96px;
  background-color: ${Colors.secondary};
`;

const ImageContainer = styled.View`
  position: relative;
  align-items: center;
  justify-content: center;
  top: -${SIZE_IMAGE / 4}px;
  height: ${SIZE_IMAGE / 2}px;
`;
const UserInformation = styled.View`
  padding: 0 16px;
  position: relative;
  align-items: center;
  justify-content: center;
`;

const ImageAvatar = styled.Image`
  border-width: 1px;
  width: ${SIZE_IMAGE}px;
  height: ${SIZE_IMAGE}px;
  border-color: ${Colors.white};
  border-radius: ${SIZE_IMAGE / 2}px;
`;

const UserName = styled(Body2)`
  text-align: center;
`;

const UserId = styled(Body4)`
  text-align: center;
  margin-top: 3px;
`;

const UserStory = styled(Body4)`
  margin-top: 8px;
  text-align: center;
`;

export const NFTHeader = styled(TouchableOpacity)`
  align-items: center;
  justify-content: center;
`;

const SocialLink = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
`;

const SocialItem = styled(TouchableOpacity)`
  margin: 4px;
`;

const AvatarContainer = styled.Pressable`
  position: absolute;
  align-items: center;
  justify-content: center;
  top: 70%;
  right: 38%;
  border-width: 1px;
  width: 32px;
  height: 32px;
  border-color: ${Colors.border};
  border-radius: 16px;
  background-color: ${Colors.white};
`;

const Options = styled.Pressable`
  align-items: center;
  justify-content: center;
  border-width: 1px;
  width: 32px;
  height: 32px;
  border-color: ${Colors.border};
  border-radius: 16px;
  background-color: ${Colors.white};
`;

const CoverContainer = styled.View`
  padding: 8px 0;
  position: absolute;
  right: 2%;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
`;
