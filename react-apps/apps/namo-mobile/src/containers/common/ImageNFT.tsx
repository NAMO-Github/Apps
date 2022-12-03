import {
  buildResizeImageLink,
  InfoNFT,
  parseMetaDataToMoralis,
  Resolution,
} from '@namo-workspace/services';
import * as Sentry from '@sentry/react-native';
import React, { FC, useEffect, useState } from 'react';
import { StyleProp } from 'react-native';
import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
import styled from 'styled-components/native';
import ImgDefaultNFT from '../../assets/images/img_default_nft.svg';
import ContentLoader, { Rect } from 'react-content-loader/native';

const ImageComponent = createImageProgress(FastImage);
// const ImageIOS = createImageProgress(RNImage);
// const ImageComponent = Image;

interface Props {
  detailNft?: InfoNFT;
  size: number;
  borderRadius?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style?: StyleProp<any>;
  resolution?: Resolution;
}
const ImageNFT: FC<Props> = ({
  size,
  borderRadius,
  style,
  detailNft,
  resolution = Resolution.Low,
}) => {
  const [isError, setIsError] = useState(false);
  const [source, setSource] = useState<string | undefined>(undefined);

  const [resolveNft, setResolveNft] = useState<InfoNFT>();
  useEffect(() => {
    const effect = async () => {
      if (detailNft) {
        if (!detailNft.metaData) {
          setResolveNft(await parseMetaDataToMoralis(detailNft));
        } else {
          setResolveNft(detailNft);
        }
        setIsError(false);
      }
    };
    effect();
  }, [detailNft]);

  useEffect(() => {
    if (resolveNft) {
      if (resolveNft.renderNFT) {
        setSource(buildResizeImageLink(resolveNft.renderNFT, resolution));
      } else {
        setSource(resolveNft.metaData?.image);
      }
    }
  }, [resolveNft, resolution]);

  if (!resolveNft || !source)
    return (
      <ImgDefaultContainer>
        <ImgDefaultNFT width={size} height={size} />
      </ImgDefaultContainer>
    );

  return (
    <ImageComponent
      source={{ uri: source }}
      resizeMode="cover"
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
      imageStyle={{
        borderRadius: borderRadius ? borderRadius : 8,
      }}
      indicator={() => (
        <ContentLoader
          speed={1}
          width="100%"
          height="100%"
          backgroundColor="#f3f3f3"
          foregroundColor="#ffffff"
        >
          <Rect rx="6" ry="6" width="100%" height="100%" />
        </ContentLoader>
      )}
      onError={() => {
        if (!isError) {
          setIsError(true);
          setSource(resolveNft.metaData?.image || undefined);
        }
      }}
      renderError={(error) => {
        Sentry.captureException(error);
        return <ImgDefaultNFT width={size} height={size} />;
      }}
    />
  );
};

export default ImageNFT;

const ImgDefaultContainer = styled.View`
  align-items: center;
  justify-content: center;
`;
