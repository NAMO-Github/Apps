import { Colors } from '@namo-workspace/themes';
import styled from 'styled-components';

export const Container = styled.div`
  &.container-fluid {
    padding: 0;
  }

  .width-auto {
    width: auto;
  }

  .width-full {
    width: 100%;
  }
`;

export const WrapFilter = styled.div`
  margin-right: 16px;
`;

export const BorderFilter = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border: 1px solid ${Colors.border};
  background-color: ${Colors.background};
  cursor: pointer;
  border-radius: 8px;

  svg {
    transition: all 0.2s ease-in-out;
  }

  &:hover svg {
    transform: scale(1.2);
  }
`;
