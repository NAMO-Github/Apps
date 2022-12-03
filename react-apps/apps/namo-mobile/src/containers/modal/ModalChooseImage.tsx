import React, { FC, useCallback } from 'react';
import { Modal } from 'react-native';
import styled from 'styled-components/native';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { Colors } from '@namo-workspace/themes';
import { Body3 } from '@namo-workspace/ui/Typography';
import { authApi, EditRequest } from '@namo-workspace/services';
import { showMessageError, showMessageSuccess } from '@services/showMessage';
import { ERRORS, EXTERNAL_SERVICES } from '@constants/common';
import { useUserInfo } from '@context/auth/UserInfoContext';
import { ERROR, MESSAGE_VALIDATE_UPLOAD, SUCCESS } from '@namo-workspace/utils';

export interface FileUpload {
  uri: string;
  name: string;
  type: string;
  base64?: string;
  mime?: string;
}

interface Required {
  name?: string;
  userName?: string;
  email?: string;
}
interface Props {
  visible: boolean;
  closeChooseImage: () => void;
  setImgUri: (value: string) => void;
  isAvatar: boolean;
  requiredField?: Required;
}
const ModalChooseImage: FC<Props> = ({
  visible,
  closeChooseImage,
  setImgUri,
  isAvatar,
  requiredField,
}) => {
  const { refreshUserInfo } = useUserInfo();
  const uploadImage = useCallback(async (image: ImageOrVideo) => {
    try {
      const response = await authApi.postUploads({
        fileType: image.mime,
        prefix: 'profiles',
        files: JSON.parse(
          JSON.stringify({
            type: image.mime,
            uri: image.path,
            name:
              image.filename ??
              'image_avatar_' +
                Date.now() +
                '.' +
                (image.path.split('.').pop() ?? 'jpg'),
          })
        ),
      });
      return response;
    } catch (error) {
      // showMessageError(ERROR.ER_STH_WENT_WRONG);
    }
  }, []);

  const updateProfile = useCallback(
    async (imageKey: string) => {
      try {
        const params: EditRequest = {
          name: requiredField?.name || '',
          userName: requiredField?.userName || '',
          email: requiredField?.email || '',
        };
        if (isAvatar) {
          params.avatar = EXTERNAL_SERVICES.S3 + imageKey;
        } else {
          params.coverImage = EXTERNAL_SERVICES.S3 + imageKey;
        }
        await authApi.putUserInfo(params);
        await refreshUserInfo();
        showMessageSuccess(SUCCESS.UPDATED_PROFILE);
      } catch (error) {
        showMessageError(ERROR.ER_STH_WENT_WRONG);
      }
    },
    [
      isAvatar,
      requiredField?.email,
      requiredField?.name,
      requiredField?.userName,
      refreshUserInfo,
    ]
  );

  const chooseImage = useCallback(() => {
    ImagePicker.openPicker({
      cropping: true,
    })
      .then(async (image: ImageOrVideo) => {
        if (image?.size > 10000000) {
          showMessageError(MESSAGE_VALIDATE_UPLOAD.ER_SIZE);
        } else {
          const response = await uploadImage(image);
          updateProfile(response.data[0].key);
        }
      })
      .catch((e) => {
        const error = JSON.parse(JSON.stringify(e));
        if (error.code === 'E_PICKER_CANCELLED') {
          return null;
        } else {
          showMessageError(ERROR.ER_STH_WENT_WRONG);
        }
      })
      .finally(closeChooseImage);
  }, [closeChooseImage, updateProfile, uploadImage]);

  const openCamera = useCallback(() => {
    ImagePicker.openCamera({
      cropping: true,
      useFrontCamera: true,
    })
      .then(async (image: ImageOrVideo) => {
        const response = await uploadImage(image);
        updateProfile(response.data[0].key);
      })
      .catch((e) => {
        const error = JSON.parse(JSON.stringify(e));
        if (error.code === ERRORS.CANCELED_PICKER) {
          return null;
        } else {
          showMessageError(ERROR.ER_STH_WENT_WRONG);
        }
      })
      .finally(closeChooseImage);
  }, [closeChooseImage, updateProfile, uploadImage]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={closeChooseImage}
      transparent={true}
    >
      <ModalContainer onPress={closeChooseImage}>
        <ModalContent>
          <ChooseFromDevice
            style={{ borderRightWidth: 1, borderColor: 'gray' }}
            onPress={chooseImage}
          >
            <OptionText fontWeight="700">Library</OptionText>
          </ChooseFromDevice>
          <ChooseFromDevice
            style={{ borderLeftWidth: 1, borderColor: 'gray' }}
            onPress={openCamera}
          >
            <OptionText fontWeight="700">Camera</OptionText>
          </ChooseFromDevice>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};
export default ModalChooseImage;

const ModalContainer = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-end;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  width: 100%;
  padding: 15px 0;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  height: 30%;
  background-color: white;
  overflow: hidden;
  flex-direction: row;
`;
const ChooseFromDevice = styled.Pressable`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const OptionText = styled(Body3)`
  color: ${Colors.textLevel1};
`;
