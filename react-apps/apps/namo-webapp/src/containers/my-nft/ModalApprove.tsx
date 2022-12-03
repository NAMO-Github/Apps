import ModalContainer from '@components/Modal/ModalContainer';
import ModalWaitingMetamask from '@components/Modal/ModalWaitingMetamask';
import { MetamaskError, useWalletAuth } from '@context/wallet-auth';
import { environment } from '@namo-workspace/environments';
import { InfoNFT } from '@namo-workspace/services';
import Button from '@namo-workspace/ui/Button';
import { ERROR } from '@namo-workspace/utils';
import * as Sentry from '@sentry/react';
import tokenServices from '@services/token.services';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type Props = {
  isOpen: boolean;
  onOk: () => void;
  onClose: () => void;
  detailNft?: InfoNFT;
  durations: number[];
  prices: number[];
};

function ModalApprove({
  isOpen,
  onOk,
  onClose,
  detailNft,
  durations,
  prices,
}: Props) {
  const [isApproved, setIsApproved] = useState(false);

  const [isLoadingApprove, setIsLoadingApprove] = useState(false);
  const [isLoadingTransfer, setIsLoadingTransfer] = useState(false);

  const [isDone, setIsDone] = useState<boolean>(false);

  const { web3, account, metamask, chainId } = useWalletAuth();

  useEffect(() => {
    const effect = async () => {
      if (isOpen) {
        if (web3 && account && metamask) {
          try {
            setIsLoadingApprove(true);
            const isApproved = await tokenServices.getApprovedERC721(
              web3,
              detailNft?.tokenAddress || '',
              account,
              environment.namoSmartContract
            );
            setIsApproved(isApproved);
            setIsLoadingApprove(false);
          } catch (error) {
            Sentry.captureException(error);
            setIsLoadingApprove(false);
          }
        } else {
          toast.error(ERROR.ER_NO_METAMASK);
        }
      }
    };
    effect();
  }, [account, detailNft, isOpen, web3, metamask]);

  useEffect(() => {
    if (isDone) {
      onOk?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDone]);

  const handleApprove = useCallback(async () => {
    if (chainId && !environment.mainnetChainId.includes(chainId)) {
      toast.error(ERROR.ER_SET_FOR_RENT);
      return;
    }
    if (web3 && account && metamask) {
      setIsLoadingApprove(true);
      try {
        if (!detailNft) throw new Error();
        const isApproved = await tokenServices.getApprovedERC721(
          web3,
          detailNft?.tokenAddress || '',
          account,
          environment.namoSmartContract
        );

        if (!isApproved) {
          await tokenServices.approveERC721NFT(
            web3,
            detailNft?.tokenAddress || '',
            account,
            environment.namoSmartContract,
            true
          );
        }
        setIsApproved(true);

        setIsLoadingApprove(false);
      } catch (error) {
        setIsLoadingApprove(false);
        Sentry.captureException(error);
        if ((error as MetamaskError).code === 4001) {
          toast.error(ERROR.ER_DENIED_METAMASK);
        } else if ((error as MetamaskError).message) {
          toast.error((error as MetamaskError).message);
        } else {
          toast.error(ERROR.ER_SET_FOR_RENT);
        }
      }
    } else {
      toast.error(ERROR.ER_NO_METAMASK);
    }
  }, [account, chainId, detailNft, metamask, web3]);

  const handleTransfer = useCallback(async () => {
    if (chainId && !environment.mainnetChainId.includes(chainId)) {
      toast.error(ERROR.ER_SET_FOR_RENT);
      return;
    }
    if (web3 && account && metamask) {
      setIsLoadingTransfer(true);
      try {
        if (!detailNft) throw new Error();

        await tokenServices.listNft(
          web3,
          environment.namoSmartContract,
          account,
          detailNft.tokenAddress || '',
          detailNft.tokenId || '',
          durations,
          prices,
          environment.namoTokenSC
        );

        setIsDone(true);
        setIsLoadingTransfer(false);
      } catch (error) {
        setIsLoadingTransfer(false);
        Sentry.captureException(error);
        if ((error as MetamaskError).code === 4001) {
          toast.error(ERROR.ER_DENIED_METAMASK);
        } else if ((error as MetamaskError).message) {
          toast.error((error as MetamaskError).message);
        } else {
          toast.error(ERROR.ER_SET_FOR_RENT);
        }
      }
    } else {
      toast.error(ERROR.ER_NO_METAMASK);
    }
  }, [account, chainId, detailNft, durations, metamask, prices, web3]);

  const renderAction = () => (
    <div className="d-flex flex-column align-items-center w-100 px-3 pb-2 pt-2">
      <Button
        className="mb-3 w-100"
        onClick={handleApprove}
        isLoading={isLoadingApprove}
        disabled={isApproved}
      >
        {isApproved ? 'Approved' : 'Approve'}
      </Button>
      <Button
        className="w-100"
        onClick={handleTransfer}
        isLoading={isLoadingTransfer}
        disabled={!isApproved}
      >
        Send to the vault
      </Button>
    </div>
  );
  return (
    <>
      <ModalContainer
        title="Set NFT For Rent"
        isOpen={isOpen}
        footer={renderAction()}
        backdrop="static"
        onClose={onClose}
        closeButton
        size="small"
      />
      <ModalWaitingMetamask isOpen={isLoadingApprove || isLoadingTransfer} />
    </>
  );
}

export default ModalApprove;
