import { addMinutes, format } from 'date-fns';

export const formatDateWithTime = (date: string) => {
  const newDate = new Date(date);
  return format(
    addMinutes(newDate, newDate.getTimezoneOffset()),
    'kk:mm - dd/MM/yyyy'
  );
};

export const formDateWithoutTime = (date: string) => {
  const newDate = new Date(date);
  return format(addMinutes(newDate, newDate.getTimezoneOffset()), 'dd/MM/yyyy');
};
