import BackDrop from '@components/BackDrop';
import NavFilter from '@components/FilterNFT/NavFilter';
import Button from '@namo-workspace/ui/Button';
import { useContext, useLayoutEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  listFilterPrice,
  listFilterStatus,
  listFilterSort,
  listVisibility,
} from '@constants/filterNft';
import { Colors, FontHeight, FontSize } from '@namo-workspace/themes';
import { Body1 } from '@namo-workspace/ui/Typography';
import { STATUS_NFT } from '@namo-workspace/services';
import { FilterSearchContext, ParamsQuery } from '@context/filter-search';
import { useSearchParams } from 'react-router-dom';

export type ParamsFilter = {
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  price?: string;
  isVisible?: boolean | undefined;
};

interface PropsModalFilter {
  onFilterMobile: (params: ParamsFilter) => void;
  isHomeSearch: boolean;
  isRentalTab: boolean;
  isGallery: boolean;
  statusPublic?: boolean;
}

const ModalFilter = ({
  onFilterMobile,
  statusPublic = false,
  isHomeSearch,
  isRentalTab,
  isGallery,
}: PropsModalFilter) => {
  const { setIsFilterHome, isFilterHome } = useContext(FilterSearchContext);
  const [searchParams] = useSearchParams({});

  const [filterPrice, setFilterPrice] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string[] | undefined>();
  const [filterSort, setFilterSort] = useState<string>('');
  const [valueFilterVisibility, setValueFilterVisibility] = useState<
    boolean | undefined
  >(undefined);

  const newFilterStatus = useMemo(() => {
    if (isHomeSearch) return listFilterStatus;

    return listFilterStatus.filter(
      (item) =>
        item.value === STATUS_NFT.FOR_RENT || item.value === STATUS_NFT.RENTED
    );
  }, [isHomeSearch]);

  const handleReset = () => {
    setFilterPrice('');
    setFilterSort('');
    setFilterStatus(undefined);
    setValueFilterVisibility(undefined);
  };

  const handleApply = () => {
    const params: ParamsFilter = {};

    if (typeof valueFilterVisibility !== 'undefined') {
      params.isVisible = valueFilterVisibility;
    }

    if (filterPrice) {
      params.price = filterPrice;
    }

    if (filterSort) {
      params.updatedAt = filterSort;
    }

    if (filterStatus && filterStatus.toString()) {
      params.status = filterStatus.toString();
    }

    onFilterMobile(params);
  };

  useLayoutEffect(() => {
    const params: ParamsQuery = Object.fromEntries([...searchParams]);

    if (Object.keys(params).length !== 0) {
      setFilterPrice((prev) =>
        prev === (params.price || '') ? prev : params.price || ''
      );
      setValueFilterVisibility((prev) => {
        if (params.isVisible) {
          return prev === JSON.parse(params.isVisible)
            ? prev
            : JSON.parse(params.isVisible);
        } else {
          return prev;
        }
      });
      setFilterStatus((prev) =>
        prev && prev.toString() === (params.status || '')
          ? prev
          : params.status?.split(',') || undefined
      );
      setFilterSort((prev) =>
        prev === (params.updatedAt || '') ? prev : params.updatedAt || ''
      );
    } else {
      handleReset();
    }
  }, [searchParams]);

  const RenderNavFilter = () => {
    if (isGallery) {
      return (
        <NavFilter
          listVisibility={{
            value: valueFilterVisibility,
            setValue: setValueFilterVisibility,
            listFilter: listVisibility,
          }}
          filterSort={{
            value: filterSort,
            setValue: setFilterSort,
            listFilter: listFilterSort,
          }}
          isMobile={true}
        />
      );
    }

    if (isHomeSearch) {
      return (
        <NavFilter
          filterPrice={{
            value: filterPrice,
            setValue: setFilterPrice,
            listFilter: listFilterPrice,
          }}
          filterStatus={{
            value: filterStatus,
            setValueArray: setFilterStatus,
            listFilter: newFilterStatus,
          }}
          filterSort={{
            value: filterSort,
            setValue: setFilterSort,
            listFilter: listFilterSort,
          }}
          isMobile={true}
          statusPublic={statusPublic}
        />
      );
    }

    if (isRentalTab) {
      return (
        <NavFilter
          filterSort={{
            value: filterSort,
            setValue: setFilterSort,
            listFilter: listFilterSort,
          }}
          isMobile={true}
          statusPublic={statusPublic}
        />
      );
    }

    return (
      <NavFilter
        filterPrice={{
          value: filterPrice,
          setValue: setFilterPrice,
          listFilter: listFilterPrice,
        }}
        filterStatus={{
          value: filterStatus,
          setValueArray: setFilterStatus,
          listFilter: newFilterStatus,
        }}
        listVisibility={{
          value: valueFilterVisibility,
          setValue: setValueFilterVisibility,
          listFilter: listVisibility,
        }}
        filterSort={{
          value: filterSort,
          setValue: setFilterSort,
          listFilter: listFilterSort,
        }}
        isMobile={true}
        statusPublic={statusPublic}
      />
    );
  };

  return (
    <Container>
      <ContainerFilter className={isFilterHome ? 'show-modal' : 'hidden-modal'}>
        <Title>Filter</Title>

        {RenderNavFilter()}

        <WrapBtn>
          <Button
            className="flex-fill me-2"
            type="button"
            color="white"
            onClick={handleReset}
          >
            Reset
          </Button>

          <Button className="flex-fill" type="button" onClick={handleApply}>
            Apply
          </Button>
        </WrapBtn>
      </ContainerFilter>
      {isFilterHome && (
        <BackDrop
          onClick={() => setIsFilterHome(false)}
          zIndex={100}
          className="bg-drop"
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  & .bg-drop {
    background: rgba(0, 0, 0, 0.25);
  }

  & .show-modal {
    transform: translateY(-100%);
  }
  & .hidden-modal {
    transform: translateY(0);
  }
`;

const ContainerFilter = styled.div`
  width: 100%;
  position: fixed;
  top: 100%;
  left: 0;
  background: ${Colors.background};
  padding: 2.5rem 1rem;
  z-index: 101;
  transition: all 0.2s ease-in-out;
`;

const WrapBtn = styled.div`
  display: flex;
  align-items: center;

  button {
    flex: 1;
  }
`;

const Title = styled(Body1)`
  font-weight: 700;
  color: ${Colors.textLevel1};
  text-align: center;
  margin-bottom: 10px;

  @media (max-width: 575.98px) {
    font-weight: 600;
    font-size: ${FontSize.body2}px;
    line-height: ${FontHeight.body2}px;
  }
`;

export default ModalFilter;
