import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useMemo, useState } from 'react';
import { InfoNFT, nftApi, ParamGetNft } from '../api/getNFT.api';

interface Props {
  address: string;
  cursor?: string;
  filterParams?: ParamGetNft;
}

export const useGetGalleryNFT = ({ address, filterParams }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [fetchSuccess, setFetchSuccess] = useState(true);
  const [error, setError] = useState<string>('');
  const [listNFT, setListNFT] = useState<InfoNFT[]>([]);
  const [countNFT, setCountNFT] = useState<number>(0);
  const [newCursor, setNewCursor] = useState<string>('');
  const [callTime, setCallTime] = useState(0);

  const isEmpty = useMemo(() => {
    if (callTime <= 1 && listNFT.length === 0) {
      return true;
    }
    return false;
  }, [callTime, listNFT]);

  const fetchListNFT = useCallback(
    async (cursor?: string) => {
      if (!address) return;
      setIsLoading(true);
      if (filterParams) {
        await nftApi
          .fetchListNFTGallery({ address, cursor, ...filterParams })
          .then(async (res) => {
            const { data: NFTs, count, cursor: newCursor } = res;
            setCallTime((prev) => (prev += 1));
            setNewCursor(newCursor || '');
            // const newNFTs: InfoNFT[] = [];
            setCountNFT(count);
            // for (const NFT of NFTs) {
            //   const newNFT = await parseMetaDataToMoralis(NFT);
            //   newNFTs.push(newNFT);
            // }
            setListNFT((prev) => {
              return cursor ? [...prev, ...NFTs] : NFTs;
            });
            setIsLoading(false);
            setFetchSuccess(true);
          })
          .catch((err) => {
            setIsLoading(false);
            setError(err?.message);
            setFetchSuccess(false);
          });
      }
    },
    [address, filterParams]
  );
  const loadMoreList = useCallback(async () => {
    if (newCursor) {
      if (!address) return;
      setIsLoadingMore(true);
      if (filterParams) {
        await nftApi
          .fetchListNFTGallery({ address, cursor: newCursor, ...filterParams })
          .then(async (res) => {
            const { data: NFTs, count, cursor: newCursor } = res;
            setNewCursor(newCursor || '');
            setCountNFT(count);
            setListNFT((prev) => [...prev, ...NFTs]);
            setIsLoadingMore(false);
          })
          .catch((err) => {
            setIsLoadingMore(false);
            setError(err?.message);
          });
      }
    }
  }, [fetchListNFT, newCursor]);

  const refreshData = useCallback(() => {
    if (filterParams) {
      setIsLoading(true);
      nftApi
        .fetchListNFTGallery({ address, ...filterParams })
        .then(async ({ data: NFTs, count, cursor: newCursor }) => {
          setCallTime(1);
          setNewCursor(newCursor || '');
          setCountNFT(count);
          setListNFT(NFTs);
          setIsLoading(false);
          setFetchSuccess(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [filterParams]);

  useFocusEffect(
    useCallback(() => {
      fetchListNFT();
    }, [fetchListNFT])
  );

  return {
    fetchListNFT,
    fetchSuccess,
    isLoading,
    error,
    listNFT,
    countNFT,
    newCursor,
    isEmpty,
    loadMore: loadMoreList,
    isLoadingMore,
    setCallTime,
    refreshData,
  };
};
