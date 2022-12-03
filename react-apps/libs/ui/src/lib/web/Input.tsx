import { Colors } from '@namo-workspace/themes';
import React, { memo, ReactNode, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  inputPrefixStyle,
  InputSize,
  InputStyle,
  inputStyle,
  inputSuffixStyle,
  inputTextStyle,
  modifierStyle,
} from '../shared/style/input.style';
import { ReactComponent as IcBxShow } from '../../assets/images/ic_bx_show.svg';
import { ReactComponent as IcXCrossExit } from '../../assets/images/ic_x_cross_exit.svg';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  prefix?: ReactNode;
  suffix?: ReactNode;
  size?: InputSize;
  clearable?: boolean;
}

const Input = ({
  className,
  prefix,
  suffix,
  size,
  type,
  value,
  clearable = false,
  onChange,
  ...props
}: InputProps) => {
  const [typeChange, setTypeChange] = useState<string | undefined>(type);
  const refInput = useRef<HTMLInputElement | null>(null);

  function resolveOnChange(
    target: HTMLInputElement,
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLElement, MouseEvent>
      | React.CompositionEvent<HTMLElement>,
    onChange: undefined | ((event: React.ChangeEvent<HTMLInputElement>) => void)
  ) {
    if (!onChange || !target) {
      return;
    }

    let event = e as React.ChangeEvent<HTMLInputElement>;

    if (e.type === 'click') {
      const currentTarget = target.cloneNode(true) as HTMLInputElement;

      // click clear icon
      if (currentTarget) {
        event = Object.create(e, {
          target: { value: currentTarget },
          currentTarget: { value: currentTarget },
        });

        currentTarget.value = '';
        onChange(event);
        return;
      }
    }
  }

  const handleReset = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    refInput.current?.focus();

    refInput.current && resolveOnChange(refInput.current, e, onChange);
  };

  return (
    <InputWrapper size={size} className={className}>
      {!!prefix && <Prefix>{prefix}</Prefix>}
      <InputContainer
        {...props}
        type={typeChange}
        onChange={onChange}
        value={value}
        ref={refInput}
      />

      <Suffix>
        {suffix}

        {value && clearable && (
          <SuffixStyle onClick={handleReset}>
            <IcXCrossExit width={24} height={24} />
          </SuffixStyle>
        )}

        {type === 'password' && (
          <SuffixStyle>
            <IcBxShow
              width={24}
              height={24}
              onClick={() =>
                setTypeChange((pre) =>
                  pre === 'password' ? 'text' : 'password'
                )
              }
            />
          </SuffixStyle>
        )}
      </Suffix>
    </InputWrapper>
  );
};

const InputWrapper = styled.span<InputStyle>`
  ${inputStyle};
  ${modifierStyle};
`;

const InputContainer = styled.input`
  outline: none;
  border: none;
  width: 100%;
  caret-color: ${Colors.primaryOrange};
  &:disabled {
    background: white;
  }
  ${inputTextStyle};
`;

const SuffixStyle = styled.span`
  ${inputSuffixStyle}
  cursor: pointer;
  &:first-child {
    margin-left: 0;
  }
`;

const Suffix = styled.span`
  ${inputSuffixStyle};
`;
const Prefix = styled.span`
  ${inputPrefixStyle}

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 575.98px) {
    width: 16px;
    height: 16px;
  }
`;

export default memo(Input);
