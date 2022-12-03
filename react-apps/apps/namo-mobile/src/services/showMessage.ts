import DropdownAlert from 'react-native-dropdownalert';

export const messageService: {
  ref?: DropdownAlert;
} = {
  ref: undefined,
};

export const showMessageInfo = (message: string) => {
  return messageService.ref.alertWithType('info', '', message);
};

export const showMessageSuccess = (message: string) => {
  return messageService.ref.alertWithType('success', '', message);
};

export const showMessageWarning = (message: string) => {
  return messageService.ref.alertWithType('warn', '', message);
};

export const showMessageError = (message: string) => {
  return messageService.ref.alertWithType('error', '', message);
};
