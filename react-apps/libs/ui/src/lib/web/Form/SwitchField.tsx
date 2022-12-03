import { useField } from 'formik';
import { omit } from 'lodash';
import 'rc-switch/assets/index.css';
import React from 'react';
import { ReactComponent as IcError } from '../../../assets/images/ic_error.svg';
import Label from '../Label';
import SwitchC from '../Switch';
import Warning from '../Warning';

interface Props {
  className?: string;
  prefixCls?: string;
  disabled?: boolean;
  checkedChildren?: React.ReactNode;
  unCheckedChildren?: React.ReactNode;

  defaultChecked?: boolean;
  loadingIcon?: React.ReactNode;

  label?: string;
  require?: boolean;
  name: string;
}

export default function SwitchField({
  name,
  className,
  label,
  require,
  ...rest
}: Props) {
  const [field, meta, helpers] = useField<boolean>(name);
  const newField = omit(field, ['value', 'onChange']);

  return (
    <Label label={label} require={require} className={className}>
      <SwitchC
        {...rest}
        {...newField}
        checked={field.value}
        onChange={(option: boolean) => helpers.setValue(option)}
      />
      {!!meta.error && !!meta.touched && (
        <Warning message={meta.error} icon={<IcError className="me-2" />} />
      )}
    </Label>
  );
}
