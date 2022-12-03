import { MAX_LENGTH_SEARCH } from '@constants/common';
import { Storage } from '@constants/storages';
import Images from '@images';
import { Colors } from '@namo-workspace/themes';
import InputSearch from '@namo-workspace/ui/InputSearch';
import { Body3 } from '@namo-workspace/ui/Typography';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SearchRouter } from '@routes/routes.constants';
import { SearchStackParams } from '@routes/routes.model';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styled from 'styled-components/native';
import IcSearch from '../assets/images/navigations/ic_search.svg';

const { IcLockCircle, IcClear } = Images;
const { width } = Dimensions.get('window');
type SearchNFTProps = NativeStackNavigationProp<
  SearchStackParams,
  'NFT_SEARCH'
>;

const SearchNFT: FC = () => {
  const [historys, setHistorys] = useState<string[]>([]);
  const [textSearch, onChangeTextSearch] = useState<string>();
  const navigation = useNavigation<SearchNFTProps>();
  const inputRef = useRef(null);
  const { params } = useRoute<RouteProp<ParamListBase>>();
  const keySearch = params?.['keySearch'];

  const handleClear = useCallback(() => {
    onChangeTextSearch('');
  }, [onChangeTextSearch]);

  const handleStoreHistory = useCallback((historys: string[]) => {
    const limitHistory = historys.slice(0, 10);
    setHistorys(limitHistory);
    const convertHistory = JSON.stringify(historys);
    AsyncStorage.setItem(Storage.SEARCH_HISTORY, convertHistory);
  }, []);

  const handleRemoveItemHistory = useCallback(
    (index: number) => {
      const oldHistorys = [...historys];
      oldHistorys.splice(index, 1);
      handleStoreHistory(oldHistorys);
    },
    [handleStoreHistory, historys]
  );

  const handleBackToSearchHome = useCallback(
    (keySearch: string) => {
      navigation.navigate(SearchRouter.NFT_LIST, {
        keySearch,
      });
    },
    [navigation]
  );

  const onSubmitSearch = useCallback(
    (e) => {
      const newText = e.nativeEvent.text;
      if (newText?.length) {
        const cloneHistory = [...historys];
        cloneHistory.unshift(newText.trim());
        handleStoreHistory(cloneHistory);
        handleBackToSearchHome(newText.trim());
      }
    },
    [handleBackToSearchHome, handleStoreHistory, historys]
  );

  const clickItemSearchHistory = useCallback(
    (keySearch) => {
      if (keySearch?.length) {
        const cloneHistory = [...historys];
        onChangeTextSearch(keySearch);
        cloneHistory.unshift(keySearch);
        handleStoreHistory(cloneHistory);
        handleBackToSearchHome(keySearch);
      }
    },
    [handleBackToSearchHome, handleStoreHistory, historys]
  );
  const initSearchHistory = async () => {
    const search_historys = await AsyncStorage.getItem(Storage.SEARCH_HISTORY);
    const historyList = search_historys && JSON.parse(search_historys);
    if (historyList?.length) {
      const limitHistory = historyList.slice(0, 10);
      setHistorys(limitHistory);
    }
  };

  useEffect(() => {
    onChangeTextSearch(keySearch);
  }, [keySearch]);

  useEffect(() => {
    initSearchHistory();
    return () => {
      setHistorys([]);
    };
  }, []);

  return (
    <Container>
      <SearchBoxContainer>
        <InputSearch
          ref={inputRef}
          placeholder="Search"
          prefix={<IcSearch />}
          showCancel
          handleCancel={() =>
            navigation.navigate(SearchRouter.NFT_LIST, {
              keySearch: textSearch,
            })
          }
          onSubmitEditing={onSubmitSearch}
          value={textSearch}
          onChangeText={onChangeTextSearch}
          handleClear={handleClear}
          maxLength={MAX_LENGTH_SEARCH}
          autoFocus
        />
      </SearchBoxContainer>

      <HistoryContainer>
        {historys.length ? (
          <RecentText fontWeight="700">Recent</RecentText>
        ) : null}
        <KeyboardAwareScrollView>
          {historys.map((item, index) => (
            <TouchableNativeFeedback
              key={index}
              onPress={() => clickItemSearchHistory(item)}
              background={TouchableNativeFeedback.Ripple(Colors.ripple, false)}
              useForeground
            >
              <HistoryItem>
                <ItemLeftContainer>
                  <IcLockCircle />
                  <HistoryText numberOfLines={1}>{item}</HistoryText>
                </ItemLeftContainer>
                <TouchableOpacity
                  onPress={() => handleRemoveItemHistory(index)}
                >
                  <IcClear />
                </TouchableOpacity>
              </HistoryItem>
            </TouchableNativeFeedback>
          ))}
        </KeyboardAwareScrollView>
      </HistoryContainer>
    </Container>
  );
};
export default SearchNFT;

const Container = styled.View`
  flex: 1;
  width: ${width}px;
  align-items: center;
  justify-content: flex-start;
  padding-top: 16px;
  background-color: ${Colors.white};
`;

const SearchBoxContainer = styled.View`
  width: ${width - 32}px;
`;
const HistoryContainer = styled.View`
  flex: 1;
`;

const RecentText = styled(Body3)`
  color: ${Colors.textLevel1};
  align-items: flex-start;
  margin: 8px 0;
  padding: 0 16px;
`;
const HistoryItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
`;
const ItemLeftContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: ${width - 64}px;
`;

const HistoryText = styled(Body3)`
  color: ${Colors.textLevel3};
  margin: 0 8px;
  padding-right: 8px;
`;
