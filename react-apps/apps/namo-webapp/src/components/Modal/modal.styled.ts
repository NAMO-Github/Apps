import { Colors, FontHeight, FontSize } from '@namo-workspace/themes';
import { Body1 } from '@namo-workspace/ui/Typography';
import { Modal } from 'reactstrap';
import styled, { css } from 'styled-components';

export type ModalSize = 'small' | 'medium' | 'large';

export interface StyleModal {
  size?: ModalSize;
}
export interface StyleZIndex {
  zIndex?: number;
}

const modalStyleSize = css<StyleModal>`
  ${(props) => {
    switch (props.size) {
      case 'small':
        return css`
          width: 380px;
        `;
      case 'medium':
        return css`
          width: 580px;
        `;
      case 'large':
        return css`
          width: 750px;
        `;
      default:
        return css`
          width: 532px;
        `;
    }
  }}
`;

const modalStyle = css`
  background-color: transparent;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;

  background: ${Colors.background};
  border-radius: 16px;
  padding: 1.5rem;
  margin: auto;

  @media (max-width: 575.98px) {
    padding: 1rem;
  }
`;

export const ModalCustomS = styled.div<StyleZIndex>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: ${({ zIndex }) => zIndex};

  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.25);
`;

export const ContainerModal = styled.div<StyleModal>`
  ${modalStyleSize}
  ${modalStyle}
  transition: all 0.6s ease-in-out;
  transform: translateY(-30px);
  opacity: 0;

  &.show-modal {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const ModalS = styled(Modal)`
  .modal-content {
    ${modalStyleSize}
    ${modalStyle}
  }
`;

export const ModalC = styled(ModalS)`
  height: 100vh;
  margin: 0 auto;

  @media (max-width: 575.98px) {
    width: calc(100vw - 32px);
  }
`;

export const TitleS = styled(Body1)`
  font-weight: 700;
  color: ${Colors.textLevel1};
  margin-bottom: 20px;
`;

export const DescriptionS = styled.div`
  font-size: ${FontSize.body2}px;
  line-height: ${FontHeight.body2}px;
  font-weight: 400;
  color: ${Colors.textLevel2};

  @media (max-width: 575.98px) {
    font-size: ${FontSize.body3}px;
    line-height: ${FontHeight.body3}px;
  }
`;

export const ButtonContainerS = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
`;

export const CloseS = styled.span`
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  cursor: pointer;
`;
