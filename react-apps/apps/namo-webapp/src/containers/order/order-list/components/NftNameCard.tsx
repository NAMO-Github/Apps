import ImageNFT from '@components/ImageNFT';
import { DEFAULT_USERNAME } from '@constants/common';
import {
  InfoNFT,
  parseMetaDataToMoralis,
  Resolution,
} from '@namo-workspace/services';
import { useEffect, useState } from 'react';
import { LenderName, NftImage, NftName } from '../order.styled';

type Props = {
  nftRaw: string;
};

export default function NftNameCard({ nftRaw }: Props) {
  const [detailNft, setDetailNft] = useState<InfoNFT>();

  useEffect(() => {
    const effect = async () => {
      try {
        const nftParsed = JSON.parse(nftRaw) as InfoNFT;
        const result = await parseMetaDataToMoralis(nftParsed);
        setDetailNft(result);
      } catch (error) {
        setDetailNft({});
      }
    };
    effect();
  }, [nftRaw]);

  return (
    <div className="d-flex flex-row">
      <NftImage>
        <ImageNFT className="me-2" infoNFT={detailNft} size={Resolution.Low} />
      </NftImage>
      <div className="d-flex flex-column">
        <LenderName className="mb-1">
          {detailNft?.ownerName || DEFAULT_USERNAME}
        </LenderName>
        <NftName>{detailNft?.metaData?.name || DEFAULT_USERNAME}</NftName>
      </div>
    </div>
  );
}
