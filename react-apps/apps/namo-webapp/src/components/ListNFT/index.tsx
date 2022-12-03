import { FC } from 'react';
import { ROUTES } from '@constants/routes';
import { InfoNFT, NftVisible } from '@namo-workspace/services';
import { WrapperListNFT } from './listNFT.styled';
import ItemNFT from './ItemNFT';

interface PropsListData {
  listData: InfoNFT[];
  isDotVisible?: boolean;
  isSetVisibility?: boolean;
  isSelectedAll?: boolean | null;
  onHandleSelected?: (selected: boolean, nft: NftVisible) => void;
  className?: string;
}

const ListNFT: FC<PropsListData> = ({
  listData,
  isDotVisible,
  isSetVisibility = false,
  isSelectedAll,
  onHandleSelected,
  className,
}) => {
  return (
    <WrapperListNFT className={className}>
      {listData.map((item) => (
        <ItemNFT
          key={`${item.tokenId}${item.id}`}
          to={`${ROUTES.NFT}/${item.tokenAddress}/${item.tokenId}`}
          nft={item}
          className={`col col-6 col-sm-4 col-md-3`}
          isDotVisible={isDotVisible}
          isSetVisibility={isSetVisibility}
          isSelectedAll={isSelectedAll}
          onHandleSelected={onHandleSelected}
        />
      ))}
    </WrapperListNFT>
  );
};

export default ListNFT;
