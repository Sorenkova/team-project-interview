// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { renderCatalog } from './catalog.ts';
import { products } from '../data/products.ts';

describe('renderCatalog', () => {
  it('renders a card for each product', () => {
    const container = document.createElement('div');
    renderCatalog(container, products, vi.fn());
    expect(container.querySelectorAll('.product-card')).toHaveLength(products.length);
  });

  it('shows a message when the list is empty', () => {
    const container = document.createElement('div');
    renderCatalog(container, [], vi.fn());
    expect(container.textContent).toContain('Nothing found');
  });

  it('calls onAddToCart with the product id', () => {
    const container = document.createElement('div');
    const onAddToCart = vi.fn();
    renderCatalog(container, products, onAddToCart);
    container.querySelector<HTMLButtonElement>('.product-card__button')!.click();
    expect(onAddToCart).toHaveBeenCalledWith(products[0].id);
  });
});
