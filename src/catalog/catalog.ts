import type { Product } from '../types.ts';

type AddToCartHandler = (productId: string) => void;

export function renderCatalog(container: HTMLElement, products: Product[], onAddToCart: AddToCartHandler): void {
  container.replaceChildren();
  container.classList.add('catalog');

  if (products.length === 0) {
    const message = document.createElement('p');
    message.className = 'catalog__empty';
    message.textContent = 'Nothing found';
    container.append(message);
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'catalog__grid';

  for (const product of products) {
    grid.append(createCard(product, onAddToCart));
  }

  container.append(grid);
}

function createCard(product: Product, onAddToCart: AddToCartHandler): HTMLElement {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.dataset.productId = product.id;

  const info = document.createElement('div');

  const name = document.createElement('h3');
  name.className = 'product-card__name';
  name.textContent = product.name;

  const price = document.createElement('p');
  price.className = 'product-card__price';
  price.textContent = `${product.price} €`;

  info.append(name, price);
  card.append(info);

  if (product.imageUrl) {
    const image = document.createElement('img');
    image.className = 'product-card__image';
    image.src = product.imageUrl;
    image.alt = product.name;
    image.loading = 'lazy';
    card.append(image);
  }

  const button = document.createElement('button');
  button.className = 'product-card__button';
  button.type = 'button';
  button.textContent = 'Add to cart';
  button.addEventListener('click', () => onAddToCart(product.id));
  card.append(button);

  return card;
}
