import { ReactComponent as IconFilter } from '@assets/images/common/ic_filter_white.svg';
import { FilterSearchContext } from '@context/filter-search';
import useMediaQuery, { QUERY } from '@hooks/useMediaQuery';
import { Colors, FontHeight, FontSize } from '@namo-workspace/themes';
import { useCallback, useContext } from 'react';
import styled from 'styled-components';
import ModalFilter, { ParamsFilter } from './Modal/ModalFilter';

type Position = {
  position: 'absolute' | 'relative' | 'fixed' | 'sticky' | 'initial';
  zIndex?: number;
};
interface Props extends Position {
  onFilterMobile: (params: ParamsFilter) => void;
  isHomeSearch?: boolean;
  isGallery?: boolean;
  isRentalTab?: boolean;
  statusPublic?: boolean;
}

const FixedIconFilter = ({
  onFilterMobile,
  position,
  zIndex = 11,
  isHomeSearch = false,
  isGallery = false,
  isRentalTab = false,
  statusPublic = false,
}: Props) => {
  const { setIsFilterHome } = useContext(FilterSearchContext);
  const isDesktop = useMediaQuery(QUERY.DESKTOP);

  const handleFilter = useCallback(
    (data: ParamsFilter) => {
      onFilterMobile(data);
      setIsFilterHome(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setIsFilterHome]
  );

  return (
    <Container position={position} zIndex={zIndex}>
      <WrapFilter onClick={() => setIsFilterHome(true)}>
        <IconFilter width={20} height={20} />
        Filter
      </WrapFilter>

      {!isDesktop && (
        <ModalFilter
          onFilterMobile={handleFilter}
          isHomeSearch={isHomeSearch}
          isGallery={isGallery}
          isRentalTab={isRentalTab}
          statusPublic={statusPublic}
        />
      )}
    </Container>
  );
};

const Container = styled.div<Position>`
  background: ${Colors.primaryOrange};
  border-radius: 1000px;
  position: ${({ position }) => position};
  z-index: ${({ zIndex }) => zIndex};
  right: 40px;
  bottom: 30px;
  z-index: 11;
  transition: all 0.3 ease-in-out;

  &:hover {
    background-color: ${Colors.primaryOrangePlus2};
  }
`;

const WrapFilter = styled.div`
  height: 40px;
  padding: 0 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: ${FontSize.body3}px;
  line-height: ${FontHeight.body3}px;
  color: ${Colors.background};
  display: flex;
  align-items: center;

  svg {
    margin-right: 4px;
  }

  @media (max-width: 575.98px) {
    height: 32px;

    svg {
      height: 16px;
      width: 16px;
    }
  }
`;

export default FixedIconFilter;
