import React, { FC } from 'react';
import styled from 'styled-components/native';
import TouchableOpacity from '@namo-workspace/ui/view/TouchableOpacity';
import { Colors } from '@namo-workspace/themes';
import Images from '@images';
import { Platform, TouchableOpacityProps } from 'react-native';
import { Body2 } from '@namo-workspace/ui/Typography';

const { IcSearch, IcClear } = Images;

interface ButtonSearchProps {
  value?: string;
  handleClearValue?: () => void;
  placeholder?: string;
}

const ButtonSearch: FC<TouchableOpacityProps & ButtonSearchProps> = (props) => {
  const { value, placeholder, handleClearValue, ...other } = props;
  return (
    <ButtonContainer {...other}>
      <PrefixContainer>
        <IcSearch />
      </PrefixContainer>
      {value ? (
        <TextSearch numberOfLines={1}>{value}</TextSearch>
      ) : (
        <Placeholder>{placeholder || 'Search NFT'}</Placeholder>
      )}
      {value ? (
        <SuffixContainer>
          <TouchableOpacity onPress={handleClearValue}>
            <IcClear />
          </TouchableOpacity>
        </SuffixContainer>
      ) : null}
    </ButtonContainer>
  );
};
export default ButtonSearch;

const ButtonContainer = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-radius: 8px;
  border-color: ${Colors.strokeLevel3};
  height: 48px;
  width: 100%;
  padding: ${Platform.OS === 'ios' ? '12px 15px' : '0px 15px'};
  margin-bottom: 16px;
`;

const PrefixContainer = styled.View`
  width: 20px;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
`;

const SuffixContainer = styled.View`
  width: 20px;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
`;
const TextSearch = styled(Body2)`
  width: 83%;
  color: ${Colors.textLevel1};
`;
const Placeholder = styled(Body2)`
  width: 83%;
  color: ${Colors.textLevel4};
`;
