import styled from 'styled-components';
import {
  AccordionBody,
  AccordionHeader,
  AccordionHeaderProps,
  AccordionItem,
  UncontrolledAccordion,
} from 'reactstrap';
import { Colors, FontHeight, FontSize } from '@namo-workspace/themes';
import { ReactNode } from 'react';
import { ReactComponent as IcChevronDown } from '../../assets/images/ic_bx_chevron_down.svg';

export const Collapse = styled(UncontrolledAccordion)`
  @media (max-width: 767.98px) {
    .accordion-item:first-of-type {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      border: none;
      border-top: 1px solid ${Colors.strokeLevel3};
    }

    .accordion-item:not(:first-of-type) {
      border-radius: initial;
      border: none;
      border-top: 1px solid ${Colors.strokeLevel3};
    }

    .accordion-item:last-of-type {
      border-bottom: 1px solid ${Colors.strokeLevel3};
    }
  }
`;
export const CollapseBody = styled(AccordionBody)`
  .accordion-body {
    padding: 24px;
    border-top: 1px solid ${Colors.strokeLevel3};
  }

  @media (max-width: 767.98px) {
    .accordion-body {
      padding: 16px;
    }
  }
`;

interface Props extends AccordionHeaderProps {
  children: ReactNode;
}
const CollapseHeaderS = styled(AccordionHeader)`
  height: 74px;
  .accordion-button {
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    color: ${Colors.textLevel1} !important;
    &::after {
      display: none !important;
    }
    background: ${Colors.background} !important;
    outline: none !important;
    box-shadow: none !important;
    height: 100%;
    border: none !important;
    .collapse-chevron-icon {
      transition: all 0.2ms;
    }
  }

  .accordion-button:not(.collapsed) {
    .collapse-chevron-icon {
      transform: rotateX(180deg) translateY(50%);
    }
  }

  @media (max-width: 767.98px) {
    height: 53px;
    .accordion-button {
      padding: 16px;
      font-weight: 700;
      font-size: ${FontSize.body3}px;
      line-height: ${FontHeight.body3}px;
    }
  }
`;
const IconChevronS = styled.span`
  position: absolute;
  top: 50%;
  right: 24px;
  transform: translateY(-50%);

  @media (max-width: 767.98px) {
    right: 16px;
  }
`;
export const CollapseHeader = ({ children, ...rest }: Props) => {
  return (
    <CollapseHeaderS {...rest}>
      {children}
      <IconChevronS className="collapse-chevron-icon">
        <IcChevronDown />
      </IconChevronS>
    </CollapseHeaderS>
  );
};

export const CollapseItem = styled(AccordionItem)`
  border-color: ${Colors.strokeLevel3} !important;
  &:first-of-type {
    border-top-left-radius: 32px;
    border-top-right-radius: 32px;
    .accordion-button {
      border-top-left-radius: 32px;
      border-top-right-radius: 32px;
    }

    @media (max-width: 767.98px) {
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;

      .accordion-button {
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0px;
      }
    }
  }
  &:not(:first-of-type) {
    border-top: 0;
  }
  &:last-of-type {
    border-bottom-left-radius: 32px;
    border-bottom-right-radius: 32px;
    .accordion-button.collapsed {
      border-bottom-right-radius: 32px;
      border-bottom-left-radius: 32px;
    }

    @media (max-width: 767.98px) {
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;

      .accordion-button.collapsed {
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0px;
      }
    }
  }
`;
