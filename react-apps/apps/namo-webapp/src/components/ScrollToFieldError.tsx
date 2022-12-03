/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormikErrors, useFormikContext } from 'formik';
import { useEffect } from 'react';

export const getFieldErrorNames = (formikErrors: FormikErrors<unknown>) => {
  const transformObjectToDotNotation = (
    obj: any,
    prefix = '',
    result: string[] = []
  ) => {
    const newResult: string[] = [...result];
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (!value) return;

      const nextKey: string = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object') {
        transformObjectToDotNotation(value, nextKey, result);
      } else {
        newResult.push(nextKey);
      }
    });

    return newResult;
  };

  return transformObjectToDotNotation(formikErrors);
};

export const ScrollToFieldError = ({
  behavior = { behavior: 'smooth', block: 'center' },
}: any) => {
  const { submitCount, isValid, errors } = useFormikContext();

  useEffect(() => {
    if (isValid) return;

    const fieldErrorNames = getFieldErrorNames(errors);
    if (fieldErrorNames.length <= 0) return;

    const element = document.querySelector(
      `input[name='${fieldErrorNames[0]}']`
    );
    if (!element) return;

    element.scrollIntoView(behavior);
  }, [submitCount]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};
