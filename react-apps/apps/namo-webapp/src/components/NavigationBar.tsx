import { ReactComponent as IcBxChevronLeft } from '@assets/images/common/ic_bx_chevron_left.svg';
import { Colors } from '@namo-workspace/themes';
import { MaxWidthContent } from '@namo-workspace/ui/MaxWidthContent.styled';
import { Body2 } from '@namo-workspace/ui/Typography';
import ContentLoader from 'react-content-loader';
import styled from 'styled-components';

type Props = {
  isLoading?: boolean;
  name: string;
  avatar: string; // must be valid url
  onBack?: () => void;
};

export default function NavigationBar({
  isLoading,
  name,
  avatar,
  onBack,
}: Props) {
  return (
    <ContainerS className="p-container">
      <MaxWidthContent>
        {isLoading ? (
          <ContentLoader height={80} viewBox="0 0 200 80">
            <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
            <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
            <circle cx="20" cy="20" r="20" />
          </ContentLoader>
        ) : (
          <BackButton onClick={onBack}>
            <IcBxChevronLeft className="me-2" />
            <AvatarS src={avatar} alt="nft" />
            <Body2S className="ms-3">{name}</Body2S>
          </BackButton>
        )}
      </MaxWidthContent>
    </ContainerS>
  );
}
const ContainerS = styled.div`
  position: sticky;
  top: 65px;
  left: 0;
  z-index: 10;
  background: ${Colors.background};
  padding-top: 1rem;
  padding-bottom: 1rem;
  box-shadow: 0px 0.5px 1px rgb(0 0 0 / 11%), 0px 1.2px 7.2px rgb(0 0 0 / 13%);
  height: 80px;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  border: none;
  background-color: transparent;
  outline: none;
`;

const AvatarS = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
`;
const Body2S = styled(Body2)`
  color: ${Colors.textLevel1};
  font-weight: 700;
`;
