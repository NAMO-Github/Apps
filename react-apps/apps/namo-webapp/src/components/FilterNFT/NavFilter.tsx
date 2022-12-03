import { Colors, FontHeight, FontSize } from '@namo-workspace/themes';
import { Body2 } from '@namo-workspace/ui/Typography';
import { SetStateAction, FC, Dispatch } from 'react';
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
  value: string | string[] | undefined;
  setValue?: Dispatch<SetStateAction<string>>;
  setValueArray?: Dispatch<SetStateAction<string[] | undefined>>;
  listFilter: ItemFilter[];
};

export type ItemBooleanProps = {
  value: boolean | undefined;
  setValue: Dispatch<SetStateAction<boolean | undefined>>;
  listFilter: ItemValueBoolean[];
};

export interface PropsNavFilter {
  filterPrice?: ItemProps;
  filterStatus?: ItemProps;
  filterSort?: ItemProps;
  listVisibility?: ItemBooleanProps;
  isMobile?: boolean;
  statusPublic?: boolean;
}

const NavFilter: FC<PropsNavFilter> = ({
  filterPrice,
  filterStatus,
  filterSort,
  listVisibility,
  isMobile = false,
  statusPublic = false,
}) => {
  const handleActionFilterPrice = (data: string) => {
    if (!filterPrice) return;

    if (filterPrice.setValue) {
      if (filterPrice?.value === data) {
        filterPrice?.setValue('');
        return;
      }

      filterPrice?.setValue(data);
    }
  };

  const handleActionFilterStatus = (data: string) => {
    if (!filterStatus) return;

    if (filterStatus.setValueArray) {
      if (
        filterStatus.value &&
        filterStatus.value.includes(data) &&
        Array.isArray(filterStatus.value)
      ) {
        const listFilter = filterStatus.value.filter((item) => item !== data);
        filterStatus.setValueArray(listFilter);
        return;
      }

      filterStatus.setValueArray((prev) => (prev ? [...prev, data] : [data]));
    }
  };

  const handleActionSort = (data: string) => {
    if (!filterSort) return;

    if (filterSort.setValue) {
      if (filterSort.value === data) {
        filterSort.setValue('');
        return;
      }
      filterSort.setValue(data);
    }
  };

  const handleFilterActionVisibility = (data: boolean | undefined) => {
    if (!listVisibility) return;

    if (listVisibility.setValue) {
      if (listVisibility.value === data) {
        listVisibility.setValue(undefined);
        return;
      }
      listVisibility.setValue(data);
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
                filterStatus.value &&
                filterStatus.value.includes(item.value) &&
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

      {!statusPublic && listVisibility && (
        <WrapFilter>
          <FilterLabel>Visibility</FilterLabel>
          {listVisibility.listFilter.map((item) => (
            <FilterOption
              className={`${isMobile ? 'layout-btn-sort' : ''} ${
                listVisibility.value === item.value && 'filter-action'
              }`}
              key={item.label}
              onClick={() => handleFilterActionVisibility(item.value)}
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
                filterPrice.value === item.value && 'filter-action'
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
                filterSort.value === item.value && 'filter-action'
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

export default NavFilter;
