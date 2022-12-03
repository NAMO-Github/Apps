import React, { FC, memo, useCallback } from 'react';
import {
  Dimensions,
  Pressable,
  TouchableOpacity,
  ViewProps,
} from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppRootParams } from '../../routes/routes.model';
import { Colors } from '@namo-workspace/themes';
import { ProfileRouter, SearchRouter } from '@routes/routes.constants';
import ImageNFT from '@containers/common/ImageNFT';
import { Body4, Sub } from '@namo-workspace/ui/Typography';
import Images from '@images';
import { InfoNFT, Resolution } from '@namo-workspace/services';

interface NFTCardProps {
  id?: string;
  title: string;
  lenderName: string;
  avatarUrl: string;
  isMyNFT?: boolean;
  isMyGallery?: boolean;
  showVisible?: boolean;
  visibleStatus?: boolean;
  isOpenVisibility?: boolean;
  canSelect?: boolean;
  isSelected?: boolean;
  handleSelected?: () => void;
  tokenId?: string;
  tokenAddress?: string;
  detailNft?: InfoNFT;
}
const { IcTick } = Images;
const { width } = Dimensions.get('window');
const column = 2;
const margin = 8;
const SIZE = (width - margin * 6) / column;
const CARD_SIZE = SIZE;
const TEXT_SIZE = SIZE - 40;

type NFTCardProp = NativeStackNavigationProp<AppRootParams, 'SEARCH'>;

const NFTCard: FC<NFTCardProps> = ({
  title,
  lenderName,

  avatarUrl,
  isMyNFT,
  isMyGallery = false,
  showVisible,
  visibleStatus,
  canSelect,
  isSelected,
  handleSelected,
  id,
  tokenId,
  tokenAddress,
  isOpenVisibility,
  detailNft,
}) => {
  const navigation = useNavigation<NFTCardProp>();
  const handleNavigateDetail = useCallback(() => {
    if (canSelect && isOpenVisibility) {
      handleSelected();
    } else {
      if (isMyNFT) {
        return navigation.push(ProfileRouter.NFT_DETAIL_FOR_RENT, {
          // id: id,
          tokenId: tokenId,
          tokenAddress: tokenAddress,
          title,
          isMyGallery: isMyGallery,
        });
      }
      return navigation.push(SearchRouter.NFT_DETAIL, {
        // id: id,
        title,
        tokenId: tokenId,
        tokenAddress: tokenAddress,
      });
    }
  }, [
    canSelect,
    handleSelected,
    isMyGallery,
    isMyNFT,
    isOpenVisibility,
    navigation,
    title,
    tokenAddress,
    tokenId,
  ]);
  return (
    <TouchableOpacity onPress={handleNavigateDetail} activeOpacity={0.6}>
      <CardContainer>
        <ImageContainer>
          <ImageNFT
            resolution={Resolution.VeryLow}
            detailNft={detailNft}
            size={CARD_SIZE}
          />
        </ImageContainer>
        <LenderContainer>
          {avatarUrl ? (
            <ImageAvatar source={{ uri: avatarUrl }} resizeMode="cover" />
          ) : (
            <ImageAvatar
              source={require('../../assets/images/img_avatar.png')}
            />
          )}
          <LenderName numberOfLines={1}>{lenderName}</LenderName>
        </LenderContainer>
        <TitleContainer>
          <CardTitle
            numberOfLines={1}
            color={Colors.textLevel3}
            fontWeight="600"
          >
            {title || 'Unnamed'}
          </CardTitle>
        </TitleContainer>
        {showVisible && <VisibleStatus isVisible={visibleStatus} />}
        {canSelect && isOpenVisibility && (
          <Selectcontainer>
            <Pressable onPress={handleSelected}>
              {isSelected ? <IcTick /> : <CircleChoose />}
            </Pressable>
          </Selectcontainer>
        )}
      </CardContainer>
    </TouchableOpacity>
  );
};

const CardContainer = styled.View`
  margin: 8px;
  align-items: center;
  justify-content: center;
`;

const ImageContainer = styled.View`
  overflow: hidden;
  width: ${CARD_SIZE}px;
  position: relative;
  bottom: 0;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;

const LenderContainer = styled.View`
  height: 28px;
  margin-top: 8px;
  width: ${CARD_SIZE}px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;

const ImageAvatar = styled.Image`
  height: 20px;
  width: 20px;
  border-radius: 10px;
`;

const LenderName = styled(Sub)`
  width: ${TEXT_SIZE}px;
  margin-left: 8px;
  color: ${Colors.textLevel2};
`;

const TitleContainer = styled.View`
  margin: 3px 0 8px 0;
  width: ${CARD_SIZE}px;
`;
const CardTitle = styled(Body4)``;

const VisibleStatus = styled.View<ViewProps & { isVisible?: boolean }>`
  position: absolute;
  top: 8px;
  left: 10px;
  width: 12px;
  height: 12px;
  border-width: 1px;
  border-radius: 6px;
  border-color: ${Colors.white};
  background-color: ${(props) =>
    props.isVisible ? Colors.primaryGreen : Colors.primaryRed};
`;
const Selectcontainer = styled.View`
  position: absolute;
  top: 3%;
  right: 5%;
`;
const CircleChoose = styled.View`
  position: absolute;
  top: 3%;
  right: 5%;
  width: 20px;
  height: 20px;
  border-width: 1px;
  border-radius: 10px;
  border-color: ${Colors.white};
  background-color: ${Colors.body4};
`;

export default memo(NFTCard);
