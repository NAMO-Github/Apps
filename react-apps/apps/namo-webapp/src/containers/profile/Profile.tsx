import { ReactComponent as IconBxCamera } from '@assets/images/profile/ic-bx-camera.svg';
import { ReactComponent as IconBxCameraSolid } from '@assets/images/profile/ic_camera_solid.svg';
import ModalCoverPicture from '@components/Modal/ModalCoverPicture';
import { FILTER_PROFILE } from '@constants/common';
import { FilterSearchContext } from '@context/filter-search';
import useMediaQuery, { QUERY } from '@hooks/useMediaQuery';
import useToggle from '@hooks/useToggle';
import { UserInfo } from '@namo-workspace/services';
import { MaxWidthContent } from '@namo-workspace/ui/MaxWidthContent.styled';
import { MESSAGE_VALIDATE_UPLOAD } from '@namo-workspace/utils';
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import ContentLoader, { Facebook } from 'react-content-loader';
import { toast } from 'react-toastify';
import UserProfile from './components/UserProfile';
import { TYPE_CHANGE_PICTURE } from './constants';
import {
  BodyS,
  ContainerS,
  HeaderS,
  ImageBg,
  Input,
  WrapEditPhoto,
  WrapHeader,
} from './profile.styled';

interface IProfileProps {
  isLoading?: boolean;
  userInfo?: UserInfo | null;
  statusPublic?: boolean;
  address?: string;
  children?: React.ReactNode;
  onSetIsEditProfile?: Dispatch<SetStateAction<boolean>>;
}

export default function Profile({
  isLoading,
  userInfo,
  statusPublic = false,
  address,
  children,
  onSetIsEditProfile,
}: IProfileProps) {
  const { isOpen, close, open } = useToggle();
  const [file, setFile] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [typeEditPhoto, setTypeEditPhoto] = useState<string>('');
  const isDesktop = useMediaQuery(QUERY.DESKTOP);
  const { setIsFilterProfile } = useContext(FilterSearchContext);

  const handleChangePicture = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const { files } = event.target;

    if (!files) return;
    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

    if (!allowedExtensions.exec(files[0].name)) {
      toast.error(MESSAGE_VALIDATE_UPLOAD.ER_TYPE);
      return;
    }

    const maxFileSize = 1024 * 1024 * 10;
    if (files[0].size > maxFileSize) {
      toast.error(MESSAGE_VALIDATE_UPLOAD.ER_SIZE);
      return;
    }

    setFileType(files[0].type);
    const reader = new FileReader();

    reader.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setFile(reader.result as any);
      setTypeEditPhoto(type);
      open();
    };

    reader.readAsDataURL(files[0]);
    event.target.value = '';
  };

  useEffect(
    () => () => {
      localStorage.removeItem(FILTER_PROFILE);
      setIsFilterProfile(false);
    },
    [setIsFilterProfile]
  );

  return (
    <ContainerS>
      <MaxWidthContent>
        {isLoading ? (
          <ContentLoader height={350} width={'100%'} viewBox="0 0 100% 300">
            <rect x="0" y="0" rx="5" ry="5" height="300" width={'100%'} />
          </ContentLoader>
        ) : (
          <HeaderS>
            <WrapHeader>
              {!!userInfo?.coverImage && <ImageBg src={userInfo.coverImage} />}

              {!statusPublic && (
                <WrapEditPhoto>
                  <Input
                    type="file"
                    name="file"
                    accept="image/*"
                    multiple={false}
                    onChange={(e) =>
                      handleChangePicture(e, TYPE_CHANGE_PICTURE.COVER_PHOTO)
                    }
                  />

                  {isDesktop ? (
                    <span className="me-2">
                      <IconBxCamera width={24} height={24} />
                    </span>
                  ) : (
                    <IconBxCameraSolid width={24} height={24} />
                  )}

                  {isDesktop && 'Edit Cover Photo'}
                </WrapEditPhoto>
              )}
            </WrapHeader>
          </HeaderS>
        )}

        <BodyS className="p-container">
          {isLoading ? (
            <Facebook />
          ) : (
            <UserProfile
              userInfo={userInfo}
              onChangeAvatar={(e) =>
                handleChangePicture(e, TYPE_CHANGE_PICTURE.COVER_AVATAR)
              }
              statusPublic={statusPublic}
              address={address}
              onSetIsEditProfile={onSetIsEditProfile}
            />
          )}
          <div>{children}</div>
        </BodyS>
      </MaxWidthContent>

      {isOpen && (
        <ModalCoverPicture
          isOpen={isOpen}
          onClose={close}
          src={file}
          typeEdit={typeEditPhoto}
          onSetIsEditProfile={onSetIsEditProfile}
          fileType={fileType}
        />
      )}
    </ContainerS>
  );
}
