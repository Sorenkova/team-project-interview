import { describe, it, expect } from 'vitest';
import type { Product } from '../types.ts';
import {
  countByCategory,
  countByRoom,
  createDefaultFilters,
  filterProducts,
  getActiveFilters,
  getCategories,
  parsePrice,
  parseSortOrder,
  removeFilter,
  sortProducts,
  type CatalogFilters,
} from './filters.ts';

const lamps: Product[] = [
  { id: 'a', name: 'Salt', category: 'Table lamps', rooms: ['Bedroom', 'Living room'], price: 399 },
  { id: 'b', name: 'Sun', category: 'Pendant lamps', rooms: ['Living room'], price: 699 },
  { id: 'c', name: 'Globe Box', category: 'Ceiling lamps', rooms: ['Kitchen'], price: 475 },
];

const ids = (products: Product[]) => products.map((product) => product.id);

describe('filterProducts', () => {
  it('returns all products when no filters are set', () => {
    expect(ids(filterProducts(lamps, createDefaultFilters()))).toEqual(['a', 'b', 'c']);
  });

  it('searches by part of the name, ignoring case and spaces', () => {
    expect(ids(filterProducts(lamps, { ...createDefaultFilters(), search: ' SA ' }))).toEqual(['a']);
  });

  it('filters by category', () => {
    expect(ids(filterProducts(lamps, { ...createDefaultFilters(), category: 'Pendant lamps' }))).toEqual(['b']);
  });

  it('matches a product if any selected room fits', () => {
    expect(ids(filterProducts(lamps, { ...createDefaultFilters(), rooms: ['Living room'] }))).toEqual(['a', 'b']);
    expect(ids(filterProducts(lamps, { ...createDefaultFilters(), rooms: ['Kitchen', 'Bedroom'] }))).toEqual([
      'a',
      'c',
    ]);
  });

  it('includes the price borders', () => {
    const filters = { ...createDefaultFilters(), minPrice: 399, maxPrice: 475 };
    expect(ids(filterProducts(lamps, filters))).toEqual(['a', 'c']);
  });

  it('combines all filters', () => {
    const filters = {
      ...createDefaultFilters(),
      category: 'Table lamps',
      rooms: ['Living room' as const],
      minPrice: 300,
    };
    expect(ids(filterProducts(lamps, filters))).toEqual(['a']);
  });

  it('returns an empty list when nothing matches', () => {
    const filters = { ...createDefaultFilters(), category: 'Pendant lamps', maxPrice: 500 };
    expect(filterProducts(lamps, filters)).toEqual([]);
  });
});

describe('sortProducts', () => {
  it('sorts by price ascending and descending', () => {
    expect(ids(sortProducts(lamps, 'price-asc'))).toEqual(['a', 'c', 'b']);
    expect(ids(sortProducts(lamps, 'price-desc'))).toEqual(['b', 'c', 'a']);
  });

  it('keeps the original order by default and does not change the input', () => {
    expect(ids(sortProducts(lamps, 'default'))).toEqual(['a', 'b', 'c']);
    sortProducts(lamps, 'price-desc');
    expect(ids(lamps)).toEqual(['a', 'b', 'c']);
  });
});

describe('helpers', () => {
  it('getCategories returns unique categories', () => {
    expect(getCategories(lamps)).toEqual(['Table lamps', 'Pendant lamps', 'Ceiling lamps']);
  });

  it('parsePrice returns null for empty input', () => {
    expect(parsePrice('')).toBeNull();
    expect(parsePrice('  ')).toBeNull();
    expect(parsePrice('250')).toBe(250);
    expect(parsePrice('0')).toBe(0);
  });

  it('parseSortOrder falls back to default', () => {
    expect(parseSortOrder('price-asc')).toBe('price-asc');
    expect(parseSortOrder('something')).toBe('default');
  });
});

describe('getActiveFilters', () => {
  it('returns an empty list when nothing is set', () => {
    expect(getActiveFilters(createDefaultFilters())).toEqual([]);
  });

  it('returns one item per active filter', () => {
    const filters: CatalogFilters = {
      ...createDefaultFilters(),
      search: ' sa ',
      category: 'Table lamps',
      rooms: ['Kitchen', 'Bedroom'],
      minPrice: 300,
    };
    const active = getActiveFilters(filters);

    expect(active.map((item) => item.type)).toEqual(['search', 'category', 'room', 'room', 'price']);
    expect(active.at(-1)?.text).toBe('from 300 €');
  });

  it('formats the price range', () => {
    const both = getActiveFilters({ ...createDefaultFilters(), minPrice: 300, maxPrice: 700 });
    const onlyMax = getActiveFilters({ ...createDefaultFilters(), maxPrice: 700 });

    expect(both[0]?.text).toBe('300–700 €');
    expect(onlyMax[0]?.text).toBe('up to 700 €');
  });
});

describe('removeFilter', () => {
  const filters: CatalogFilters = {
    ...createDefaultFilters(),
    search: 'sa',
    rooms: ['Kitchen', 'Bedroom'],
    minPrice: 300,
    maxPrice: 700,
  };

  it('removes one room and keeps the others', () => {
    expect(removeFilter(filters, 'room', 'Kitchen').rooms).toEqual(['Bedroom']);
  });

  it('clears search and both prices', () => {
    expect(removeFilter(filters, 'search', '').search).toBe('');
    const withoutPrice = removeFilter(filters, 'price', '');
    expect(withoutPrice.minPrice).toBeNull();
    expect(withoutPrice.maxPrice).toBeNull();
  });

  it('returns the same filters for an unknown type', () => {
    expect(removeFilter(filters, 'unknown', '')).toBe(filters);
  });
});

describe('counts', () => {
  it('counts products by room', () => {
    expect(countByRoom(lamps, createDefaultFilters())).toEqual({ Bedroom: 1, 'Living room': 2, Kitchen: 1 });
  });

  it('counts rooms among the selected category and ignores the rooms filter itself', () => {
    const table = { ...createDefaultFilters(), category: 'Table lamps' };
    expect(countByRoom(lamps, table)).toEqual({ Bedroom: 1, 'Living room': 1 });

    const kitchen: CatalogFilters = { ...createDefaultFilters(), rooms: ['Kitchen'] };
    expect(countByRoom(lamps, kitchen)).toEqual({ Bedroom: 1, 'Living room': 2, Kitchen: 1 });
  });

  it('counts categories and ignores the category filter itself', () => {
    const pendant = { ...createDefaultFilters(), category: 'Pendant lamps' };
    expect(countByCategory(lamps, pendant)).toEqual({ 'Table lamps': 1, 'Pendant lamps': 1, 'Ceiling lamps': 1 });

    const living: CatalogFilters = { ...createDefaultFilters(), rooms: ['Living room'] };
    expect(countByCategory(lamps, living)).toEqual({ 'Table lamps': 1, 'Pendant lamps': 1 });
  });
});
