import { CollapsibleProps as OldProps } from 'react-native-collapsible';
declare module 'react-native-collapsible' {
  export interface CollapsibleProps extends OldProps {
    children?: React.ReactNode;
  }
}
