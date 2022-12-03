import { useField } from 'formik';
import { omit } from 'lodash';
import { FC, useCallback } from 'react';
import { ReactComponent as IcError } from '../../../assets/images/ic_error.svg';
import Input, { InputProps } from '../Input';
import Label, { LabelProps } from '../Label';
import Warning, { WarningProps } from '../Warning';

type Props = Omit<WarningProps, 'prefix' | 'icon'> &
  Omit<LabelProps, 'prefix'> &
  InputProps & {
    name: string;
  };
const TextField: FC<Props> = ({
  label,
  tip,
  require,
  hiddenLabel,
  className,
  name,
  ...props
}) => {
  const [field, meta, helpers] = useField<string>(name);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      helpers.setTouched(true);
      helpers.setValue(e.target.value);
    },
    []
  );
  return (
    <Label
      className={className}
      label={label}
      require={require}
      tip={tip}
      hiddenLabel={hiddenLabel}
    >
      <Input
        {...omit(field, ['prefix', 'onChange'])}
        {...props}
        onChange={handleChange}
      />
      {meta.error && meta.touched && (
        <Warning message={meta.error} icon={<IcError className="me-2" />} />
      )}
    </Label>
  );
};

export default TextField;
