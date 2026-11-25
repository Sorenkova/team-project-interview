import { createFooter } from './components/footer/footer';
import { createHeader } from './components/header/header';
// import { createMain } from './components/main/main';
// import { renderCatalog } from './catalog/catalog.ts';
// import { products } from './data/products.ts';
import { createCart } from './components/cart/cart.ts';
import './style.css';

const body = document.querySelector('.body');
const header = createHeader();
// const main = createMain();
const footer = createFooter();
const cart = createCart();

if (body instanceof HTMLBodyElement) {
  // body.append(header, main, footer);
  body.append(header, cart, footer);
}

// const app = document.querySelector<HTMLDivElement>('#app')!;
// const catalog = document.createElement('section');
// app.append(catalog);

// renderCatalog(catalog, products, (productId) => {
//   console.log('Add to cart:', productId);
// });
