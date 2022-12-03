import { Colors } from '@namo-workspace/themes';
import styled from 'styled-components';

export const ContainerS = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;
export const HeaderS = styled.div`
  max-height: 368px;
  position: relative;
  overflow: hidden;

  @media (max-width: 991.98px) {
    max-height: 300px;
  }

  @media (max-width: 575.98px) {
    max-height: 200px;
  }
`;

export const ImageBg = styled.img`
  object-fit: cover;
  position: absolute;
  inset: 0px;
  border: none;
  margin: auto;
  display: block;

  min-width: 100%;
  max-width: 100%;
  min-height: 100%;
  max-height: 100%;
`;

export const WrapHeader = styled.div`
  height: 0px;
  padding-bottom: 50%;
  background-color: ${Colors.secondary};
`;

export const BodyS = styled.div`
  position: relative;
`;

export const WrapEditPhoto = styled.label`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 20px;
  right: 14px;

  height: 48px;
  background: ${Colors.background};
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px 16px;

  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: ${Colors.textLevel3};
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: ${Colors.primaryOrangeMinus7};
  }

  @media (max-width: 991.98px) {
    border-radius: 50%;
    width: 48px;
    height: 48px;
    padding: 0;
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

export const Input = styled.input`
  display: none;
`;
