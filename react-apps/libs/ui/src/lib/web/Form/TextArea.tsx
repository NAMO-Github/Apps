import { Colors } from '@namo-workspace/themes';
import { useField } from 'formik';
import { omit } from 'lodash';
import { FC, useCallback } from 'react';
import styled from 'styled-components';
import { ReactComponent as IcError } from '../../../assets/images/ic_error.svg';
import Label from '../Label';
import Warning from '../Warning';

interface Props
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'prefix'> {
  label?: string;
  tip?: string;
  require?: boolean;
  hiddenLabel?: boolean;
  className?: string;
  name: string;
}

const TextArea: FC<Props> = ({
  label,
  tip,
  require,
  hiddenLabel,
  className,
  name,
  ...props
}) => {
  const [field, meta, helpers] = useField<string>(name);

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> =
    useCallback((e) => {
      helpers.setTouched(true);
      helpers.setValue(e.target.value);
    }, []);

  return (
    <Label
      className={className}
      label={label}
      require={require}
      tip={tip}
      hiddenLabel={hiddenLabel}
    >
      <TextAreaS
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

const TextAreaS = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  background: ${Colors.background};
  border: 1px solid ${Colors.strokeLevel3};
  caret-color: ${Colors.primaryOrange};
  border-radius: 8px;
  outline: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default TextArea;
