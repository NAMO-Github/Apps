import { Colors, FontHeight, FontSize } from '@namo-workspace/themes';
import Button from '@namo-workspace/ui/Button';
import { Body1, Body2, Body3 } from '@namo-workspace/ui/Typography';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface Image {
  image?: string;
}

interface Color {
  color?: string;
  colorBg?: string;
  colorBr?: string;
}

export const Container = styled.div`
  padding-top: 4rem;
  padding-bottom: 4rem;

  &.container-fluid {
    .row {
      width: 100%;
      margin: auto;
    }
  }
  .col {
    height: 100%;
  }

  @media (max-width: 767.98px) {
    padding-top: 8px;
    padding-bottom: 8px;

    &.p-container {
      padding-left: 0;
      padding-right: 0;
    }
  }
`;

export const AvatarS = styled.div<Image>`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 50%;
  background: #e2dcab url(${({ image }) => image}) no-repeat center;
  background-size: cover;

  svg {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 767.98px) {
    width: 38px;
    height: 38px;
  }
`;

export const WrapperUser = styled(Link)`
  display: inline-flex;
  align-items: center;
  text-decoration: none;

  img {
    width: 48px;
    height: 48px;
    background: #fdfafa;
    border-radius: 50%;
    overflow: hidden;
  }
`;

export const NameUser = styled(Body2)`
  display: inline-block;
  font-weight: 700;
  color: ${Colors.textLevel1};
  margin-left: 0.5rem;
  word-break: break-all;
  flex: 1;

  @media (max-width: 767.98px) {
    font-size: ${FontSize.body3}px;
    line-height: ${FontHeight.body3}px;
  }
`;

export const NameNTF = styled(Body1)`
  font-weight: 700;
  color: ${Colors.textLevel1};
  overflow-wrap: break-word;

  @media (max-width: 767.98px) {
    font-size: ${FontSize.body2}px;
    line-height: ${FontHeight.body2}px;
  }
`;

export const WrapDuration = styled.div`
  margin-bottom: 2rem;

  & > button:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;

export const ButtonS = styled(Button)`
  font-weight: 600;
  font-size: ${FontSize.body2}px;
  line-height: ${FontHeight.body2}px;
  text-transform: capitalize;

  @media (max-width: 767.98px) {
    height: 40px;
    order: 2;
  }
`;

export const Tag = styled(Body3)<Color>`
  display: inline-flex;

  height: 32px;
  background: ${({ colorBg }) => colorBg};
  color: ${({ color }) => color};
  border: 1px solid ${({ colorBr }) => colorBr};
  border-radius: 1000px;
  padding: 6px 12px;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  font-weight: 600;

  @media (max-width: 767.98px) {
    height: 20px;
    font-size: ${FontSize.sub}px;
    line-height: 18px;
    padding: 0 6px;
  }
`;

export const Descriptions = styled(Body2)`
  font-weight: 400;
  color: ${Colors.strokeLevel1};
  white-space: pre-wrap;
  overflow-wrap: break-word;

  @media (max-width: 767.98px) {
    font-size: ${FontSize.body3}px;
    line-height: ${FontHeight.body3}px;
  }
`;

export const WrapProperties = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-gap: 24px;

  @media (max-width: 767.98px) {
    grid-gap: 16px;
  }
`;

export const Properties = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 96px;
  background: ${Colors.background2};
  border-radius: 8px;
  padding: 24px 16px;

  @media (max-width: 767.98px) {
    padding: 12px 8px;
    height: 64px;
  }
`;

export const PropertiesLabel = styled(Body3)`
  display: inline-block;
  font-weight: 500;
  text-transform: uppercase;
  color: ${Colors.textLevel4};
  text-align: center;

  @media (max-width: 767.98px) {
    font-size: ${FontSize.body4}px;
    line-height: ${FontHeight.body4}px;
  }
`;

export const PropertiesValue = styled(Body2)`
  font-weight: 600;
  color: ${Colors.textLevel1};
  text-align: center;

  @media (max-width: 767.98px) {
    font-size: ${FontSize.body3}px;
    line-height: ${FontHeight.body3}px;
  }
`;

export const InfoItemLabelS = styled(Body2)`
  font-weight: 500;
  color: ${Colors.textLevel1};

  @media (max-width: 767.98px) {
    font-size: ${FontSize.body3}px;
    line-height: ${FontHeight.body3}px;
  }
`;

export const InfoItemValueS = styled.div`
  margin-left: auto;
  color: ${Colors.textLevel3};
  text-transform: capitalize;
  font-size: ${FontSize.body2}px;
  line-height: ${FontHeight.body2}px;
  text-align: end;

  @media (max-width: 767.98px) {
    font-size: ${FontSize.body3}px;
    line-height: ${FontHeight.body3}px;
  }
`;

export const InfoItemValueLinkS = styled.a`
  align-items: center;
  display: flex;
  margin-left: auto;
  color: #5e99f1;
  font-weight: 400;
  font-size: ${FontSize.body2}px;
  line-height: ${FontHeight.body2}px;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  text-align: end;

  svg {
    margin-left: 6px;
    outline: none;

    path {
      fill: #5e99f1;
    }
  }

  @media (max-width: 767.98px) {
    font-size: ${FontSize.body3}px;
    line-height: ${FontHeight.body3}px;
  }
`;

export const WrapButton = styled.div`
  display: flex;
  align-items: center;

  button {
    flex: 1 1 0;
  }

  & button:not(:last-child) {
    margin-right: 1rem;
  }
`;

export const WrapHistoryRented = styled.div`
  & > div:not(:last-child) {
    margin-bottom: 12px;
  }
`;

export const ErrorNoPackageS = styled.div`
  margin-top: 0.5rem;
  display: flex;
  flex-flow: row;
  align-items: center;
  padding: 10px 16px;
  background: #ffeef0;
  border-radius: 8px;
`;

export const ErrorNoPackageTextS = styled(Body3)`
  font-weight: 500;
  color: ${Colors.textLevel2};
`;

export const WrapSwitch = styled.div`
  display: inline-flex;
  align-items: center;

  & label {
    margin-bottom: 0;
  }

  & label > span:first-child {
    margin-right: 1rem;
    margin-bottom: 0;
  }

  @media (max-width: 767.98px) {
    display: flex;
    justify-content: space-between;
  }
`;
