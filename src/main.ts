import './style.css';
import { renderCatalog } from './catalog/catalog.ts';
import { products } from './data/products.ts';

const app = document.querySelector<HTMLDivElement>('#app')!;
const catalog = document.createElement('section');
app.append(catalog);

renderCatalog(catalog, products, (productId) => {
  console.log('Add to cart:', productId);
});
