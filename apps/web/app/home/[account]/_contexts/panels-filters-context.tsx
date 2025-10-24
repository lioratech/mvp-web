'use client';

import { createContext, useContext, useState, useCallback } from 'react';

interface PanelsFiltersContextValue {
  selectedDepartment: string | null;
  accountId: string;
  setSelectedDepartment: (department: string | null) => void;
  clearFilters: () => void;
}

const PanelsFiltersContext = createContext<
  PanelsFiltersContextValue | undefined
>(undefined);

interface PanelsFiltersProviderProps {
  accountId: string;
  children: React.ReactNode;
}

export function PanelsFiltersProvider({
  accountId,
  children,
}: PanelsFiltersProviderProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null,
  );

  const clearFilters = useCallback(() => {
    setSelectedDepartment(null);
  }, []);

  const value: PanelsFiltersContextValue = {
    selectedDepartment,
    accountId,
    setSelectedDepartment,
    clearFilters,
  };

  return (
    <PanelsFiltersContext.Provider value={value}>
      {children}
    </PanelsFiltersContext.Provider>
  );
}

export function usePanelsFilters() {
  const context = useContext(PanelsFiltersContext);

  if (!context) {
    throw new Error(
      'usePanelsFilters must be used within a PanelsFiltersProvider',
    );
  }

  return context;
}

