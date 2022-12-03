import ContainerSearch from '@components/ListSearch/ContainerSearch';
import useMediaQuery, { QUERY } from '@hooks/useMediaQuery';
import { Colors, FontHeight, FontSize } from '@namo-workspace/themes';
import Button from '@namo-workspace/ui/Button';
import React, { FC, useContext } from 'react';
import styled from 'styled-components';
import { ReactComponent as IcBxSearch } from '@assets/images/ic-bx-search.svg';
import { Body3 } from '@namo-workspace/ui/Typography';
import { FilterSearchContext } from '@context/filter-search';
interface SearchSetVisibilityProps {
  onHandleSelectAll: () => void;
  onHandleCancel: () => void;
  valueSearch?: string;
  onSetValueSearch?: React.Dispatch<React.SetStateAction<string>>;
  disabled?: boolean;
  onHandleHideSelected: () => void;
  onHandleShowSelected: () => void;
  isSetVisibility: boolean;
  statusPublic?: boolean;
  onSetIsSetVisibility: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchSetVisibility: FC<SearchSetVisibilityProps> = ({
  onHandleSelectAll,
  onHandleCancel,
  valueSearch,
  onSetValueSearch,
  onHandleHideSelected,
  onHandleShowSelected,
  onSetIsSetVisibility,
  disabled = false,
  isSetVisibility = false,
  statusPublic = false,
}) => {
  const isDesktop = useMediaQuery(QUERY.DESKTOP);
  const { isSearchProfile, setIsSearchProfile } =
    useContext(FilterSearchContext);

  const RenderBtnSetVisibility = () => (
    <BtnCustom
      color="white"
      size={isDesktop ? 'large' : 'medium'}
      className="ms-auto"
      onClick={() => onSetIsSetVisibility(true)}
    >
      Set Visibility
    </BtnCustom>
  );

  const RenderGBtnSelectAllCancel = () => (
    <>
      <BtnCustom
        color="white"
        size={isDesktop ? 'large' : 'medium'}
        className="ms-0 me-lg-3 ms-lg-auto"
        onClick={onHandleSelectAll}
      >
        Select All
      </BtnCustom>

      <BtnCustom
        color="white"
        size={isDesktop ? 'large' : 'medium'}
        className="ms-auto"
        onClick={onHandleCancel}
      >
        Cancel
      </BtnCustom>
    </>
  );

  const RenderGBtnHiddenShowSetVisibility = () => (
    <>
      <Button
        color="white"
        size={isDesktop ? 'large' : 'medium'}
        className="me-lg-3 flex-grow-1"
        disabled={disabled}
        onClick={onHandleHideSelected}
      >
        Hide Selected
      </Button>

      <Button
        color="main"
        size={isDesktop ? 'large' : 'medium'}
        className=" ms-3 ms-lg-auto flex-grow-1 "
        disabled={disabled}
        onClick={onHandleShowSelected}
      >
        Show Selected
      </Button>
    </>
  );

  const RenderSearch = () => {
    if (onSetValueSearch) {
      return (
        <WrapSearch>
          <ContainerSearch
            valueSearch={valueSearch || ''}
            onSetValueSearch={onSetValueSearch}
            listKeyLocal={'listKeySearchMyNFT'}
            size={isDesktop ? 'large' : 'medium'}
            zIndex={10}
          />
        </WrapSearch>
      );
    }

    return null;
  };

  const RenderBoxSearchSetVisible = () => {
    if (isSetVisibility) {
      return <div>{RenderGBtnSelectAllCancel()}</div>;
    }

    return onSetValueSearch ? (
      <WrapFilterSearch style={{ width: statusPublic ? '100%' : 'auto' }}>
        {RenderSearch()}
      </WrapFilterSearch>
    ) : null;
  };

  const RenderBtnHiddenShowSelected = () => {
    if (isSetVisibility) {
      return <div>{RenderGBtnHiddenShowSetVisibility()}</div>;
    }

    return RenderBtnSetVisibility();
  };

  const RenderComponent = () => {
    if (isDesktop) {
      return (
        <>
          {RenderBoxSearchSetVisible()}
          {!statusPublic && RenderBtnHiddenShowSelected()}
        </>
      );
    }

    if (isSearchProfile) {
      return (
        <>
          {RenderSearch()}
          <Cancel className="ms-3" onClick={() => setIsSearchProfile(false)}>
            Cancel
          </Cancel>
        </>
      );
    }

    if (isSetVisibility) {
      return RenderGBtnSelectAllCancel();
    }

    if (statusPublic) {
      return RenderSearch();
    }

    return (
      <>
        {onSetValueSearch && (
          <WrapSearchM onClick={() => setIsSearchProfile(true)}>
            <IcBxSearch width={24} height={24} />
          </WrapSearchM>
        )}

        {!statusPublic && RenderBtnSetVisibility()}
      </>
    );
  };

  return (
    <HeaderTabContent>
      {RenderComponent()}
      {!isDesktop && (
        <WrapSetSelected className={isSetVisibility ? 'show' : ''}>
          {RenderGBtnHiddenShowSetVisibility()}
        </WrapSetSelected>
      )}
    </HeaderTabContent>
  );
};

const WrapFilterSearch = styled.div`
  display: flex;
  align-items: center;
`;

const WrapSearch = styled.div`
  min-width: 400px;
  width: 100%;

  @media (max-width: 991.98px) {
    min-width: 320px;
  }

  @media (max-width: 575.98px) {
    min-width: initial;
  }
`;

const HeaderTabContent = styled.div`
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
`;

const BtnCustom = styled(Button)`
  border: 1px solid ${Colors.border};
  color: ${Colors.textLevel3};

  @media (max-width: 991.98px) {
    font-weight: 600;
    font-size: ${FontSize.body3}px;
    line-height: ${FontHeight.body3}px;
    border-radius: 1000px;
  }

  @media (max-width: 575.98px) {
    font-size: ${FontSize.body4}px;
    line-height: ${FontHeight.body4}px;
  }
`;

const WrapSearchM = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${Colors.background};
  border: 1px solid ${Colors.border};
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: ${Colors.primaryOrangeMinus7};
  }

  @media (max-width: 575.98px) {
    width: 32px;
    height: 32px;

    & svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const Cancel = styled(Body3)`
  height: 40px;
  font-weight: 400;
  line-height: 40px;
  color: ${Colors.textLevel3};
  margin: 0;
  display: inline-block;
  padding: 0 16px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  border-radius: 4px;

  &:hover {
    background: #f7f7f7;
  }

  @media (max-width: 575.98px) {
    height: 32px;
    line-height: 32px;
  }
`;

const WrapSetSelected = styled.div`
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 12;
  width: 100%;
  padding: 8px 16px;
  transition: all 0.2s ease-in-out;
  transform: translateY(100%);
  background: ${Colors.background};

  &.show {
    transform: translateY(0);
  }
`;

export default SearchSetVisibility;
