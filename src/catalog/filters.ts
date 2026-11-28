import type { Product, Room } from '../types.ts';

export type SortOrder = 'default' | 'price-asc' | 'price-desc';

export interface CatalogFilters {
  search: string;
  category: string;
  rooms: Room[];
  minPrice: number | null;
  maxPrice: number | null;
}

const sortOrders: SortOrder[] = ['default', 'price-asc', 'price-desc'];

export function createDefaultFilters(): CatalogFilters {
  return { search: '', category: '', rooms: [], minPrice: null, maxPrice: null };
}

export function filterProducts(products: Product[], filters: CatalogFilters): Product[] {
  const search = filters.search.trim().toLowerCase();

  return products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search);
    const matchesCategory = filters.category === '' || product.category === filters.category;
    const matchesRoom = filters.rooms.length === 0 || filters.rooms.some((room) => product.rooms.includes(room));
    const matchesMin = filters.minPrice === null || product.price >= filters.minPrice;
    const matchesMax = filters.maxPrice === null || product.price <= filters.maxPrice;

    return matchesSearch && matchesCategory && matchesRoom && matchesMin && matchesMax;
  });
}

export function sortProducts(products: Product[], order: SortOrder): Product[] {
  if (order === 'price-asc') return [...products].sort((a, b) => a.price - b.price);
  if (order === 'price-desc') return [...products].sort((a, b) => b.price - a.price);
  return [...products];
}

export function getCategories(products: Product[]): string[] {
  return [...new Set(products.map((product) => product.category))];
}

export function parsePrice(value: string): number | null {
  if (value.trim() === '') return null;
  const price = Number(value);
  return Number.isNaN(price) ? null : price;
}

export function parseSortOrder(value: string): SortOrder {
  return sortOrders.find((order) => order === value) ?? 'default';
}

export interface ActiveFilter {
  type: 'search' | 'category' | 'room' | 'price';
  label: string;
  value: string;
  text: string;
}

function formatPriceRange(min: number | null, max: number | null): string {
  if (min !== null && max !== null) return `${min}–${max} €`;
  if (min !== null) return `from ${min} €`;
  return `up to ${max} €`;
}

export function getActiveFilters(filters: CatalogFilters): ActiveFilter[] {
  const result: ActiveFilter[] = [];
  const search = filters.search.trim();

  if (search !== '') {
    result.push({ type: 'search', label: 'Search', value: search, text: search });
  }

  if (filters.category !== '') {
    result.push({ type: 'category', label: 'Product type', value: filters.category, text: filters.category });
  }

  for (const room of filters.rooms) {
    result.push({ type: 'room', label: 'Room', value: room, text: room });
  }

  if (filters.minPrice !== null || filters.maxPrice !== null) {
    const text = formatPriceRange(filters.minPrice, filters.maxPrice);
    result.push({ type: 'price', label: 'Price', value: '', text });
  }

  return result;
}

export function removeFilter(filters: CatalogFilters, type: string, value: string): CatalogFilters {
  switch (type) {
    case 'search':
      return { ...filters, search: '' };
    case 'category':
      return { ...filters, category: '' };
    case 'room':
      return { ...filters, rooms: filters.rooms.filter((room) => room !== value) };
    case 'price':
      return { ...filters, minPrice: null, maxPrice: null };
    default:
      return filters;
  }
}

function countBy(products: Product[], getKeys: (product: Product) => string[]): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const product of products) {
    for (const key of getKeys(product)) {
      counts[key] = (counts[key] ?? 0) + 1;
    }
  }

  return counts;
}

export function countByRoom(products: Product[], filters: CatalogFilters): Record<string, number> {
  return countBy(filterProducts(products, { ...filters, rooms: [] }), (product) => product.rooms);
}

export function countByCategory(products: Product[], filters: CatalogFilters): Record<string, number> {
  return countBy(filterProducts(products, { ...filters, category: '' }), (product) => [product.category]);
}
