import Web3 from 'web3';
import { Keyboard, KeyboardEvent } from 'react-native';

export function onKeyboardChange(
  onChange: (type: 0 | 1, event: KeyboardEvent) => void
) {
  // const showEvent = AndroidOS ? 'keyboardDidShow' : 'keyboardWillShow';
  // const hideEvent = AndroidOS ? 'keyboardDidHide' : 'keyboardWillHide';
  const showEvent = 'keyboardDidShow';
  const hideEvent = 'keyboardDidHide';
  const onKeyboardShow = (event: KeyboardEvent) => onChange(1, event);
  const onKeyboardHide = (event: KeyboardEvent) => onChange(0, event);
  const event1 = Keyboard.addListener(showEvent, onKeyboardShow);
  const event2 = Keyboard.addListener(hideEvent, onKeyboardHide);
  return () => {
    event1.remove();
    event2.remove();
  };
}

export function ellipsisCenter(text: string) {
  if (text.length < 15) return text;
  return text.slice(0, 6) + '...' + text.substring(text.length - 4);
}

export const limitTitleHeader = (title: string) => {
  if (title) {
    return title.length >= 25 ? title.slice(0, 24) + '...' : title;
  }
  return 'Unnamed';
};

export function parseChainId(chainId: string) {
  return Number.parseInt(chainId, 16);
}

export function parseWei(wei: number) {
  return +Web3.utils.fromWei(
    wei.toLocaleString('fullwide', {
      useGrouping: false,
    })
  );
}
export function numberWithCommas(x: number | string) {
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export const rxWebsite = /(http[s]?:)+(([\w]+:)?\/\/\w)/;
export type MediaType = 'facebook' | 'instagram' | 'twitter' | 'tiktok';
export const getMediaLink = (input: string, mediaType: MediaType) => {
  const isValidLink = new RegExp(rxWebsite).test(input);
  const removeTag = input.replace('@', '');

  switch (mediaType) {
    case 'facebook':
      return isValidLink ? input : `https://www.facebook.com/${input}`;
    case 'instagram':
      return isValidLink ? input : `https://www.instagram.com/${input}`;
    case 'twitter':
      return isValidLink ? input : `https://twitter.com/${input}`;
    case 'tiktok':
      return isValidLink ? input : `https://www.tiktok.com/@${removeTag}`;

    default:
      return '';
  }
};
