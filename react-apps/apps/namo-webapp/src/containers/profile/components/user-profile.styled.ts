import { Colors, FontHeight, FontSize } from '@namo-workspace/themes';
import styled from 'styled-components';
import { Body1, Body3 } from '@namo-workspace/ui/Typography';

interface AvatarProps {
  image?: string;
}

export const UserProfileContainerS = styled.div`
  display: flex;
  flex-flow: column;
`;
export const UserProfileS = styled.div`
  display: flex;
  flex-flow: row;
  padding: 1.5rem 0;
  position: relative;

  @media (max-width: 991.98px) {
    display: initial;
    padding: 0;
  }
`;

export const AvatarS = styled.div<AvatarProps>`
  width: 180px;
  height: 180px;
  position: absolute;
  border-radius: 50%;
  border: 8px solid #ffffff;
  background: #e2dcab url(${({ image }) => image}) no-repeat center;
  background-size: cover;
  top: 0;
  left: 0;
  transform: translateY(-50%);

  svg {
    width: 100%;
    height: 100%;
    background-size: cover;
  }

  @media (max-width: 991.98px) {
    width: 140px;
    height: 140px;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  @media (max-width: 575.98px) {
    width: 100px;
    height: 100px;
    border: 4px solid #ffffff;
  }
`;

export const UserInfoS = styled.div`
  display: flex;
  flex-flow: column;
  margin-left: calc(180px + 1rem);

  @media (max-width: 991.98px) {
    margin-left: 0;
    margin-top: 75px;
  }

  @media (max-width: 575.98px) {
    margin-top: 52px;
  }
`;

export const UsernameContainerS = styled.div`
  margin-bottom: 0.5rem;
  min-height: 28px;
`;

export const UsernameS = styled(Body1)`
  overflow-wrap: anywhere;
  margin-right: 0.5rem;
  font-weight: 700;
  color: ${Colors.textLevel1};

  @media (max-width: 575.98px) {
    font-size: ${FontSize.body3}px;
    line-height: ${FontHeight.body3}px;
  }
`;

export const LenderNameS = styled(Body3)`
  overflow-wrap: anywhere;
  margin-right: 0.5rem;
  font-weight: 600;
  color: ${Colors.textLevel3};

  @media (max-width: 575.98px) {
    font-size: ${FontSize.body4}px;
    line-height: ${FontHeight.body4}px;
  }
`;

export const AddressS = styled.div`
  font-weight: 400;
  font-size: ${FontSize.body4}px;
  line-height: ${FontHeight.body4}px;
  color: ${Colors.textLevel3};
  display: flex;
  flex-flow: row;
  align-items: center;
  white-space: nowrap;
`;
export const CopyButtonS = styled.button`
  border: none;
  outline: none;
  cursor: pointer;
  background-color: transparent;
`;

export const FollowersContainerS = styled.div`
  display: flex;
  flex-flow: row nowrap;
  margin-bottom: 20px;

  @media (max-width: 991.98px) {
    flex-direction: column-reverse;
    align-items: center;
  }
`;

export const FollowS = styled.div`
  display: flex;
  flex-flow: column nowrap;

  @media (max-width: 991.98px) {
    flex: 1;
    align-items: center;
  }
`;

export const FollowersCountS = styled.div`
  font-weight: 700;
  font-size: ${FontSize.body3}px;
  line-height: ${FontHeight.body3}px;

  color: ${Colors.textLevel2};

  @media (max-width: 575.98px) {
    font-size: 14px;
    line-height: 20px;
  }
`;

export const FollowersTextS = styled.div`
  font-weight: 400;
  font-size: ${FontSize.body4}px;
  line-height: ${FontHeight.body4}px;

  color: ${Colors.textLevel3};

  @media (max-width: 575.98px) {
    font-size: 10px;
    line-height: 12px;
  }
`;

export const DividerS = styled.div`
  width: 1px;
  height: 40px;
  background: ${Colors.strokeLevel3};
  margin: 0 2rem;

  @media (max-width: 575.98px) {
    height: 32px;
  }
`;

export const WrapperDes = styled.div`
  width: 60%;
  margin-bottom: 20px;

  @media (max-width: 991.98px) {
    width: 100%;
  }

  @media (max-width: 575.98px) {
    font-size: ${FontSize.body4}px;
    line-height: ${FontHeight.body4}px;
    margin-bottom: 8px;
  }
`;

export const Bio = styled(Body3)`
  overflow-wrap: anywhere;
  font-weight: 400;
  color: ${Colors.textLevel2};
`;

export const Camera = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;

  position: absolute;
  top: 0;
  left: 0;
  transform: translate(290%, 30%);
  z-index: 10;
  cursor: pointer;

  background: ${Colors.background};
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: ${Colors.primaryOrangeMinus7};
  }

  @media (max-width: 991.98px) {
    left: 50%;
    transform: translateX(65%);
    top: 12px;
  }

  @media (max-width: 575.98px) {
    width: 32px;
    height: 32px;

    & svg {
      width: 16px;
      height: 16px;
    }
  }
`;

export const WrapperFollowing = styled.div`
  display: inline-flex;
  align-items: center;
  margin-right: 64px;

  @media (max-width: 991.98px) {
    display: flex;
    margin-right: 0;
    width: 75%;
  }
`;

export const SocialLinkWeb = styled.div`
  display: inline-flex;
  align-items: center;

  & > div:last-child {
    margin-right: 0;
  }
`;
export const WrapperIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border: 1px solid #f6ba5f;
  border-radius: 50%;
  background: ${Colors.background};
  transition: all 0.2s ease-in-out;
  margin-right: 1rem;

  &:hover {
    background: ${Colors.primaryOrangeMinus7};
  }

  @media (max-width: 575.98px) {
    width: 24px;
    height: 24px;

    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

export const WrapBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;
