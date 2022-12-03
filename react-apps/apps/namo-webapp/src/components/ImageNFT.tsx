import { defaultNftImage } from '@assets/images';
import {
  buildResizeImageLink,
  InfoNFT,
  regexUrl,
  Resolution,
} from '@namo-workspace/services';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import styled, { css } from 'styled-components';
import { useInView } from 'react-intersection-observer';

interface Props {
  className?: string;
  infoNFT: InfoNFT | undefined;
  size: Resolution;
}

const ImageNFT = ({ className, infoNFT, size = Resolution.Medium }: Props) => {
  const [isError, setIsError] = useState<boolean>(false);
  const refVideo = useRef(null);
  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    const { current } = refVideo;
    if (current) {
      if (inView) {
        (current as HTMLVideoElement).play();
      } else {
        (current as HTMLVideoElement).pause();
      }
    }
  }, [inView]);

  const linkResize = useMemo(() => {
    if (infoNFT?.renderNFT && size) {
      return buildResizeImageLink(infoNFT.renderNFT, size);
    }

    return (
      infoNFT?.metaData?.animationUrl ||
      infoNFT?.metaData?.image ||
      infoNFT?.tokenUri ||
      defaultNftImage
    );
  }, [infoNFT, size]);

  return (
    <ContainerImage className={className}>
      <WrapImageNFT>
        {infoNFT?.metaData?.animationUrl?.endsWith('.mp4') ||
        infoNFT?.metaData?.image?.endsWith('.mp4') ||
        infoNFT?.tokenUri?.endsWith('.mp4') ? (
          <WrapVideo ref={ref}>
            <Video
              width="100%"
              height="100%"
              ref={refVideo}
              controls
              autoPlay
              loop
              muted
            >
              <source
                src={
                  infoNFT?.metaData?.animationUrl ||
                  infoNFT?.metaData?.image ||
                  infoNFT?.tokenUri
                }
                type="video/mp4"
              />
            </Video>
          </WrapVideo>
        ) : !!infoNFT?.metaData?.animationUrl &&
          !regexUrl.test(infoNFT?.metaData?.animationUrl || '') ? (
          <Iframe
            src={infoNFT?.metaData?.animationUrl}
            onClick={(e) => e.stopPropagation()}
            allowFullScreen
          />
        ) : (
          <Image
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping

              if (!isError) {
                currentTarget.src =
                  infoNFT?.metaData?.animationUrl ||
                  infoNFT?.metaData?.image ||
                  infoNFT?.tokenUri ||
                  defaultNftImage;

                setIsError(true);
              } else {
                currentTarget.src = defaultNftImage;
              }
            }}
            src={linkResize}
            effect="blur"
            loading="lazy"
          />
        )}
      </WrapImageNFT>
    </ContainerImage>
  );
};

const styleImageNFt = css`
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: #e0e0e0;
  object-fit: cover;
  position: absolute;
  display: block;
`;

const ContainerImage = styled.div`
  position: relative;
  overflow: hidden;
`;

const WrapImageNFT = styled.div`
  padding-bottom: 100%;
  height: 0px;

  & span {
    display: initial !important;
  }
`;

const Video = styled.video`
  ${styleImageNFt}
  overflow: hidden;
`;

const WrapVideo = styled.div`
  ${styleImageNFt}
  overflow: hidden;
`;

const Image = styled(LazyLoadImage)`
  ${styleImageNFt}
`;
const Iframe = styled.iframe`
  ${styleImageNFt}
`;

export default memo(ImageNFT);
