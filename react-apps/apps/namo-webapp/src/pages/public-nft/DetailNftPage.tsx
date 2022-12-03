import DetailNft from '@containers/public-nft/DetailNft';
import useTypeLocation from '@hooks/useTypeLocation';
import { useParams } from 'react-router';

export default function DetailNftPage() {
  const { tokenId, tokenAddress } = useParams();
  const { state } = useTypeLocation<{ from: string }>();
  return (
    <DetailNft
      tokenId={tokenId || ''}
      tokenAddress={tokenAddress || ''}
      navigateFrom={state?.from || ''}
    />
  );
}
