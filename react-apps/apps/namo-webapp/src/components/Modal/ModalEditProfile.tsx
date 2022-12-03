import { useAuth } from '@context/auth';
import Button from '@namo-workspace/ui/Button';
import TextField from '@namo-workspace/ui/Form/TextField';
import TextArea from '@namo-workspace/ui/Form/TextArea';
import editUserSchema from '@namo-workspace/yupSchema/editUserSchema';
import { Form, Formik } from 'formik';
import React, { SetStateAction, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import ModalContainer from './ModalContainer';
import { authApi } from '@namo-workspace/services';
import { toast } from 'react-toastify';
import { useCallbackPrompt } from '@hooks/useCallbackPrompt';
import { ScrollToFieldError } from '@components/ScrollToFieldError';
import ModalConfirm from './ModalConfirm';
import useMediaQuery, { QUERY } from '@hooks/useMediaQuery';
import { MESSAGE, SUCCESS } from '@namo-workspace/utils';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onOk?: () => void;
  src?: string;
  onSetIsEditProfile?: React.Dispatch<SetStateAction<boolean>>;
};

interface Values {
  name: string;
  userName: string;
  bio: string;
  email: string;
  tiktok: string;
  twitter: string;
  instagram: string;
  facebook: string;
}

export default function ModalEditProfile({
  isOpen,
  onClose,
  onSetIsEditProfile,
}: Props) {
  const { userInfo } = useAuth();
  const [isNotice, setIsNotice] = useState<boolean>(false);
  const [isChangeValues, setIsChangeValues] = useState<boolean>(false);
  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(isChangeValues);
  const isMobile = useMediaQuery(QUERY.ONLY_MOBILE);

  const initialValue = useMemo(() => {
    try {
      const socialMediaLink =
        !!userInfo?.socialMediaLink &&
        JSON.parse(userInfo.socialMediaLink || '{}');

      return {
        name: userInfo?.name || '',
        userName: userInfo?.userName || '',
        bio: userInfo?.bio || '',
        email: userInfo?.email || '',
        tiktok: socialMediaLink?.tiktok || '',
        twitter: socialMediaLink?.twitter || '',
        instagram: socialMediaLink?.instagram || '',
        facebook: socialMediaLink?.facebook || '',
      };
    } catch (error) {
      return {
        name: userInfo?.name || '',
        userName: userInfo?.userName || '',
        bio: userInfo?.bio || '',
        email: userInfo?.email || '',
        tiktok: '',
        twitter: '',
        instagram: '',
        facebook: '',
      };
    }
  }, [userInfo]);

  const handleSubmit = useCallback(
    (values: Values) => {
      const newValues = {
        name: values.name.trim(),
        userName: values.userName.trim().replace(/\s/g, ''),
        bio: values.bio.trim(),
        email: values.email.trim(),
        socialMediaLink: JSON.stringify({
          tiktok: values.tiktok.trim(),
          twitter: values.twitter.trim(),
          instagram: values.instagram.trim(),
          facebook: values.facebook.trim(),
        }),
      };

      try {
        authApi
          .putUserInfo(newValues)
          .then(() => {
            toast.success(SUCCESS.UPDATED_PROFILE);
            onClose();
            onSetIsEditProfile && onSetIsEditProfile(true);
          })
          .catch((err) => {
            const { data } = err.response;
            toast.error(data.message || MESSAGE.ER001);
          });
      } catch (error) {
        toast.error(MESSAGE.ER001);
        throw error;
      }
    },
    [onClose, onSetIsEditProfile]
  );

  const handleCancel = useCallback(() => {
    if (isChangeValues) {
      setIsNotice(true);
    } else {
      onClose();
    }
  }, [isChangeValues, onClose]);

  const handleOkPopup = () => {
    showPrompt && confirmNavigation();
    setIsNotice(false);
    onClose();
  };

  const handleCancelNotice = () => {
    setIsNotice(false);
    showPrompt && cancelNavigation();
  };

  const handleLimitLines = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    const { target, keyCode } = event;

    if (
      keyCode === 13 &&
      ((target as HTMLTextAreaElement).value.match(/\n/g) || []).length > 4
    ) {
      event.preventDefault();
    }
  };

  return (
    <>
      <ModalContainer
        size={isMobile ? 'small' : 'medium'}
        isOpen={isOpen}
        title="Privacy info"
        description={
          <Formik
            initialValues={initialValue}
            validationSchema={editUserSchema}
            onSubmit={(values: Values) => {
              handleSubmit(values);
            }}
          >
            <FormS onChange={() => setIsChangeValues(true)}>
              <ScrollToFieldError />
              <TextField
                size="large"
                type="text"
                label="Name"
                name="name"
                require
                placeholder="Input name"
                maxLength={150}
              />
              <TextField
                size="large"
                type="text"
                label="Username"
                name="userName"
                require
                placeholder="Input username"
                maxLength={100}
              />

              <TextArea
                id="bio"
                name="bio"
                label="Bio"
                placeholder="Input bio"
                rows={3}
                maxLength={250}
                onKeyDown={(e) => handleLimitLines(e)}
              />

              <TextField
                size="large"
                label="Email"
                require
                name="email"
                type="email"
                placeholder="Input email"
              />

              <WrapSocialLink>
                <TextField
                  size="large"
                  type="text"
                  label="Social Media Link"
                  name="facebook"
                  placeholder="Paste Facebook link here."
                />
                <TextField
                  size="large"
                  type="text"
                  name="instagram"
                  placeholder={`Input Instagram username("@" not required).`}
                />
                <TextField
                  size="large"
                  type="text"
                  name="twitter"
                  placeholder={`Input Twitter username("@" not required).`}
                />
                <TextField
                  size="large"
                  type="text"
                  name="tiktok"
                  placeholder={`Input Tiktok username("@" not required).`}
                />
              </WrapSocialLink>

              <WrapButton>
                <ButtonS
                  mr={4}
                  type="button"
                  color="white"
                  size="large"
                  onClick={handleCancel}
                >
                  Cancel
                </ButtonS>
                <ButtonS type="submit" size="large">
                  Save
                </ButtonS>
              </WrapButton>
            </FormS>
          </Formik>
        }
      />

      <ModalConfirm
        isOpen={isNotice || showPrompt}
        size="small"
        title="Information will not be saved"
        description="Are you sure? Information entered will not be saved."
        cancelText="Cancel"
        okText="Leave"
        onClose={handleCancelNotice}
        onOk={handleOkPopup}
      />
    </>
  );
}

const FormS = styled(Form)`
  & textarea {
    height: 96px !important;
  }
`;

const WrapButton = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
`;

const ButtonS = styled(Button)`
  flex: 1;
`;

const WrapSocialLink = styled.div`
  & label {
    margin-bottom: 8px;
  }
`;
