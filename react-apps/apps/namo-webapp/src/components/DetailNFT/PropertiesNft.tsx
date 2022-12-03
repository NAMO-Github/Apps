import { Attributes } from '@namo-workspace/services';
import {
  Properties,
  PropertiesLabel,
  PropertiesValue,
} from './detailNFT.styled';

interface PropertiesNftProps {
  properties: Attributes;
}

const PropertiesNft = ({ properties }: PropertiesNftProps) => {
  return (
    <Properties>
      <PropertiesLabel>{properties.trait_type}</PropertiesLabel>
      <PropertiesValue>{properties.value}</PropertiesValue>
    </Properties>
  );
};

export default PropertiesNft;
