import { ROOMS, type Product } from '../types.ts';
import { query } from '../utils/query.ts';
import { renderCatalog } from './catalog.ts';
import { catalogState } from './catalogState.ts';
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
  type ActiveFilter,
} from './filters.ts';

type AddToCartHandler = (productId: string) => void;

const DESCRIPTION =
  'Lamps for every room: soft light, simple shapes and careful details. Find the one that fits your space and your mood.';

function createOption(
  type: 'checkbox' | 'radio',
  name: string,
  value: string,
  count: number,
  checked: boolean
): string {
  return `<label><input type="${type}" name="${name}" value="${value}" ${checked ? 'checked' : ''} /> ${value} (${count})</label>`;
}

export function createCatalogView(products: Product[], onAddToCart: AddToCartHandler): HTMLElement {
  const view = document.createElement('section');
  view.className = 'catalog-page';
  view.innerHTML = `
    <div class="catalog-intro">
      <h1 class="heading heading-primary">All Lamps</h1>
      <p class="catalog-intro__text">${DESCRIPTION}</p>
    </div>
    <div class="catalog-toolbar">
      <button class="catalog-toggle" type="button"></button>
      <div class="catalog-toolbar__right">
        <span class="catalog-count"></span>
        <select class="catalog-sort" aria-label="Sort products">
          <option value="default">Default order</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>
    </div>
    <div class="catalog-layout">
      <aside class="catalog-filters">
        <div class="filter-active"></div>
        <div class="filter-group">
          <h3 class="filter-title">Room</h3>
          <div class="filter-options filter-rooms"></div>
        </div>
        <div class="filter-group">
          <h3 class="filter-title">Product type</h3>
          <div class="filter-options filter-categories"></div>
        </div>
        <div class="filter-group">
          <h3 class="filter-title">Price, €</h3>
          <div class="filter-price">
            <input class="catalog-min" type="number" min="0" placeholder="Min" aria-label="Min price" />
            <input class="catalog-max" type="number" min="0" placeholder="Max" aria-label="Max price" />
          </div>
        </div>
      </aside>
      <div class="catalog-list"></div>
    </div>
  `;

  const toggle = query<HTMLButtonElement>(view, '.catalog-toggle');
  const count = query(view, '.catalog-count');
  const sort = query<HTMLSelectElement>(view, '.catalog-sort');
  const layout = query(view, '.catalog-layout');
  const panel = query(view, '.catalog-filters');
  const active = query(view, '.filter-active');
  const rooms = query(view, '.filter-rooms');
  const categoryBox = query(view, '.filter-categories');
  const minPrice = query<HTMLInputElement>(view, '.catalog-min');
  const maxPrice = query<HTMLInputElement>(view, '.catalog-max');
  const list = query(view, '.catalog-list');
  const categories = getCategories(products);

  function syncPriceInputs(): void {
    const { minPrice: min, maxPrice: max } = catalogState.filters;
    minPrice.value = min === null ? '' : String(min);
    maxPrice.value = max === null ? '' : String(max);
  }

  function renderActive(chips: ActiveFilter[]): void {
    active.replaceChildren();
    if (chips.length === 0) return;

    const header = document.createElement('div');
    header.className = 'filter-active__header';
    header.innerHTML =
      '<h3 class="filter-title">Active filters</h3><button class="filter-clear" type="button" data-action="clear">Clear all</button>';
    active.append(header);

    for (const chip of chips) {
      const item = document.createElement('div');
      item.className = 'filter-chip';

      const text = document.createElement('div');
      const label = document.createElement('span');
      label.className = 'filter-chip__label';
      label.textContent = chip.label;
      const value = document.createElement('span');
      value.className = 'filter-chip__value';
      value.textContent = chip.text;
      text.append(label, value);

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'filter-chip__remove';
      remove.setAttribute('aria-label', `Remove filter: ${chip.label} ${chip.text}`);
      remove.dataset.type = chip.type;
      remove.dataset.value = chip.value;
      remove.textContent = '×';

      item.append(text, remove);
      active.append(item);
    }
  }

  function render(): void {
    const { filters, sortOrder, filtersHidden } = catalogState;
    const chips = getActiveFilters(filters);
    const visible = sortProducts(filterProducts(products, filters), sortOrder);
    const roomCounts = countByRoom(products, filters);
    const categoryCounts = countByCategory(products, filters);

    toggle.textContent = `${filtersHidden ? 'Show' : 'Hide'} filter${chips.length > 0 ? ` (${chips.length})` : ''}`;
    toggle.classList.toggle('catalog-toggle--hidden', filtersHidden);
    layout.classList.toggle('catalog-layout--wide', filtersHidden);
    count.textContent = `${visible.length} ${visible.length === 1 ? 'product' : 'products'}`;

    renderActive(chips);

    rooms.innerHTML = ROOMS.filter((room) => roomCounts[room] > 0 || filters.rooms.includes(room))
      .map((room) => createOption('checkbox', 'room', room, roomCounts[room] ?? 0, filters.rooms.includes(room)))
      .join('');

    categoryBox.innerHTML = categories
      .filter((category) => categoryCounts[category] > 0 || filters.category === category)
      .map((category) =>
        createOption('radio', 'category', category, categoryCounts[category] ?? 0, filters.category === category)
      )
      .join('');

    renderCatalog(list, visible, onAddToCart);
  }

  panel.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;

    if (target.name === 'category') {
      catalogState.filters.category = target.value;
    } else if (target.name === 'room') {
      const checked = [...rooms.querySelectorAll<HTMLInputElement>('input:checked')].map((input) => input.value);
      catalogState.filters.rooms = ROOMS.filter((room) => checked.includes(room));
    }

    render();
  });

  panel.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.dataset.action === 'clear') {
      catalogState.filters = createDefaultFilters();
    } else if (target.classList.contains('filter-chip__remove')) {
      catalogState.filters = removeFilter(catalogState.filters, target.dataset.type ?? '', target.dataset.value ?? '');
    } else {
      return;
    }

    syncPriceInputs();
    render();
  });

  minPrice.addEventListener('input', () => {
    catalogState.filters.minPrice = parsePrice(minPrice.value);
    render();
  });

  maxPrice.addEventListener('input', () => {
    catalogState.filters.maxPrice = parsePrice(maxPrice.value);
    render();
  });

  toggle.addEventListener('click', () => {
    catalogState.filtersHidden = !catalogState.filtersHidden;
    render();
  });

  sort.addEventListener('change', () => {
    catalogState.sortOrder = parseSortOrder(sort.value);
    render();
  });

  sort.value = catalogState.sortOrder;
  syncPriceInputs();
  render();

  return view;
}
