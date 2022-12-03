import { useCallback, useEffect, useState } from 'react';
import { parseMetaDataToMoralis } from '../utils';
import { InfoNFT, nftApi } from './../api/getNFT.api';

interface Props {
  address?: string;
  tokenAddress?: string;
  tokenId?: string;
  enable?: boolean;
  nftId?: string;
}
export const useGetDetailNft = ({
  address,
  tokenAddress,
  tokenId,
  enable = true,
  nftId = '',
}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [detailNft, setDetailNft] = useState<InfoNFT>();

  const fetchNFT = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await nftApi.fetchListGalleryNFT({ address: address || '' });

      setIsLoading(false);
      const listNft = res.data;
      const nftRaw = listNft.find(
        (nft) => nft.tokenAddress === tokenAddress && nft.tokenId === tokenId
      );
      if (!nftRaw) {
        setError("User don't have this Nft");
      }
      const newNft = nftRaw ? await parseMetaDataToMoralis(nftRaw) : undefined;
      setDetailNft(newNft);
      return Promise.resolve(newNft);
    } catch (err) {
      setIsLoading(false);
      setError((err as Error)?.message);
      return Promise.reject(err);
    }
  }, [tokenId, tokenAddress]);

  const fetchNFTById = useCallback(async () => {
    setIsLoading(true);
    try {
      const nft = await nftApi.findNFT(nftId);

      const newNft = await parseMetaDataToMoralis(nft);
      setIsLoading(false);
      setDetailNft(newNft);
      return Promise.resolve(newNft);
    } catch (err) {
      setIsLoading(false);
      setError((err as Error)?.message);
      return Promise.reject(err);
    }
  }, [tokenId, tokenAddress]);

  useEffect(() => {
    if (enable && !!address && !!tokenAddress && !!tokenId && !nftId) {
      fetchNFT();
    }
    if (enable && nftId) {
      fetchNFTById();
    }
  }, [fetchNFT, tokenAddress, tokenId, address, nftId]);

  return {
    isLoading,
    error,
    detailNft,
    refetch: nftId ? fetchNFTById : fetchNFT,
  };
};
