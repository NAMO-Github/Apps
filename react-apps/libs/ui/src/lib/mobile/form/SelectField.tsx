import { getIn, useField } from 'formik';
import { omit } from 'lodash';
import React from 'react';
import Select, { SelectProps, TriggerProps } from '../Select';

export type Option = {
  label: string;
  value: string;
};

type Props<OptionType> = Omit<SelectProps<OptionType>, 'value' | 'onChange'> &
  Omit<TriggerProps<OptionType>, 'value'> & { name: string };

export default function SelectField<OptionType = Option>({
  name,
  ...rest
}: Props<OptionType>) {
  const [field, meta, helpers] = useField<OptionType>(name);

  return (
    <Select<OptionType>
      {...omit(field, ['value', 'onChange'])}
      {...rest}
      value={field.value}
      onChange={(val) => helpers.setValue(val, true)}
      error={
        meta.error && meta.touched ? getIn(meta.error, 'value') : undefined
      }
    />
  );
}
