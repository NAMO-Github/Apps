/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Colors } from '@namo-workspace/themes';
import styled from 'styled-components';
import { ReactComponent as IcBxSearch } from '@assets/images/ic-bx-search.svg';
import ListSearch, { ItemSearch } from './ListSearch';
import Input from '@namo-workspace/ui/Input';
import { useState, ChangeEvent, KeyboardEvent } from 'react';
import { useLocalStorage } from '@hooks/useLocalStorage';
import { useLocation, useNavigate } from 'react-router';
import { ROUTES } from '@constants/routes';
import { v4 as uuid } from 'uuid';
import { format } from 'date-fns';
import BackDrop from '@components/BackDrop';
import { InputSize } from 'libs/ui/src/lib/shared/style/input.style';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import { ParamsQuery } from '@context/filter-search';

interface ContainerSearchProps {
  onSetValueSearch: (value: string) => void;
  listKeyLocal: string;
  valueSearch: string;
  isSearchHome?: boolean;
  size?: InputSize;
  zIndex?: number;
}

const ContainerSearch = ({
  onSetValueSearch,
  valueSearch,
  listKeyLocal,
  isSearchHome = false,
  size = 'large',
  zIndex = 2,
}: ContainerSearchProps) => {
  const navigate = useNavigate();
  const [closePopup, setClosePopup] = useState(false);
  const [listSearchLocal, setListSearchLocal] =
    useLocalStorage<ItemSearch[]>(listKeyLocal);
  const [searchParams, setSearchParams] = useSearchParams({});
  const { pathname } = useLocation();

  const handleEnterKey = (
    event: ChangeEvent<HTMLInputElement> & KeyboardEvent<HTMLInputElement>
  ) => {
    const { keyCode } = event;
    if (keyCode === 13) {
      const keySearch = valueSearch.trim();

      if (!keySearch) {
        onSetValueSearch('');
        navigateHome(keySearch);
        setClosePopup(false);
        event.target.blur();
        return;
      }

      let newListSearch;
      if (listSearchLocal) {
        const newKeySearch = listSearchLocal.filter(
          (item) => item.key !== keySearch
        );

        newListSearch = [
          {
            id: uuid(),
            key: keySearch,
            date: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
          },
          ...newKeySearch,
        ];
      } else {
        newListSearch = [
          {
            id: uuid(),
            key: keySearch,
            date: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
          },
        ];
      }

      onSetValueSearch(keySearch);
      setListSearchLocal(newListSearch.slice(0, 10));
      setClosePopup(false);
      event.target.blur();
      navigateHome(keySearch);
    }
  };

  const navigateHome = (keySearch: string) => {
    const params: ParamsQuery = Object.fromEntries([...searchParams]);
    const { search, ...newParams } = params;

    if (isSearchHome && pathname !== ROUTES.HOME) {
      navigate({
        pathname: ROUTES.HOME,
        search: createSearchParams(
          keySearch ? { search: keySearch } : {}
        ).toString(),
      });
    } else {
      setSearchParams(
        keySearch ? { ...params, search: keySearch } : { ...newParams },
        { replace: true }
      );
    }
  };

  const handleFocus = () => {
    !!listSearchLocal && setListSearchLocal(listSearchLocal);
    setClosePopup(true);
  };

  const closeKeySearch = (id: string) => {
    const newKeySearch = listSearchLocal.filter((item) => item.id !== id);
    setListSearchLocal(newKeySearch);
  };

  const handleSearchKey = (itemSearch: ItemSearch) => {
    const newKeySearch = listSearchLocal.filter(
      (item) => item.id !== itemSearch.id
    );

    onSetValueSearch(itemSearch.key);
    setListSearchLocal([itemSearch, ...newKeySearch]);
    setClosePopup(false);
    navigateHome(itemSearch.key);
  };

  const handleClosePopupSearch = () => {
    if (!valueSearch) {
      const params: ParamsQuery = Object.fromEntries([...searchParams]);

      const { search, ...newParams } = params;
      setSearchParams({ ...newParams }, { replace: true });
    }

    setClosePopup(false);
  };

  return (
    <SearchBarContainerS>
      <InputS
        placeholder="Search"
        size={size}
        value={valueSearch}
        maxLength={250}
        onChange={(e) => onSetValueSearch(e.target.value)}
        prefix={<IcBxSearch width={24} height={24} />}
        onKeyDown={handleEnterKey}
        onFocus={handleFocus}
        zIndex={zIndex}
        clearable
      />

      {!!listSearchLocal?.length && closePopup && (
        <>
          <PopupSearch zIndex={zIndex}>
            <ListSearch
              listSearch={listSearchLocal}
              onCloseKey={closeKeySearch}
              onClick={handleSearchKey}
            />
          </PopupSearch>
          <BackDrop onClick={handleClosePopupSearch} zIndex={zIndex - 1} />
        </>
      )}
    </SearchBarContainerS>
  );
};

interface ZIndex {
  zIndex: number;
}

const SearchBarContainerS = styled.div`
  position: relative;
  width: 100%;
`;
const InputS = styled(Input)<ZIndex>`
  position: relative;
  z-index: ${({ zIndex }) => zIndex};
`;

const PopupSearch = styled.div<ZIndex>`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 100%;
  overflow: hidden;
  overflow-y: scroll;

  width: 100%;
  height: 225px;
  margin-top: 4px;
  padding: 16px 0;
  background: ${Colors.background};

  box-shadow: 0px 0.6px 1.8px rgba(0, 0, 0, 0.11),
    0px 3.2px 7.2px rgba(0, 0, 0, 0.13);
  border: 1px solid ${Colors.strokeLevel3};
  border-radius: 16px;
  z-index: ${({ zIndex }) => zIndex};

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 575.98px) {
    padding: 8px 0;
    height: 155px;
  }
`;

export default ContainerSearch;
