import { createCart } from './components/cart/cart.ts';
import { createFooter } from './components/footer/footer';
import { createHeader } from './components/header/header';
import { createMain } from './components/main/main';
import { createNewElement } from './utils/createNewElement';
import { renderCatalog } from './catalog/catalog.ts';
import { products } from './data/products.ts';
import { getPageName, type PageName } from './router.ts';
import './style.css';

function createPage(content: HTMLElement): HTMLElement {
  const main = createNewElement('main', 'main');
  main.append(content);
  return main;
}

function createCatalogPage(): HTMLElement {
  const catalog = document.createElement('section');
  renderCatalog(catalog, products, (productId) => {
    console.log('Add to cart:', productId);
  });
  return createPage(catalog);
}

const pages: Record<PageName, () => HTMLElement> = {
  about: createMain,
  catalog: createCatalogPage,
  cart: () => createPage(createCart()),
};

const body = document.querySelector('.body');
const header = createHeader();
const footer = createFooter();
let main = createNewElement('main', 'main');

function showPage(): void {
  const pageName = getPageName(location.hash);
  const newMain = pages[pageName]();
  main.replaceWith(newMain);
  main = newMain;

  header.querySelectorAll('.nav .link').forEach((link) => {
    link.classList.toggle('link-active', link.getAttribute('href') === `#${pageName}`);
  });
  window.scrollTo(0, 0);
}

if (body instanceof HTMLBodyElement) {
  body.append(header, main, footer);
  window.addEventListener('hashchange', showPage);
  showPage();
}
