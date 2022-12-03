import DetailNFT from '@components/DetailNFT/DetailNFT';
import { MY_NFT_ROUTES } from '@constants/routes';
import { environment } from '@namo-workspace/environments';
import { STATUS_NFT, useGetNftDetail } from '@namo-workspace/services';
import { SUCCESS, WARNING } from '@namo-workspace/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

type Props = {
  tokenAddress: string;
  tokenId: string;
  navigateFrom?: string;
};

export default function DetailNft({
  tokenAddress,
  tokenId,
  navigateFrom,
}: Props) {
  const intervalRef = useRef<NodeJS.Timer>();

  const [isProcessingAlert, setIsProcessingAlert] = useState(false);
  const [requestCount, setRequestCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const { refetch, detailNft, error } = useGetNftDetail({
    tokenAddress: tokenAddress,
    tokenId: tokenId,
    enable: false,
  });

  const getNftDetail = useCallback(async () => {
    setRequestCount((prev) => ++prev);
    await refetch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch]);

  useEffect(() => {
    const effect = async () => {
      if (navigateFrom === MY_NFT_ROUTES.SET_FOR_RENT) {
        getNftDetail();
        intervalRef.current = setInterval(() => {
          getNftDetail();
        }, environment.callLoopTime);
        return () => {
          if (intervalRef.current) clearInterval(intervalRef.current);
        };
      } else {
        await getNftDetail();
        setIsLoading(false);
      }
    };
    effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigateFrom, getNftDetail]);

  useEffect(() => {
    if (
      (detailNft &&
        detailNft.status &&
        detailNft.status !== STATUS_NFT.PROCESSING &&
        detailNft.status !== STATUS_NFT.UNAVAILABLE &&
        intervalRef.current) ||
      requestCount > environment.maxRequestLoop
    ) {
      clearInterval(intervalRef.current);
      setIsLoading(false);
    }
    if (
      navigateFrom === MY_NFT_ROUTES.SET_FOR_RENT &&
      ((detailNft && !detailNft.status) ||
        detailNft?.status === STATUS_NFT.PROCESSING) &&
      !isProcessingAlert
    ) {
      setIsProcessingAlert(true);
    }
    if (
      navigateFrom === MY_NFT_ROUTES.SET_FOR_RENT &&
      detailNft?.status === STATUS_NFT.FOR_RENT
    ) {
      toast.success(SUCCESS.SETUP_FOR_RENT_NFT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailNft, requestCount]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <DetailNFT infoNFT={detailNft} refetchNft={refetch} isLoading={isLoading} />
  );
}
