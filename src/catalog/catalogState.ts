import { createDefaultFilters, type CatalogFilters, type SortOrder } from './filters.ts';

interface CatalogState {
  filters: CatalogFilters;
  sortOrder: SortOrder;
  filtersHidden: boolean;
}

export const catalogState: CatalogState = {
  filters: createDefaultFilters(),
  sortOrder: 'default',
  filtersHidden: false,
};
