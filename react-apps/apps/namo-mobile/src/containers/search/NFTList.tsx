import { ListFooterComponent } from '@containers/common/FooterLoading';
import { useAuth } from '@context/auth';
import { InfoNFT } from '@namo-workspace/services';
import { Colors } from '@namo-workspace/themes';
import InputField from '@namo-workspace/ui/Input';
import { Body4 } from '@namo-workspace/ui/Typography';
import React, { forwardRef, memo, useCallback } from 'react';
import {
  Dimensions,
  FlatList,
  FlatListProps,
  ListRenderItem,
} from 'react-native';
import Animated from 'react-native-reanimated';
import styled from 'styled-components/native';
import IcSearch from '../../assets/images/navigations/ic_search.svg';
import NFTCard from './NFTCard';

type NFTListProps = {
  countNFT?: number;
  canSearch?: boolean;
  loadingMore?: boolean;
  handleLoadMore?: () => void;
};
const { width } = Dimensions.get('window');
export const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
type Props = Omit<FlatListProps<InfoNFT> & NFTListProps, 'renderItem'>;

const NFTList = forwardRef<FlatList, Props>((props, ref) => {
  const keyExtractor = useCallback((_, index) => index?.toString(), []);
  const { address, isLoggedIn } = useAuth();

  const { canSearch, data, countNFT, loadingMore, handleLoadMore, ...other } =
    props;
  const renderItem = useCallback<ListRenderItem<InfoNFT>>(
    ({ item }) => {
      return (
        <NFTCard
          detailNft={item}
          title={item?.metaData?.name || ''}
          lenderName={item?.ownerName || 'Unnamed'}
          avatarUrl={item?.avatarOfOwner}
          isMyNFT={
            isLoggedIn &&
            address?.toLowerCase() === item?.rentalAddress?.toLowerCase()
          }
          id={item?.id || ''}
          tokenId={item?.tokenId || ''}
          tokenAddress={item?.tokenAddress || ''}
        />
      );
    },
    [isLoggedIn, address]
  );

  const onEndReachedHandler = useCallback(() => {
    handleLoadMore && handleLoadMore();
  }, [handleLoadMore]);

  return (
    <Container>
      <AnimatedFlatList
        ref={ref}
        ListHeaderComponent={
          data?.length &&
          canSearch && (
            <SearchContainer>
              <InputField
                keyboardType="web-search"
                placeholder="Search NFT"
                prefix={<IcSearch />}
              />
              <TotalItemContainer>
                <TotalContent fontWeight="700">
                  {countNFT || 0} items
                </TotalContent>
              </TotalItemContainer>
            </SearchContainer>
          )
        }
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        onEndReachedThreshold={0.5}
        showsHorizontalScrollIndicator={false}
        onEndReached={onEndReachedHandler}
        ListFooterComponent={() => loadingMore && <ListFooterComponent />}
        data={data}
        {...other}
      />
    </Container>
  );
});

export default memo(NFTList);

const Container = styled.View`
  flex: 1;
  width: ${width}px;
  align-items: flex-start;
  justify-content: center;
  padding-left: 8px;
`;

const SearchContainer = styled.View`
  width: ${width - 32}px;
  align-items: flex-start;
  justify-content: center;
  margin: 16px 0 0 8px;
`;
const TotalItemContainer = styled.View`
  align-items: flex-start;
  justify-content: flex-start;
`;
const TotalContent = styled(Body4)`
  color: ${Colors.textLevel1};
`;
