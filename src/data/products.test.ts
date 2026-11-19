import { describe, it, expect } from 'vitest';
import { products } from './products.ts';

describe('products data', () => {
  it('has unique ids', () => {
    const ids = products.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has at least 2 categories', () => {
    const categories = new Set(products.map((p) => p.category));
    expect(categories.size).toBeGreaterThanOrEqual(2);
  });
});
