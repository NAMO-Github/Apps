import NavigationBackBlocker from '@containers/navigator/NavigationBackBlocker';
import NavigationGestureBlocker from '@containers/navigator/NavigationGestureBlocker';
import { useAuth } from '@context/auth';
import { useUserInfo } from '@context/auth/UserInfoContext';
import { authApi } from '@namo-workspace/services';
import { Colors } from '@namo-workspace/themes';
import Button from '@namo-workspace/ui/Button';
import InputField from '@namo-workspace/ui/form/InputField';
import Popup from '@namo-workspace/ui/Popup';
import { Body2, Body3, Body4 } from '@namo-workspace/ui/Typography';
import View from '@namo-workspace/ui/view/View';
import { ERROR, SUCCESS } from '@namo-workspace/utils';
import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileRouter } from '@routes/routes.constants';
import { ProfileStackParams } from '@routes/routes.model';
import { showMessageError, showMessageSuccess } from '@services/showMessage';
import { Formik, FormikProps } from 'formik';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styled from 'styled-components';
import * as Yup from 'yup';
import IconBxCopy from '../../assets/images/profile/ic-bx-copy.svg';

interface Values {
  name: string;
  userName: string;
  bio: string;
  email: string;
  // socialMediaLink: Links;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
}

const editUserSchema = Yup.object().shape({
  name: Yup.string()
    .max(150, 'Maximum 150 characters')
    .required('Please enter your name!'),
  userName: Yup.string()
    .max(100, 'Maximum 100 characters')
    .required('Please enter your username!'),
  bio: Yup.string().max(250, 'Maximum 250 characters').nullable(),
  email: Yup.string()
    .email(
      // /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/,
      'You have entered an invalid email address. Please enter a valid email address. For example: abc@domain.com'
    )
    .required('Please enter your email!'),
});

export type EditProfileProp = NativeStackNavigationProp<
  ProfileStackParams,
  'PROFILE'
>;

const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

const EditProfileContainer: FC = () => {
  const popUpRef = useRef(null);
  const canByPassNavigate = useRef(false);
  const formikRef = useRef<FormikProps<Values>>(null);
  const nameRef = useRef(null);
  const userNameRef = useRef(null);
  const emailRef = useRef(null);
  const { isLoggedIn } = useAuth();

  const [initialValue, setInitialValue] = useState<Values>({
    name: '',
    userName: '',
    bio: '',
    email: '',
    facebook: '',
    instagram: '',
    twitter: '',
    tiktok: '',
  });
  const [copy, setCopy] = useState<boolean>(false);
  const [popUpTitle] = useState<string>('');
  const [popUpDesc] = useState<string>('');
  const [cancelTitle] = useState<string>('');
  const [handleTitle] = useState<string>('OK');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const navigation = useNavigation<EditProfileProp>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { refreshUserInfo } = useUserInfo();

  const handleCopy = () => {
    Clipboard.setString(walletAddress);
    setCopy(!copy);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (copy) {
        setCopy(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [copy]);

  const handleClose = () => {
    popUpRef?.current?.close();
    if (handleTitle === 'Leave') {
      navigation.goBack();
    }
  };

  const onSubmit = useCallback(
    (values: Values) => {
      if (isLoggedIn) {
        authApi
          .putUserInfo({
            name: values.name.trim(),
            userName: values.userName.replace(/\s/g, ''),
            bio: values.bio.trim(),
            email: values.email,
            socialMediaLink: JSON.stringify({
              facebook: values.facebook,
              instagram: values.instagram,
              twitter: values.twitter,
              tiktok: values.tiktok,
            }),
          })
          .then(async (res) => {
            await refreshUserInfo();
            setIsSubmitting(false);
            showMessageSuccess(SUCCESS.UPDATED_PROFILE);
            canByPassNavigate.current = true;
            navigation.navigate(ProfileRouter.PROFILE);
          })
          .catch((err) => {
            setIsSubmitting(false);
            const error = JSON.parse(JSON.stringify(err));
            showMessageError(
              error.status === 400
                ? ERROR.ER_USER_EXIST
                : ERROR.ER_STH_WENT_WRONG
            );
          });
      } else {
        showMessageError(ERROR.ER_STH_WENT_WRONG);
      }
    },
    [isLoggedIn, navigation, refreshUserInfo]
  );

  const fetchAPIProfile = useCallback(async () => {
    setIsSubmitting(true);
    await authApi
      .getUserInfo()
      .then((res) => {
        const splitLink =
          res?.socialMediaLink && isJsonString(res?.socialMediaLink)
            ? JSON.parse(res?.socialMediaLink)
            : '';
        setInitialValue({
          name: res?.name ?? '',
          userName: res?.userName ?? '',
          bio: res?.bio ?? '',
          email: res?.email ?? '',
          facebook: splitLink?.facebook ?? '',
          instagram: splitLink?.instagram ?? '',
          twitter: splitLink?.twitter ?? '',
          tiktok: splitLink?.tiktok ?? '',
        });
        setWalletAddress(res?.address);
        setIsSubmitting(false);
      })
      .catch(() => {
        setIsSubmitting(false);
        showMessageError(ERROR.ER_STH_WENT_WRONG);
      });
  }, []);

  useEffect(() => {
    fetchAPIProfile();
  }, [fetchAPIProfile]);

  const firstSix = walletAddress ? walletAddress.slice(0, 6) : '';
  const lastFour = walletAddress
    ? walletAddress.substr(walletAddress.length - 4)
    : '';

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await formikRef?.current?.submitForm();

    const error = Object.keys(formikRef?.current?.errors);

    if (error.length !== 0) {
      switch (error[0]) {
        case 'name':
          setIsSubmitting(false);
          nameRef?.current?.focus();
          break;
        case 'userName':
          setIsSubmitting(false);
          userNameRef?.current?.focus();
          break;
        case 'email':
          setIsSubmitting(false);
          emailRef?.current?.focus();
          break;
      }
    }
  };

  return (
    <Container style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ padding: 16 }}
        style={{ flex: 1 }}
      >
        <Formik
          innerRef={formikRef}
          initialValues={initialValue}
          validationSchema={editUserSchema}
          onSubmit={onSubmit}
          enableReinitialize={true}
          validateOnBlur={true}
        >
          {({ dirty }) => (
            <>
              <NavigationGestureBlocker when={dirty} />
              <EditField
                ref={nameRef}
                name="name"
                label="Name"
                isRequired
                placeholder="Input name."
                maxLength={150}
              />
              <EditField
                ref={userNameRef}
                name="userName"
                label="Username"
                isRequired
                placeholder="Input username."
                maxLength={100}
                trim={true}
              />
              <EditField
                name="bio"
                label="Bio"
                placeholder="Input bio."
                multiline
                maxLength={250}
                preventBreak
                inputStyle={{ height: 96, textAlignVertical: 'top' }}
              />
              <EditField
                ref={emailRef}
                name="email"
                label="Email"
                isRequired
                placeholder="Input email."
                trim={true}
              />
              <EditField
                name="facebook"
                label="Social Media Link"
                placeholder="Paste Facebook link here."
                trim={true}
              />
              <EditField
                name="instagram"
                placeholder="Input Instagram username (“@“ not required)."
                trim={true}
              />
              <EditField
                name="twitter"
                placeholder="Input Twitter username (“@“ not required)."
                trim={true}
              />
              <EditField
                name="tiktok"
                placeholder="Input Tiktok username (“@“ not required)."
                trim={true}
              />
              <Body2
                fontStyle="normal"
                fontWeight="600"
                color={Colors.foreground1}
              >
                Wallet Address
              </Body2>
              <Popup
                ref={popUpRef}
                title={popUpTitle}
                description={popUpDesc}
                buttonCancel={cancelTitle}
                buttonHandle={handleTitle}
                handleFunction={handleClose}
              />
              <NavigationBackBlocker
                when={dirty}
                getCanByPass={() => canByPassNavigate.current}
              />
              <WalletInfo activeOpacity={1} onPress={handleCopy}>
                <Body4
                  fontStyle="normal"
                  fontWeight="400"
                  color={Colors.textLevel3}
                  mr={2.5}
                  style={{ padding: 10, paddingRight: 0 }}
                >
                  {firstSix + '...' + lastFour}
                </Body4>
                <IconBxCopy />
                {copy ? (
                  <View
                    style={{
                      backgroundColor: Colors.foreground,
                      padding: 8,
                      marginLeft: 10,
                      borderRadius: 8,
                    }}
                  >
                    <Body3 fontWeight="400" fontSize={14} color={Colors.white}>
                      Copied
                    </Body3>
                  </View>
                ) : null}
              </WalletInfo>
            </>
          )}
        </Formik>
        <Button
          activeOpacity={0.7}
          disabled={isSubmitting}
          loading={isSubmitting}
          onPress={() => {
            handleSubmit();
          }}
        >
          Save
        </Button>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default EditProfileContainer;

const Container = styled(View)`
  flex: 1;
`;

const EditField = styled(InputField)`
  margin-bottom: 8px;
  width: 100%;
`;

const WalletInfo = styled(TouchableOpacity)`
  flex-direction: row;
  margin-top: 4px;
  margin-bottom: 32px;
  align-items: center;
`;
