import { environment } from '@namo-workspace/environments';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { RequestError } from '../api/authorized-request';
import { parseMetaDataToMoralis } from '../utils';
import { InfoNFT, nftApi } from './../api/getNFT.api';

interface Props {
  address?: string;
  tokenAddress?: string;
  tokenId?: string;
  enable?: boolean;
}
export const useGetNftDetail = ({
  tokenAddress,
  tokenId,
  enable = true,
}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [detailNft, setDetailNft] = useState<InfoNFT>();

  const fetchNFT = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!tokenAddress || !tokenId) throw new Error('Something went wrong!');

      const res = await nftApi.getNftDetail({
        tokenAddress,
        tokenId,
        chainId: environment.mainnetChainIdNumber,
      });

      setIsLoading(false);

      const newNft = res.data
        ? await parseMetaDataToMoralis(res.data)
        : undefined;
      setError('');
      setDetailNft(newNft);
      return Promise.resolve(res);
    } catch (err) {
      setIsLoading(false);
      setError(
        (err as AxiosError<RequestError>)?.response?.data?.message ||
          'Something went wrong!'
      );
      return Promise.reject((err as AxiosError<RequestError>)?.response?.data);
    }
  }, [tokenId, tokenAddress]);

  useEffect(() => {
    if (enable && !!tokenAddress && !!tokenId) {
      fetchNFT();
    }
  }, [fetchNFT, tokenAddress, tokenId]);

  return {
    isLoading,
    error,
    detailNft,
    refetch: fetchNFT,
  };
};
