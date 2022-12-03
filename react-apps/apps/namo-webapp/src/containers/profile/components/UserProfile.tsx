import { ReactComponent as IconBxCopy } from '@assets/images/profile/ic-bx-copy.svg';
import { defaultAvatar } from '@assets/images';
import { ReactComponent as IcBxCamera } from '@assets/images/profile/ic-bx-camera.svg';
import { ReactComponent as IcFacebook } from '@assets/images/common/ic_facebook.svg';
import { ReactComponent as IcInstagram } from '@assets/images/common/ic_instagram.svg';
import { ReactComponent as IcTikTok } from '@assets/images/common/ic_tikTok.svg';
import { ReactComponent as IcTwitter } from '@assets/images/common/ic_twitter.svg';
import { ReactComponent as IconBxCameraSolid } from '@assets/images/profile/ic_camera_solid.svg';
import Button from '@namo-workspace/ui/Button';
import {
  AddressS,
  AvatarS,
  CopyButtonS,
  DividerS,
  FollowersContainerS,
  FollowersCountS,
  FollowersTextS,
  LenderNameS,
  UserInfoS,
  UsernameContainerS,
  UsernameS,
  UserProfileContainerS,
  UserProfileS,
  WrapperDes,
  Bio,
  Camera,
  WrapperFollowing,
  SocialLinkWeb,
  WrapperIcon,
  FollowS,
  WrapBtn,
} from './user-profile.styled';
import { Input } from '../profile.styled';
import ModalEditProfile from '@components/Modal/ModalEditProfile';
import useToggle from '@hooks/useToggle';
import { UserInfo } from '@namo-workspace/services';
import ReactTooltip from 'react-tooltip';
import { ellipsisCenter, getMediaLink } from '@namo-workspace/utils';
import { Dispatch, ReactNode, SetStateAction, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import useMediaQuery, { QUERY } from '@hooks/useMediaQuery';

interface Props {
  userInfo?: UserInfo | null;
  statusPublic?: boolean;
  address?: string;
  onChangeAvatar?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSetIsEditProfile?: Dispatch<SetStateAction<boolean>>;
}

interface SocialLinkWebS {
  id: string;
  icon: ReactNode;
  link: string;
}

export default function UserProfile({
  userInfo,
  statusPublic = false,
  address,
  onChangeAvatar,
  onSetIsEditProfile,
}: Props) {
  const { isOpen, close, open } = useToggle();
  const [isCopy, setIsCopy] = useState<boolean>(false);
  // const [isOpenConnect, setIsOpenConnect] = useState<boolean>(false);      //feature follow
  const isDesktop = useMediaQuery(QUERY.DESKTOP);
  // const navigate = useNavigate();            //feature follow
  const socialLink: SocialLinkWebS[] = useMemo(() => {
    try {
      const mediaLink =
        !!userInfo?.socialMediaLink &&
        JSON.parse(userInfo?.socialMediaLink || '{}');

      return [
        {
          icon: <IcFacebook />,
          link: mediaLink?.facebook
            ? getMediaLink(mediaLink.facebook, 'facebook')
            : '',
          id: uuid(),
        },
        {
          icon: <IcInstagram />,
          link: mediaLink?.instagram
            ? getMediaLink(mediaLink.instagram, 'instagram')
            : '',
          id: uuid(),
        },
        {
          icon: <IcTwitter />,
          link: mediaLink?.twitter
            ? getMediaLink(mediaLink.twitter, 'twitter')
            : '',
          id: uuid(),
        },
        {
          icon: <IcTikTok />,
          link: mediaLink?.tiktok
            ? getMediaLink(mediaLink.tiktok, 'tiktok')
            : '',
          id: uuid(),
        },
      ].filter((item) => !!item.link);
    } catch (error) {
      return [];
    }
  }, [userInfo?.socialMediaLink]);

  const handleCopy = () => {
    navigator.clipboard.writeText(userInfo?.address || '');
    setIsCopy(true);
  };

  const openInNewTab = (url: string) => {
    if (url) {
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (newWindow) newWindow.opener = null;
    }
  };

  const RenderBtn = () =>
    statusPublic ? (
      <Button
        color="main"
        size={isDesktop ? 'large' : 'medium'}
        className={isDesktop ? 'ms-auto' : ''}
        // onClick={() => setIsOpenConnect(true)}     //feature follow
      >
        Follow
      </Button>
    ) : (
      <Button
        color="white"
        size={isDesktop ? 'large' : 'medium'}
        className={isDesktop ? 'ms-auto' : ''}
        onClick={open}
      >
        Edit Profile
      </Button>
    );

  return (
    <>
      <UserProfileContainerS>
        <UserProfileS>
          <AvatarS image={userInfo?.avatar || defaultAvatar} />

          {!statusPublic && (
            <Camera>
              <Input
                type="file"
                name="file"
                accept="image/*"
                multiple={false}
                onChange={onChangeAvatar}
              />
              {isDesktop ? (
                <IcBxCamera width={24} height={24} />
              ) : (
                <IconBxCameraSolid width={24} height={24} />
              )}
            </Camera>
          )}

          <UserInfoS>
            <UsernameContainerS>
              <UsernameS className="d-block d-lg-inline text-center">
                {userInfo?.name || 'Unnamed'}
              </UsernameS>
              <LenderNameS className="d-block d-lg-inline text-center">
                @{userInfo?.userName || 'Username'}
              </LenderNameS>
            </UsernameContainerS>

            {isDesktop && (userInfo?.address || address) && (
              <AddressS>
                {ellipsisCenter(userInfo?.address || address || '')}
                <CopyButtonS
                  className="ms-2 "
                  onClick={handleCopy}
                  data-tip="Copy"
                  data-place="right"
                  data-effect="solid"
                  data-for="tooltipCopy"
                >
                  <IconBxCopy />
                </CopyButtonS>
              </AddressS>
            )}
          </UserInfoS>

          {isDesktop && RenderBtn()}
        </UserProfileS>

        <WrapperDes>
          <Bio className="d-block d-lg-inline text-center">{userInfo?.bio}</Bio>
        </WrapperDes>

        <FollowersContainerS>
          <WrapperFollowing>
            <FollowS>
              <FollowersCountS>{userInfo?.follower || '0'}</FollowersCountS>
              <FollowersTextS>Followers</FollowersTextS>
            </FollowS>

            <DividerS />

            <FollowS>
              <FollowersCountS>{userInfo?.following || '0'}</FollowersCountS>
              <FollowersTextS>Following</FollowersTextS>
            </FollowS>
          </WrapperFollowing>

          <SocialLinkWeb className="mb-4 mb-lg-0">
            {socialLink.map((item) => {
              return (
                <WrapperIcon
                  key={item.id}
                  onClick={() => openInNewTab(item.link)}
                >
                  {item.icon}
                </WrapperIcon>
              );
            })}
          </SocialLinkWeb>
        </FollowersContainerS>

        {!isDesktop && <WrapBtn>{RenderBtn()}</WrapBtn>}
      </UserProfileContainerS>

      <ReactTooltip
        id="tooltipCopy"
        getContent={() => <span>{isCopy ? 'Copied' : 'Copy'}</span>}
        afterHide={() => setIsCopy(false)}
      />

      {isOpen && (
        <ModalEditProfile
          isOpen={isOpen}
          onClose={close}
          onSetIsEditProfile={onSetIsEditProfile}
        />
      )}
      {/* {isOpenConnect && (     //feature follow
        <ModalConfirm
          isOpen={isOpenConnect}
          size="small"
          title="Connect Wallet"
          description="You have not connected your MetaMask wallet. Please connect to proceed."
          cancelText="Cancel"
          okText="Continue"
          onClose={() => setIsOpenConnect(false)}
          onOk={() => navigate(ROUTES.LOGIN)}
        />
      )} */}
    </>
  );
}
