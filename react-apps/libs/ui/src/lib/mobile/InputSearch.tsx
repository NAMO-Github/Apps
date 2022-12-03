import React, { forwardRef } from 'react';
import { Colors } from '@namo-workspace/themes';
import {
  Dimensions,
  TextInput,
  TextInputProps,
  View,
  ViewProps,
} from 'react-native';
import styled from 'styled-components/native';
import InputField, { InputFieldProps } from './Input';
import { Body3, Body4 } from './Typography';

export type InputSearchProps = {
  showCancel?: boolean;
  isIconSmall?: boolean;
  handleCancel?: () => void;
};
const { width } = Dimensions.get('window');
const SIZE_INPUT = `${width - 90}px`;

const InputSearch = forwardRef<
  TextInput,
  InputFieldProps & TextInputProps & InputSearchProps
>((props, ref) => {
  const { style, showCancel, isIconSmall, handleCancel, ...other } = props;

  return (
    <Container style={style} showCancel={showCancel}>
      <InputField
        style={{ width: '100%' }}
        isIconSmall={isIconSmall}
        {...other}
        ref={ref}
      />
      {showCancel && (
        <ButtonCancel onPress={handleCancel}>
          {isIconSmall ? (
            <CancelTextSmall>Cancel</CancelTextSmall>
          ) : (
            <CancelTextLarge>Cancel</CancelTextLarge>
          )}
        </ButtonCancel>
      )}
    </Container>
  );
});

export default InputSearch;

const Container = styled(View)<ViewProps & { showCancel?: boolean }>`
  width: ${({ showCancel }) => (showCancel ? SIZE_INPUT : '100%')};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const ButtonCancel = styled.TouchableOpacity`
  padding: 0 8px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const CancelTextLarge = styled(Body3)`
  color: ${Colors.textLevel3};
`;
const CancelTextSmall = styled(Body4)`
  color: ${Colors.textLevel3};
`;
