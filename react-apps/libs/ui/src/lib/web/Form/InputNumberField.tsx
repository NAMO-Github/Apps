import { Colors } from '@namo-workspace/themes';
import { useField } from 'formik';
import { omit } from 'lodash';
import { forwardRef, useCallback } from 'react';
import NumberFormat, {
  NumberFormatProps,
  NumberFormatValues,
} from 'react-number-format';
import styled from 'styled-components';
import { ReactComponent as IcError } from '../../../assets/images/ic_error.svg';
import {
  InputSize,
  inputStyle,
  InputStyle,
  inputTextStyle,
  modifierStyle,
} from '../../shared/style/input.style';
import Label from '../Label';
import Warning from '../Warning';

interface Props extends Omit<NumberFormatProps, 'value' | 'onChange' | 'size'> {
  name: string;
  label?: string;
  tip?: React.ReactNode;
  require?: boolean;
  size?: InputSize;
  hiddenLabel?: boolean;
}

const InputNumberField = ({
  label,
  tip,
  require,
  name,
  hiddenLabel,
  className,

  ...rest
}: Props) => {
  const [field, meta, helpers] = useField<number | string | undefined>(name);
  const newField = omit(field, ['value', 'onChange']);

  const handleChange = useCallback((val: NumberFormatValues) => {
    helpers.setTouched(true);
    helpers.setValue(val.value || '');
  }, []);

  return (
    <Label
      label={label}
      require={require}
      tip={tip}
      className={className}
      hiddenLabel={hiddenLabel}
    >
      <NumberFormat
        {...newField}
        {...rest}
        customInput={CustomInput}
        value={field.value}
        onValueChange={handleChange}
      />
      {!!meta.error && !!meta.touched && (
        <Warning message={meta.error} icon={<IcError className="me-2" />} />
      )}
    </Label>
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
  ${inputTextStyle};
`;

const CustomInput = forwardRef<
  HTMLInputElement,
  Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> & InputStyle
>(({ size, ...props }, ref) => (
  <InputWrapper size={size}>
    <InputContainer {...props} ref={ref} />
  </InputWrapper>
));
export default InputNumberField;
