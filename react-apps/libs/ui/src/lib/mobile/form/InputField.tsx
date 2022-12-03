import { numberWithCommas } from '@namo-workspace/utils';
import { useField } from 'formik';
import React, { forwardRef, useCallback } from 'react';
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputEndEditingEventData,
  TextInputProps,
} from 'react-native';
import Input, { InputFieldProps } from '../Input';

type Props = Omit<
  InputFieldProps & TextInputProps,
  'onChangeText' | 'value'
> & {
  name: string;
  comma?: boolean;
  decimalScale?: number;
  trim?: boolean;
  preventBreak?: boolean;
};

const InputField = forwardRef<TextInput, Props>(
  ({ name, comma, decimalScale = 8, trim, preventBreak, ...props }, ref) => {
    const [field, meta, helpers] = useField(name);

    const handleChange = useCallback((_value: string) => {
      let value = `${_value}`;
      if (comma) {
        value = _value.replace(/\$\s?|(,*)/g, '');
      }
      if (!isNaN(Number(value))) {
        const splits = value.split('.');
        if (splits.length > 1 && splits[1].length > decimalScale) {
          return;
        }
      }

      if (trim) {
        value.trim();
      } else if (preventBreak) {
        let count = 0;
        const result = value.replace(/[\n\r]/gi, (text: string) => {
          count++;
          if (count > 5) return ' ';
          return text;
        });
        value = result;
      }

      helpers.setValue(value, true);
    }, []);
    const handleBlur = useCallback(() => field.onBlur(name), []);
    const handleClear = useCallback(() => helpers.setValue('', true), []);
    const handleEndEditing = useCallback(
      (e: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
        props.onEndEditing?.(e);
        helpers.setTouched(true);
      },
      []
    );
    return (
      <Input
        {...props}
        ref={ref}
        value={
          comma && !isNaN(Number(field.value))
            ? numberWithCommas(field.value)
            : field.value
        }
        onBlur={handleBlur}
        onChangeText={handleChange}
        onEndEditing={handleEndEditing}
        errorMessage={meta.error && meta.touched ? meta.error : undefined}
        handleClear={handleClear}
      />
    );
  }
);
export default InputField;
