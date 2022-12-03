import React, { createContext, ReactNode, useState } from 'react';

interface FilterSearchContext {
  isFilterHome: boolean;
  setIsFilterHome: React.Dispatch<React.SetStateAction<boolean>>;

  isFilterProfile: boolean;
  setIsFilterProfile: React.Dispatch<React.SetStateAction<boolean>>;
  isSearchProfile: boolean;
  setIsSearchProfile: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ParamsQuery {
  status?: string;
  updatedAt?: string;
  price?: string;
  isVisible?: string;
  search?: string;
}

export const FilterSearchContext = createContext<FilterSearchContext>(
  {} as FilterSearchContext
);

type Props = {
  children: ReactNode;
};

export function FilterSearchProvider({ children }: Props) {
  const [isFilterHome, setIsFilterHome] = useState<boolean>(false);
  const [isFilterProfile, setIsFilterProfile] = useState<boolean>(false);
  const [isSearchProfile, setIsSearchProfile] = useState<boolean>(false);

  return (
    <FilterSearchContext.Provider
      value={{
        isFilterHome,
        setIsFilterHome,

        isFilterProfile,
        setIsFilterProfile,
        isSearchProfile,
        setIsSearchProfile,
      }}
    >
      {children}
    </FilterSearchContext.Provider>
  );
}
