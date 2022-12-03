import Button from '@namo-workspace/ui/Button';
import styled from 'styled-components';
import Cropper from 'react-cropper';
import { SetStateAction, useState } from 'react';
import ModalContainer from './ModalContainer';
import { authApi } from '@namo-workspace/services';
import { toast } from 'react-toastify';
import {
  SIZE_PICTURE_AVATAR,
  SIZE_PICTURE_COVER_PHOTO,
  TYPE_CHANGE_PICTURE,
} from '@containers/profile/constants';
import { environment } from '@namo-workspace/environments';
import useMediaQuery, { QUERY } from '@hooks/useMediaQuery';
import { MESSAGE, SUCCESS } from '@namo-workspace/utils';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  typeEdit?: string;
  fileType: string;
  onSetIsEditProfile?: React.Dispatch<SetStateAction<boolean>>;
};

export default function ModalCoverPicture({
  isOpen,
  onClose,
  src,
  typeEdit,
  fileType,
  onSetIsEditProfile,
}: Props) {
  const [cropper, setCropper] = useState<Cropper>();
  const isDesktop = useMediaQuery(QUERY.DESKTOP);

  const handleCoverPicture = () => {
    try {
      if (typeof cropper !== 'undefined') {
        cropper
          .getCroppedCanvas({
            width:
              typeEdit === TYPE_CHANGE_PICTURE.COVER_PHOTO
                ? SIZE_PICTURE_COVER_PHOTO.WIDTH
                : SIZE_PICTURE_AVATAR.WIDTH,
            height:
              typeEdit === TYPE_CHANGE_PICTURE.COVER_PHOTO
                ? SIZE_PICTURE_COVER_PHOTO.HEIGHT
                : SIZE_PICTURE_AVATAR.HEIGHT,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high',
          })
          .toBlob(async (blob) => {
            const resPicture = await authApi.postUploads({
              fileType: fileType,
              prefix: 'profiles',
              files: blob,
            });

            if (resPicture.data[0].key) {
              if (typeEdit === TYPE_CHANGE_PICTURE.COVER_PHOTO) {
                await authApi.putUserInfo({
                  coverImage: `${environment.urlS3Amazonaws}/${resPicture.data[0].key}`,
                });
              } else {
                await authApi.putUserInfo({
                  avatar: `${environment.urlS3Amazonaws}/${resPicture.data[0].key}`,
                });
              }

              toast.success(SUCCESS.UPLOAD);
              onClose();
              onSetIsEditProfile && onSetIsEditProfile(true);
            }
          }, fileType);
      }
    } catch (err) {
      toast.error(MESSAGE.ER001);
      throw err;
    }
  };

  return (
    <ModalContainer
      isOpen={isOpen}
      size={isDesktop ? 'medium' : 'small'}
      title="Change Profile Picture"
      description={
        <Cropper
          style={
            isDesktop
              ? { height: '532px', width: '100%' }
              : { height: '335px', width: '100%' }
          }
          initialAspectRatio={
            typeEdit === TYPE_CHANGE_PICTURE.COVER_PHOTO ? 16 / 9 : 1
          }
          src={src}
          viewMode={1}
          dragMode="move"
          cropBoxMovable={false}
          responsive={true}
          checkOrientation={false}
          onInitialized={(instance) => {
            setCropper(instance);
          }}
        />
      }
      footer={
        <>
          <ButtonS mr={4} color="white" onClick={onClose}>
            Cancel
          </ButtonS>
          <ButtonS onClick={handleCoverPicture}>Save</ButtonS>
        </>
      }
    />
  );
}

const ButtonS = styled(Button)`
  flex: 1;
  margin-top: 1.5rem;
`;
