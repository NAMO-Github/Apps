import React, { forwardRef } from 'react';
import { useField } from 'formik';
import Input from '../Input';
import styled from 'styled-components';
import { Colors } from '@namo-workspace/themes';
import { TextInputProps } from 'react-native';
import View from '../view/View';
import { Body3 } from '../Typography';

interface Props extends TextInputProps {
  name: string;
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
  multiline?: boolean;
  trim?: boolean;
  preventBreak?: boolean;
}

const TextField = forwardRef<any, Props>((props, ref) => {
  const {
    name,
    label,
    isRequired,
    placeholder,
    multiline,
    trim,
    preventBreak,
    style,
  } = props;
  const [field, meta, helper] = useField(name);
  const handleChange = (value: string) => {
    if (trim) {
      helper.setValue(value.replace(/\s/g, ''), true);
    } else if (preventBreak) {
      let count = 0;
      const result = value.replace(/[\n\r]/gi, (text: string) => {
        count++;
        if (count > 5) return ' ';
        return text;
      });
      helper.setValue(result, true);
    } else {
      helper.setValue(value, true);
    }
  };

  const handleClear = () => {
    helper.setValue('', true);
  };

  return (
    <View>
      <Input
        ref={ref}
        value={field.value}
        label={label}
        multiline={multiline}
        isRequired={isRequired}
        placeholder={placeholder}
        onChangeText={handleChange}
        onBlur={() => field.onBlur(field.name)}
        handleClear={handleClear}
        style={[{ marginBottom: 0 }, style]}
        inputStyle={multiline ? { height: 96, textAlignVertical: 'top' } : null}
        {...props}
      />
      {meta.error && meta.touched ? <ErrorText>{meta.error}</ErrorText> : null}
    </View>
  );
});

export default TextField;

const ErrorText = styled(Body3)`
  color: ${Colors.error};
  margin: 0px 0px 8px;
`;
