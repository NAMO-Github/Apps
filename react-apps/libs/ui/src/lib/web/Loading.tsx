import { memo } from 'react';
import { List } from 'react-content-loader';
import styled from 'styled-components';

const Loading = () => {
  return (
    <WrapLoading>
      <List />
    </WrapLoading>
  );
};
export default memo(Loading);
const WrapLoading = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem 0;
`;
