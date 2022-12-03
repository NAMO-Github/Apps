import Switch from 'rc-switch';
import 'rc-switch/assets/index.css';
import styled from 'styled-components';
import { Colors } from '@namo-workspace/themes';
import { memo } from 'react';

const SwitchC = ({ ...rest }) => {
  return (
    <WrapSwitch>
      <Switch {...rest} />
    </WrapSwitch>
  );
};

const WrapSwitch = styled.span`
  .rc-switch {
    height: 23px;

    @media (max-width: 767.98px) {
      height: 20px;

      &:after {
        width: 16px;
        height: 16px;
      }
    }
  }
  .rc-switch-checked {
    border: 1px solid ${Colors.primaryOrange};
    background-color: ${Colors.primaryOrange};
  }
  .rc-switch:focus {
    box-shadow: none;
    outline: none;
  }
`;

export default memo(SwitchC);
