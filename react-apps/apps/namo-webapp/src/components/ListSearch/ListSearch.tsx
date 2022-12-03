import { FC } from 'react';
import styled from 'styled-components';
import { Colors, FontHeight, FontSize } from '@namo-workspace/themes';
import { ReactComponent as IcBxClock } from '@assets/images/ic-bx-clockcircle.svg';
import { ReactComponent as IcXCrossExit } from '@assets/images/ic-x-cross-exit.svg';
import { ellipsisHidden } from '@assets/styles/global.style';
import { Body2 } from '@namo-workspace/ui/Typography';

export interface ItemSearch {
  id: string;
  key: string;
  date: string;
}

interface Props {
  listSearch: ItemSearch[];
  onCloseKey: (param: string) => void;
  onClick: (param: ItemSearch) => void;
}

const ListSearch: FC<Props> = ({ listSearch, onCloseKey, onClick }) => {
  return (
    <Container>
      {listSearch &&
        listSearch.map((item: ItemSearch) => {
          return (
            <ItemSearch key={item.id} onClick={() => onClick(item)}>
              <WrapperContent>
                <IcBxClock />
                <Content>{item.key}</Content>
              </WrapperContent>

              <span
                className="d-flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseKey(item.id);
                }}
              >
                <IcXCrossExit />
              </span>
            </ItemSearch>
          );
        })}
    </Container>
  );
};

const Container = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const ItemSearch = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 8px 24px;
  transition: all 0.2s ease-in-out;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background: ${Colors.background2};
  }

  @media (max-width: 575.98px) {
    padding: 6px 12px;
    svg {
      width: 16px;
      height: 16px;
    }

    & span:last-child {
      height: 16px;
    }
  }
`;

const WrapperContent = styled.span`
  display: flex;
  align-items: center;
  width: calc(100% - 34px);
`;

const Content = styled(Body2)`
  margin-left: 10px;
  font-weight: 400;
  color: ${Colors.textLevel3};
  ${ellipsisHidden}
  width: 100%;

  @media (max-width: 575.98px) {
    font-size: ${FontSize.body4}px;
    line-height: ${FontHeight.body4}px;
  }
`;

export default ListSearch;
