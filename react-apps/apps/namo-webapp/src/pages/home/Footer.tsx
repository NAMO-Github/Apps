import { useMemo, ReactNode } from 'react';
import styled from 'styled-components';
import { v4 as uuid } from 'uuid';
import { Colors } from '@namo-workspace/themes';
import { ReactComponent as IcDiscordWhite } from '@assets/images/common/ic_discord_white.svg';
import { ReactComponent as IcFacebookWhite } from '@assets/images/common/ic_facebook_white.svg';
import { ReactComponent as IcGoogleWhite } from '@assets/images/common/ic_google_white.svg';
import { ReactComponent as IcInstagramWhite } from '@assets/images/common/ic_instagram_white.svg';
import { ReactComponent as IcRedditWhite } from '@assets/images/common/ic_reddit_white.svg';
import { ReactComponent as IcTelegramWhite } from '@assets/images/common/ic_telegram_white.svg';
import { ReactComponent as IcTikTokWhite } from '@assets/images/common/ic_tikTok_white.svg';
import { ReactComponent as IcTwitterWhite } from '@assets/images/common/ic_twitter_white.svg';
import { ReactComponent as IcYouTubeWhite } from '@assets/images/common/ic_youTube_white.svg';
import { Body1 } from '@namo-workspace/ui/Typography';

interface SocialLinkWebS {
  id: string;
  icon: ReactNode;
  link: string;
}

const Footer = () => {
  const socialLink: SocialLinkWebS[] = useMemo(
    () => [
      {
        icon: <IcTwitterWhite />,
        link: '',
        id: uuid(),
      },
      {
        icon: <IcInstagramWhite />,
        link: '',
        id: uuid(),
      },
      {
        icon: <IcDiscordWhite />,
        link: '',
        id: uuid(),
      },
      {
        icon: <IcRedditWhite />,
        link: '',
        id: uuid(),
      },
      {
        icon: <IcYouTubeWhite />,
        link: '',
        id: uuid(),
      },
      {
        icon: <IcTikTokWhite />,
        link: '',
        id: uuid(),
      },
      {
        icon: <IcGoogleWhite />,
        link: '',
        id: uuid(),
      },
      {
        icon: <IcTelegramWhite />,
        link: '',
        id: uuid(),
      },
      {
        icon: <IcFacebookWhite />,
        link: '',
        id: uuid(),
      },
    ],
    []
  );
  return (
    <Container>
      <Text fontWeight="700">Join the community</Text>
      <SocialLinkWeb>
        {socialLink.map((item) => {
          return (
            <Icon href={item.link} key={item.id}>
              {item.icon}
            </Icon>
          );
        })}
      </SocialLinkWeb>
    </Container>
  );
};

const Container = styled.div`
  height: 80px;
  padding: 24px 9%;
  background: ${Colors.background};
  border-top: 1px solid ${Colors.strokeLevel3};
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Text = styled(Body1)`
  color: ${Colors.textLevel1};
  margin-right: 24px;
`;
const SocialLinkWeb = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Icon = styled.a`
  width: 32px;
  height: 32px;
  background: ${Colors.foreground};
  border-radius: 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  &:not(:last-child) {
    margin-right: 12px;
  }
`;

export default Footer;
