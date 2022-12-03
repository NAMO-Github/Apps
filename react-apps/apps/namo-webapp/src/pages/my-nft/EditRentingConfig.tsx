import SetNftForRent from '@containers/my-nft/SetNftForRent';
import { useParams } from 'react-router';

export default function EditRentingConfig() {
  const { tokenId, tokenAddress } = useParams();
  return <SetNftForRent tokenId={tokenId} tokenAddress={tokenAddress} isEdit />;
}
