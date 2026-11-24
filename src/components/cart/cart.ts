import { createNewElement } from '../../utils/createNewElement';
import { createWrapper } from '../wrapper/wrapper';
import { createForm } from '../form/form';
import { createProduct } from '../product/product';
import { products } from '../../data/products';
import './cart.css';

const mockData = [...products].slice(0, 2);

export function createCart(): HTMLElement {
  const section = createNewElement('section', 'section', 'section-cart');
  const cartWrapper = createWrapper('wrapper-cart');
  const cartDescriptionWrapper = createWrapper('wrapper-items');
  const cartDescription = createNewElement('p', ['text', 'text-cart']);
  cartDescription.textContent = `2 products in basket`;
  const cartItemsWrapper = createWrapper('wrapper-cart-items');
  const saleWrapper = createWrapper('wrapper-sale');
  const form = createForm();
  const subtotalWrapper = createWrapper('wrapper-subtotal');
  const subtotal = createNewElement('p', ['text', 'text-cart']);
  subtotal.textContent = 'Subtotal';
  const sum = createNewElement('p', ['text', 'text-cart']);
  sum.textContent = '0 €';

  if (cartItemsWrapper) {
    const cartCards = mockData.map(createProduct);
    cartItemsWrapper.append(...cartCards);
  }

  subtotalWrapper.append(subtotal, sum);
  saleWrapper.append(form, subtotalWrapper);
  cartDescriptionWrapper.append(cartDescription);
  cartWrapper.append(cartDescriptionWrapper, cartItemsWrapper, saleWrapper);
  section.append(cartWrapper);
  return section;
}
