import iconSearch from '../../assets/icons/search.svg?raw';
import { catalogState } from '../../catalog/catalogState.ts';
import { createDefaultFilters, filterProducts, getCategories, type CatalogFilters } from '../../catalog/filters.ts';
import { products } from '../../data/products.ts';
import { query } from '../../utils/query.ts';
import './search.css';

const MAX_PRODUCTS = 6;

export function createSearch(): { button: HTMLButtonElement; overlay: HTMLElement } {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'icon-button';
  button.setAttribute('aria-label', 'Search');
  button.setAttribute('aria-expanded', 'false');
  button.innerHTML = iconSearch;

  const overlay = document.createElement('div');
  overlay.className = 'search-overlay';
  overlay.hidden = true;

  const categoryLinks = getCategories(products)
    .map(
      (category) =>
        `<li><button class="search-link" type="button" data-category="${category}">${category}</button></li>`
    )
    .join('');

  overlay.innerHTML = `
    <div class="search-backdrop"></div>
    <div class="search-panel">
      <div class="search-inner">
        <label class="search-field">
          ${iconSearch}
          <input class="search-input" type="search" placeholder="Search lamps" aria-label="Search lamps" />
        </label>
        <div class="search-columns">
          <div>
            <h3 class="search-title">Quick access</h3>
            <ul class="search-links">
              <li><button class="search-link" type="button" data-category="">All lamps</button></li>
              ${categoryLinks}
            </ul>
          </div>
          <div>
            <h3 class="search-title">Products</h3>
            <ul class="search-products"></ul>
          </div>
        </div>
      </div>
    </div>
  `;

  const input = query<HTMLInputElement>(overlay, '.search-input');
  const productList = query(overlay, '.search-products');
  const popular = products.slice(0, MAX_PRODUCTS);

  function renderProducts(text: string): void {
    const found =
      text.trim() === ''
        ? popular
        : filterProducts(products, { ...createDefaultFilters(), search: text }).slice(0, MAX_PRODUCTS);

    productList.innerHTML =
      found.length === 0
        ? '<li class="search-empty">No products found</li>'
        : found
            .map(
              (product) =>
                `<li><button class="search-product" type="button" data-name="${product.name}"><span class="search-thumb"><img src="${product.imageUrl ?? ''}" alt="" /></span><span>${product.name}</span></button></li>`
            )
            .join('');
  }

  function close(): void {
    overlay.hidden = true;
    button.setAttribute('aria-expanded', 'false');
  }

  function open(): void {
    overlay.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    input.value = '';
    renderProducts('');
    input.focus();
  }

  function openCatalog(filters: Partial<CatalogFilters>): void {
    catalogState.filters = { ...createDefaultFilters(), ...filters };
    close();

    if (location.hash === '#catalog') {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } else {
      location.hash = '#catalog';
    }
  }

  button.addEventListener('click', () => {
    if (overlay.hidden) open();
    else close();
  });

  input.addEventListener('input', () => renderProducts(input.value));

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') openCatalog({ search: input.value.trim() });
  });

  overlay.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    if (target.classList.contains('search-backdrop')) {
      close();
      return;
    }

    const link = target.closest<HTMLElement>('.search-link');
    if (link) {
      openCatalog({ category: link.dataset.category ?? '' });
      return;
    }

    const product = target.closest<HTMLElement>('.search-product');
    if (product) openCatalog({ search: product.dataset.name ?? '' });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
  window.addEventListener('hashchange', close);

  return { button, overlay };
}
