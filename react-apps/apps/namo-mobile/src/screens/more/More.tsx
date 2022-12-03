import React, { FC, useState, useRef, useMemo, useEffect } from 'react';
import {
  Container,
  ProfileLink,
  ProfileDescription,
  ProfileLinkValue,
  GroupActions,
  ActionButton,
  ActionText,
  LogoutButton,
  LogoutText,
  CopyToast,
  Message,
} from './More.style';
import { Share } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { tokenManager } from '@namo-workspace/services';
import { Images } from '@images';
import Popup from '@namo-workspace/ui/Popup';
import { useAuth } from '@context/auth';
import { navigationService } from '@services/navigation';
import { ProfileRouter } from '@routes/routes.constants';
import { Colors } from '@namo-workspace/themes';
import { environment } from '@namo-workspace/environments';

const { IcLogout } = Images;

const More: FC = () => {
  const [copy, setCopy] = useState<boolean>(false);
  const { address } = useAuth();
  const popUpRef = useRef(null);
  const [popUpTitle, setPopUpTitle] = useState<string>('');
  const link = useMemo(
    () => `${environment.profileUrl}/${address}/for-rent`,
    [address]
  );
  const { token } = useAuth();

  const handleClose = () => {
    popUpRef?.current?.close();
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `${link}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      setPopUpTitle(error.message);
      popUpRef?.current?.open();
    }
  };

  const handleCopy = () => {
    Clipboard.setString(link);
    setCopy(!copy);
  };

  const handleLogout = () => {
    tokenManager.doLogout();
    navigationService.navigator.navigate(ProfileRouter.PROFILE);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (copy) {
        setCopy(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [copy]);

  return (
    <Container>
      <ProfileLink fontWeight="600">Your profile link</ProfileLink>
      <ProfileDescription>Your personalised link on NAMO</ProfileDescription>
      <ProfileLinkValue fontWeight="600">{link}</ProfileLinkValue>
      <GroupActions>
        <ActionButton activeOpacity={0.8} onPress={handleShare}>
          <ActionText fontWeight="600">Share</ActionText>
        </ActionButton>
        <ActionButton activeOpacity={0.8} onPress={handleCopy}>
          <ActionText fontWeight="600">Copy Link</ActionText>
        </ActionButton>
        {copy ? (
          <CopyToast>
            <Message fontWeight="400" fontSize={14} color={Colors.white}>
              Copied
            </Message>
          </CopyToast>
        ) : null}
      </GroupActions>

      {!!token && (
        <LogoutButton onPress={handleLogout}>
          <IcLogout />
          <LogoutText fontWeight="600">Log out</LogoutText>
        </LogoutButton>
      )}
      <Popup
        ref={popUpRef}
        title={popUpTitle}
        buttonHandle="OK"
        handleFunction={handleClose}
      />
    </Container>
  );
};
export default More;
