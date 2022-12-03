import { fetchImageUrl, resolveLink } from '../utils/metadata';

export const useIPFS = () => {
  return { resolveLink, fetchImageUrl };
};
