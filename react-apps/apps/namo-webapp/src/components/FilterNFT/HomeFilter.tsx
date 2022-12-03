import { Colors, FontHeight, FontSize } from '@namo-workspace/themes';
import { Body2 } from '@namo-workspace/ui/Typography';
import { FC } from 'react';
import styled from 'styled-components';

type ItemFilter = {
  value: string;
  label: string;
};

type ItemValueBoolean = {
  value: boolean | undefined;
  label: string;
};

export type ItemProps = {
  listFilter: ItemFilter[];
};

export type ItemBooleanProps = {
  listFilter: ItemValueBoolean[];
};

export interface HomeFilterValue {
  filterPrice?: string;
  filterStatus?: string[];
  filterSort?: string;
}
export interface PropsNavFilter {
  filterPrice?: ItemProps;
  filterStatus?: ItemProps;
  filterSort?: ItemProps;
  value?: HomeFilterValue;
  onChange?: (value: HomeFilterValue) => void;
  listVisibility?: ItemBooleanProps;
  isMobile?: boolean;
  statusPublic?: boolean;
}

const HomeFilter: FC<PropsNavFilter> = ({
  filterPrice,
  filterStatus,
  filterSort,
  listVisibility,
  isMobile = false,
  statusPublic = false,
  value,
  onChange,
}) => {
  const handleActionFilterPrice = (data: string) => {
    if (!filterPrice) return;
    if (value?.filterPrice === data) {
      onChange?.({ ...value, filterPrice: '' });
    } else {
      onChange?.({ ...value, filterPrice: data });
    }
  };

  const handleActionFilterStatus = (data: string) => {
    if (!filterStatus) return;

    if (
      value?.filterStatus &&
      Array.isArray(value.filterStatus) &&
      value.filterStatus.includes(data)
    ) {
      const listFilter = value.filterStatus.filter((item) => item !== data);
      onChange?.({ ...value, filterStatus: listFilter });
    } else {
      onChange?.({
        ...value,
        filterStatus: [...(value?.filterStatus || []), data],
      });
    }
  };

  const handleActionSort = (data: string) => {
    if (!filterSort) return;

    if (value?.filterSort === data) {
      onChange?.({ ...value, filterSort: '' });
    } else {
      onChange?.({ ...value, filterSort: data });
    }
  };

  return (
    <ContainerFilter className={isMobile ? 'border-0 p-0' : ''}>
      {filterStatus && (
        <WrapFilter>
          <FilterLabel>Status</FilterLabel>
          {filterStatus.listFilter.map((item) => (
            <FilterOption
              className={`${isMobile ? 'layout-btn-sort' : ''} ${
                value?.filterStatus &&
                value?.filterStatus.includes(item.value) &&
                'filter-action'
              }`}
              key={item.value}
              onClick={() => handleActionFilterStatus(item.value)}
            >
              {item.label}
            </FilterOption>
          ))}
        </WrapFilter>
      )}

      {filterPrice && (
        <WrapFilter>
          <FilterLabel>Sort by Price</FilterLabel>
          {filterPrice.listFilter.map((item) => (
            <FilterOption
              className={`${isMobile ? 'layout-btn-sort' : ''} ${
                value?.filterPrice === item.value && 'filter-action'
              }`}
              key={item.value}
              onClick={() => handleActionFilterPrice(item.value)}
            >
              {item.label}
            </FilterOption>
          ))}
        </WrapFilter>
      )}

      {filterSort && (
        <WrapFilter>
          <FilterLabel>Sort by Date</FilterLabel>
          {filterSort.listFilter.map((item) => (
            <FilterOption
              className={`${isMobile ? 'layout-btn-sort' : ''} ${
                value?.filterSort === item.value && 'filter-action'
              }`}
              key={item.value}
              onClick={() => handleActionSort(item.value)}
            >
              {item.label}
            </FilterOption>
          ))}
        </WrapFilter>
      )}
    </ContainerFilter>
  );
};

const ContainerFilter = styled.div`
  padding-right: 8px;
  height: 100%;

  & div:not(:last-child) {
    border-bottom: 1px solid ${Colors.strokeLevel3};
  }
`;

const WrapFilter = styled.div`
  padding: 20px 0;

  & button:not(:last-child) {
    margin-bottom: 8px;
  }

  & .filter-action {
    background: ${Colors.secondary};
    border: 1px solid ${Colors.primaryOrange};
    border-radius: 6px;
    transition: all 0.2s ease-in-out;

    &:hover {
      background: #f5f1cc;
    }
  }

  & .layout-btn-sort:nth-child(even) {
    margin-right: 8px;
  }

  @media (max-width: 575.98px) {
    padding: 1rem 0;
  }
`;

const FilterLabel = styled(Body2)`
  font-weight: 600;
  color: ${Colors.foreground};
  display: block;
  margin-bottom: 8px;

  @media (max-width: 575.98px) {
    font-size: ${FontSize.body3}px;
    line-height: ${FontHeight.body3}px;
  }
`;

const FilterOption = styled.button`
  width: 100%;
  border: 1px solid ${Colors.strokeLevel3};
  border-radius: 6px;
  background: ${Colors.background2};
  padding: 8px;
  transition: all 0.2s ease-in-out;
  outline: none;
  color: ${Colors.textLevel2};

  &:hover {
    background: ${Colors.background};
  }

  &.layout-btn-sort {
    width: calc(50% - 4px);
  }

  @media (max-width: 575.98px) {
    font-weight: 400;
    font-size: ${FontSize.body3}px;
    line-height: ${FontHeight.body3}px;
    padding: 6px;
    height: 32px;
  }
`;

export default HomeFilter;
