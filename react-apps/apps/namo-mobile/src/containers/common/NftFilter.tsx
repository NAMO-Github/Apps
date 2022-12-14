import Images from '@images';
import { Colors } from '@namo-workspace/themes';
import Button from '@namo-workspace/ui/Button';
import { Body2, Body3 } from '@namo-workspace/ui/Typography';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import styled, { css } from 'styled-components/native';

const { IcFilter } = Images;
export interface ParamsFilter {
  status?: string;
  isVisible?: boolean;
  price?: string;
  updatedAt?: string;
}
export interface ValueStatus {
  label: string;
  value: string;
}

const spliceValueParam = (list: string, value: string) => {
  return list.replace(new RegExp(',?' + value + ',?'), (match) => {
    const begin_comma = match.charAt(0) === ',';
    if (begin_comma && match.charAt(match.length - 1) === ',') {
      return ',';
    }
    return '';
  });
};

interface Props {
  valueStatus?: ValueStatus[];
  showVisibility?: boolean;
  myProfile?: boolean;
  filter?: ParamsFilter;
  onSubmit: (params: ParamsFilter) => void;
  onReset?: () => void;
  hidden?: boolean;
  sortOnly?: boolean;
  myGallery?: boolean;
}

const valueStatusDefault = [
  { label: 'For rent', value: 'FORRENT' },
  { label: 'Rented', value: 'RENTED' },
  { label: 'Ordered', value: 'ORDERED' },
  { label: 'Unavailable', value: 'UNAVAILABLE' },
];

const NftFilter = ({
  onSubmit,
  onReset,
  valueStatus,
  showVisibility,
  hidden,
  sortOnly,
  myGallery,
}: Props) => {
  const filterOptions = useMemo(() => {
    const filter = [
      {
        title: 'Status',
        name: 'status',
        isMulti: true,
        values: valueStatus ? [...valueStatus] : valueStatusDefault,
      },
      {
        title: 'Visibility',
        name: 'isVisible',
        values: showVisibility
          ? [
              { label: 'Visible', value: true },
              { label: 'Invisible', value: false },
            ]
          : [],
      },
      {
        title: 'Sort by Price',
        name: 'price',
        values: [
          { label: 'Highest to lowest', value: 'DESC' },
          { label: 'Lowest to highest', value: 'ASC' },
        ],
      },
      {
        title: 'Sort by Date',
        name: 'updatedAt',
        values: [
          {
            label: 'Newest to oldest',
            value: 'DESC',
          },
          {
            label: 'Oldest to newest',
            value: 'ASC',
          },
        ],
      },
    ];

    if (sortOnly) {
      return filter.slice(-1);
    }
    if (myGallery) {
      return [...filter.slice(1, 2), ...filter.slice(-1)];
    }
    return filter;
  }, [valueStatus, showVisibility, sortOnly, myGallery]);

  const [selected, setSelected] = useState<ParamsFilter>({});
  const actionSheetRef = useRef<ActionSheet>();

  const handleSelectFilter = useCallback(
    (property: string, value: string, isMulti?: boolean) => {
      const selectedTemp = { ...selected };
      if (
        isMulti &&
        selectedTemp[property] &&
        !selectedTemp[property]?.includes(value)
      ) {
        selectedTemp[property] += `,${value}`;
      } else if (
        isMulti &&
        selectedTemp[property] &&
        selectedTemp[property]?.includes(value)
      ) {
        const newSelected = spliceValueParam(selectedTemp[property], value);
        selectedTemp[property] = newSelected;
      } else {
        selectedTemp[property] = value;
      }
      setSelected({ ...selectedTemp });
    },
    [selected]
  );

  const handleResetFilter = useCallback(() => {
    setSelected({});
  }, []);

  const handleClose = useCallback(() => {
    actionSheetRef?.current?.hide();
  }, [actionSheetRef]);

  const handleApplyFilter = useCallback(() => {
    if (Object.keys(selected).length === 0) {
      onReset?.();
      handleClose();
      return;
    }
    const submitValue = {
      ...selected,
      status: selected.status || undefined,
      updatedAt: selected.updatedAt || 'DESC',
    };
    onSubmit(submitValue);
    handleClose();
  }, [selected, onSubmit, handleClose, onReset]);

  const handleToggleFilter = useCallback(() => {
    actionSheetRef?.current?.show();
  }, [actionSheetRef]);

  const renderOptions = useMemo(() => {
    return filterOptions.map((item, index) => {
      return item.values.length ? (
        <ItemFilter
          key={index}
          style={filterOptions.length - 1 === index && styles.border_none}
        >
          <ItemTitle fontWeight="700">{item.title}</ItemTitle>
          <ItemActions>
            {item.values.map((ele, i) => {
              return (
                <ItemButton
                  key={i}
                  isSelect={selected[item.name]
                    ?.toString()
                    ?.includes(ele.value?.toString())}
                  onPress={() =>
                    handleSelectFilter(item.name, ele.value, item.isMulti)
                  }
                >
                  <ItemText>{ele.label}</ItemText>
                </ItemButton>
              );
            })}
          </ItemActions>
        </ItemFilter>
      ) : null;
    });
  }, [filterOptions, handleSelectFilter, selected]);

  return (
    <Container hidden={hidden}>
      <FilterButton onPress={handleToggleFilter}>
        <IcFilter />
        <FilterText fontWeight="600">Filter</FilterText>
      </FilterButton>
      <ActionSheet ref={actionSheetRef} onClose={handleClose} gestureEnabled>
        <FilterTitle fontWeight="600">Filter</FilterTitle>
        {renderOptions}
        <GroupAction>
          <Button
            size="medium"
            style={styles.btn_edit}
            color="white"
            onPress={handleResetFilter}
          >
            Reset
          </Button>
          <Button
            size="medium"
            style={styles.btn_edit}
            onPress={handleApplyFilter}
          >
            Apply
          </Button>
        </GroupAction>
      </ActionSheet>
    </Container>
  );
};

export default NftFilter;

export const styles = StyleSheet.create({
  border_none: {
    borderBottomWidth: 0,
  },
  btn_edit: {
    width: '48%',
  },
});

const Container = styled.View`
  width: 90px;
  position: absolute;
  bottom: 8px;
  right: 8px;

  ${(props) =>
    props.hidden &&
    css`
      opacity: 0;
      height: 0;
    `};
`;

const FilterButton = styled.TouchableOpacity`
  background-color: ${Colors.primaryOrange};
  flex-direction: row;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
`;

const FilterText = styled(Body3)`
  color: ${Colors.white};
  margin-left: 5px;
`;

const FilterTitle = styled(Body2)`
  color: ${Colors.textLevel1};
  text-align: center;
  margin: 8px 16px;
`;

const ItemFilter = styled.View`
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${Colors.strokeLevel3};
`;

const ItemTitle = styled(Body3)`
  color: ${Colors.textLevel1};
`;

const ItemActions = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const ItemButton = styled.TouchableOpacity`
  width: 48%;
  padding: 6px 12px;
  border-radius: 6px;
  margin-top: 8px;

  ${({ isSelect }) => {
    if (isSelect) {
      return css`
        background-color: ${Colors.secondary};
        border: 1px solid ${Colors.primaryOrange};
      `;
    } else {
      return css`
        background-color: ${Colors.background2};
        border: 1px solid ${Colors.strokeLevel3};
      `;
    }
  }};
`;

const ItemText = styled(Body3)`
  color: ${Colors.textLevel2};
  text-align: center;
`;

const GroupAction = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 24px 16px;
`;
