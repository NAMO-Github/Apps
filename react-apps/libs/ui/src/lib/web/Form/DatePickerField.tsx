import { Colors } from '@namo-workspace/themes';
import { useField } from 'formik';
import { omit } from 'lodash';
import { forwardRef, useCallback } from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
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
// require import "react-datepicker/dist/react-datepicker.css"; in App.tsx

interface Props extends Omit<ReactDatePickerProps, 'selected' | 'onChange'> {
  name: string;
  label?: string;
  tip?: React.ReactNode;
  require?: boolean;
  inputSize?: InputSize;
}

const DatePickerField = ({
  label,
  tip,
  require,
  name,
  inputSize = 'large',
  className,
  ...rest
}: Props) => {
  const [field, meta, helpers] = useField<Date | null>(name);
  const newField = omit(field, ['value', 'onChange']);

  const handleChange = useCallback((date: Date | null) => {
    helpers.setTouched(true);
    helpers.setValue(date);
  }, []);

  return (
    <LabelS label={label} require={require} tip={tip} className={className}>
      <ReactDatePicker
        {...newField}
        {...rest}
        customInput={<CustomInput size={inputSize} />}
        selected={field.value}
        onChange={handleChange}
      />
      {!!meta.error && !!meta.touched && (
        <Warning message={meta.error} icon={<IcError className="me-2" />} />
      )}
    </LabelS>
  );
};
const LabelS = styled(Label)`
  // for customize react-datepicker
  .react-datepicker {
    background: #ffffff;
    box-shadow: 0px 0.6px 1.8px rgba(0, 0, 0, 0.11),
      0px 3.2px 7.2px rgba(0, 0, 0, 0.13);
    border-radius: 16px;
    border-color: transparent;
  }
  .react-datepicker__header {
    background: white;
    border-bottom-color: transparent;
  }
  .react-datepicker__navigation {
    padding: 8.88889px;
    gap: 8.89px;
    width: 32px;
    height: 32px;
    background: #ffffff;
    border: 1px solid #dddddd;
    border-radius: 6px;
    span {
      top: 0;
      left: 0;
      &::before {
        top: 10px;
      }
    }
  }
  .react-datepicker__current-month {
    margin-bottom: 1rem;
  }
  .react-datepicker__day-name {
    font-weight: 500;
    font-size: 13px;
    line-height: 16px;
    color: ${Colors.textLevel4};
  }

  .react-datepicker__day {
    border-radius: 6px;
    border: 1px solid transparent;
  }
  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    color: #fff;
    background: #f6ba5f;
    border: 1px solid ${Colors.primaryOrange};
    border-radius: 6px;
  }

  .react-datepicker__day:not(.react-datepicker__day--selected):not(.react-datepicker__day--keyboard-selected):hover,
  .react-datepicker__month-text:hover,
  .react-datepicker__quarter-text:hover,
  .react-datepicker__year-text:hover {
    background: #ffffff;
    border: 1px solid ${Colors.primaryOrange};
    border-radius: 6px;
  }

  .react-datepicker__triangle {
    display: none;
  }
  .react-datepicker-time__input-container {
    float: right;
    margin-right: 2rem;
    .react-datepicker-time__input {
      border: none;
      outline: none;
      background: #f6f4e3;
      border-radius: 6px;
    }
  }
`;

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
export default DatePickerField;
