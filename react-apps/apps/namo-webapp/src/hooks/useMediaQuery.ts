import { useState, useEffect } from 'react';

export enum QUERY {
  TABLET = '(min-width: 576px)',
  ONLY_MOBILE = '(max-width: 575.98px)',
  SMALL_MOBILE = '(max-width: 767.98px)',
  ONLY_TABLET = '(min-width: 576px) and (max-width: 991px)',
  DESKTOP = '(min-width: 992px)',
}
const useMediaQuery = (query: QUERY): boolean => {
  const [match, setMatch] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);

    const handleChange = () => setMatch(media.matches);

    if ('addEventListener' in media) {
      media.addEventListener('change', handleChange);
      return () => {
        media.removeEventListener('change', handleChange);
      };
    } else {
      media.addListener(handleChange);
      return () => {
        media.removeListener(handleChange);
      };
    }
  }, [query]);

  return match;
};

export default useMediaQuery;
