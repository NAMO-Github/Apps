import { Colors } from '@namo-workspace/themes';
import { useCallback, useState } from 'react';
import ReactPaginate from 'react-paginate';
import Select, { SingleValue } from 'react-select';
import styled from 'styled-components';

export const pageSizeOptions = [
  {
    label: 10,
    value: 10,
  },
  {
    label: 20,
    value: 20,
  },
  {
    label: 50,
    value: 50,
  },
];

interface Props {
  initialPage?: number | undefined;
  pageCount: number;
  page: number;
  totalRecord: number;
  onPageChange?(selectedItem: { selected: number }): void;
  onPageSizeChange?(pageSize: number): void;
}

export default function Paginate({
  initialPage,
  pageCount,
  onPageSizeChange,
  onPageChange,
  page,
  totalRecord,
}: Props) {
  const [pageSize, setPageSize] = useState<
    SingleValue<{
      label: number;
      value: number;
    }>
  >(pageSizeOptions[0]);

  const countRecord =
    (page - 1) * (pageSize?.value || 0) + (pageSize?.value || 0);

  const handlePageSize = useCallback(
    (
      newValue: SingleValue<{
        label: number;
        value: number;
      }>
    ) => {
      setPageSize(newValue);
      !!newValue && !!onPageSizeChange && onPageSizeChange(newValue.value);
    },
    []
  );

  return (
    <ContainerS className="d-flex flex-row justify-content-between">
      <TextS>
        View{' '}
        <Select
          className="mx-2"
          classNamePrefix="namo-select"
          isMulti={false}
          value={pageSize}
          options={pageSizeOptions}
          onChange={handlePageSize}
          menuPlacement="top"
          isSearchable={false}
        />{' '}
        records per page
      </TextS>
      <div className="d-inline-flex align-items-center">
        <TextS>
          {(page - 1) * (pageSize?.value || 0) + 1}
          {' - '}
          {countRecord <= totalRecord ? countRecord : totalRecord} of{' '}
          {totalRecord} Activities
        </TextS>
        <ReactPaginate
          previousLabel="<"
          nextLabel=">"
          breakLabel="..."
          onPageChange={onPageChange}
          pageCount={pageCount}
          initialPage={initialPage}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
        />
      </div>
    </ContainerS>
  );
}
const ContainerS = styled.div`
  .pagination {
    margin: 0;
  }
  .page-item {
    background-color: transparent;
    border: none;
    border-radius: 8px;
  }
  .page-link {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: #c7c7c7;
    background-color: transparent;
    border: none;
    border-radius: 8px;
    outline: none !important;
    box-shadow: none !important;
  }
  .active {
    background: ${Colors.primaryOrange};
    .page-link {
      color: white;
    }
  }
  .namo-select__control {
    border: 1px solid ${Colors.strokeLevel3};
    border-radius: 8px;
    box-shadow: none !important;
    padding: 0 8px;
    caret-color: ${Colors.primaryOrange};
    cursor: pointer;

    &:hover {
      border-color: ${Colors.strokeLevel3} !important;
    }
    height: 40px;
  }
  .namo-select__menu {
    background: ${Colors.white};
    box-shadow: 0px 0.6px 1.8px rgba(0, 0, 0, 0.11),
      0px 3.2px 7.2px rgba(0, 0, 0, 0.13);
    border-radius: 16px;
    overflow: hidden;
    padding: 8px 0;
  }
  .namo-select__indicator-separator {
    display: none;
  }
  .namo-select__option {
    font-weight: 400;
    font-size: 16px;
    color: ${Colors.textLevel3};
    cursor: pointer;

    &:active {
      background-color: ${Colors.background2};
    }
  }
  .namo-select__option--is-focused {
    background-color: ${Colors.background2};
  }
  .namo-select__option--is-selected {
    background-color: ${Colors.background2};
  }
  .namo-select__menu-list {
    max-height: 250px;
  }
`;
const TextS = styled.div`
  display: inline-flex;
  align-items: center;

  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #767676;
`;
