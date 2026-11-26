import { describe, it, expect } from 'vitest';
import { getPageName } from './router.ts';

describe('getPageName', () => {
  it.each([
    ['#about', 'about'],
    ['#catalog', 'catalog'],
    ['#cart', 'cart'],
  ])('returns the page for %s', (hash, expected) => {
    expect(getPageName(hash)).toBe(expected);
  });

  it('opens About for an empty hash', () => {
    expect(getPageName('')).toBe('about');
    expect(getPageName('#')).toBe('about');
  });

  it('opens About for an unknown hash', () => {
    expect(getPageName('#something')).toBe('about');
  });
});
