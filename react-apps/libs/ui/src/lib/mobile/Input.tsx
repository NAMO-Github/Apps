import React, { forwardRef } from 'react';
import {
  Dimensions,
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  ViewProps,
} from 'react-native';
import styled from 'styled-components/native';
import {
  inputContainerStyle,
  inputTextStyle,
} from '../shared/style/input.style';
import { Colors } from '@namo-workspace/themes';
import { Body2, Body4 } from './Typography';
import Images from '../../assets/images';

const { IcError, IcClear, IcSmallClear } = Images;

export type InputFieldProps = {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  handleClear?: () => void;
  label?: string;
  inputStyle?: StyleProp<TextStyle>;
  isRequired?: boolean;
  isOption?: boolean;
  isClear?: boolean;
  placeholder?: string;
  errorMessage?: string;
  description?: string;
  isIconSmall?: boolean;
};
const { width } = Dimensions.get('window');

const InputField = forwardRef<TextInput, InputFieldProps & TextInputProps>(
  (props, ref) => {
    const {
      prefix,
      suffix,
      handleClear,
      style,
      label,
      inputStyle,
      isRequired,
      isOption,
      errorMessage,
      description,
      isIconSmall,
      value,
      ...other
    } = props;

    return (
      <Container style={style}>
        {!!label && (
          <WrapLabel>
            <Body2
              fontStyle="normal"
              fontWeight="600"
              color={Colors.foreground1}
            >
              {label}
            </Body2>
            {!!isOption && <Optional> (optional)</Optional>}
            {!!isRequired && <Require> *</Require>}
          </WrapLabel>
        )}

        <InputContainer isError={!!errorMessage}>
          {prefix && <PrefixContainer>{prefix}</PrefixContainer>}
          <Input
            ref={ref}
            value={value}
            style={inputStyle}
            placeholderTextColor={Colors.textLevel4}
            {...other}
          />
          {value ? (
            <TouchableOpacity onPress={handleClear}>
              {isIconSmall ? <IcSmallClear /> : <IcClear />}
            </TouchableOpacity>
          ) : null}
          {suffix && <SuffixContainer>{suffix}</SuffixContainer>}
        </InputContainer>

        {!!description && <Description>{description}</Description>}

        {!!errorMessage && (
          <WrapError>
            <IcError />
            <ErrorText>{errorMessage}</ErrorText>
          </WrapError>
        )}
      </Container>
    );
  }
);

export default InputField;

const Container = styled.View`
  width: ${width}px;
`;

const WrapLabel = styled.View`
  flex-direction: row;
  text-align: center;
  margin-bottom: 4px;
`;

const Require = styled(Body2)`
  color: ${Colors.primaryRed};
`;

const Optional = styled(Body2)``;

const WrapError = styled.View`
  flex-direction: row;
  text-align: center;
  margin-top: 4px;
`;

const ErrorText = styled(Body2)`
  margin-left: 5px;
  margin-top: 3px;
  color: ${Colors.primaryRed};
  flex: 1;
  line-height: 17px;
`;

const Description = styled(Body4)`
  color: ${Colors.textLevel3};
`;

const InputContainer = styled.View<ViewProps & { isError?: boolean }>`
  ${inputContainerStyle};
  background-color: ${Colors.background};
`;

const PrefixContainer = styled.View`
  width: 20px;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`;

const Input = styled.TextInput`
  flex: 1;
  ${inputTextStyle};
`;

const SuffixContainer = styled.View`
  width: 20px;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
`;
