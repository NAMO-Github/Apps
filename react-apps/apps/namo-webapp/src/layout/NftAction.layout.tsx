import { defaultNftImage } from '@assets/images';
import ImageNFT from '@components/ImageNFT';
import NavigationBar from '@components/NavigationBar';
import { DEFAULT_USERNAME } from '@constants/common';
import useMediaQuery, { QUERY } from '@hooks/useMediaQuery';
import { InfoNFT, Resolution } from '@namo-workspace/services';
import { MaxWidthContent } from '@namo-workspace/ui/MaxWidthContent.styled';
import { FC, ReactNode } from 'react';
import { Instagram } from 'react-content-loader';
import styled from 'styled-components';

interface Props {
  isLoading?: boolean;
  detailNft: InfoNFT | undefined;
  onNavigateBack: () => void;
  children: ReactNode | ReactNode[];
}

const NftActionLayout: FC<Props> = ({
  isLoading,
  detailNft,
  onNavigateBack,
  children,
}: Props) => {
  const isSmallMobile = useMediaQuery(QUERY.SMALL_MOBILE);
  const isDesktop = useMediaQuery(QUERY.DESKTOP);

  return (
    <div className="d-flex flex-column">
      <NavigationBar
        isLoading={isLoading}
        name={detailNft?.metaData?.name || detailNft?.name || DEFAULT_USERNAME}
        avatar={
          detailNft?.metaData?.image || detailNft?.tokenUri || defaultNftImage
        }
        onBack={onNavigateBack}
      />
      <MaxWidthContent className="p-container">
        <Container className="container-fluid px-0">
          <div className="row">
            <div className="col col-12 col-md-6 col-lg-7 px-0 pe-md-2 pe-lg-3 mt-0">
              {isLoading ? (
                <Instagram />
              ) : (
                <ImageNFT
                  className="mb-4"
                  infoNFT={detailNft}
                  size={
                    !isDesktop && !isSmallMobile
                      ? Resolution.Low
                      : Resolution.High
                  }
                />
              )}
              {Array.isArray(children) && children[1]}
            </div>

            <div className="col col-12 col-md-6 col-lg-5 px-0 ps-md-2 ps-lg-3 mt-0">
              {Array.isArray(children) ? children[0] : children}
            </div>
          </div>
        </Container>
      </MaxWidthContent>
    </div>
  );
};

const Container = styled.div`
  padding: 2rem 9%;

  .row {
    margin-left: 0;
    margin-right: 0;
  }
`;

export default NftActionLayout;
