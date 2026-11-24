import { createNewElement } from '../../utils/createNewElement';
import { createWrapper } from '../wrapper/wrapper';
import { createButton } from '../button/button';
import type { ProductLite } from '../../types';
import crossIcon from '../../assets/icons/cross.svg?raw';
import plusIcon from '../../assets/icons/plus.svg?raw';
import minusIcon from '../../assets/icons/minus.svg?raw';

export function createProduct(product: ProductLite): HTMLElement {
  const wrapperProduct = createWrapper('wrapper-items');
  wrapperProduct.dataset.productId = product.id;

  const wrapperInfo = createWrapper('wrapper-info');
  const wrapperImg = createWrapper('wrapper-img');
  const productImage = document.createElement('img');
  productImage.classList.add('product-img');
  productImage.src = `${product.imageUrl}`;
  wrapperImg.append(productImage);

  const wrapperDescription = createWrapper('wrapper-description');
  const productName = createNewElement('p', ['text', 'text-cart']);
  productName.textContent = product.name;
  const productCategory = createNewElement('p', ['text', 'text-cart']);
  productCategory.textContent = `Category: ${product.category}`;
  const wrapperButtons = createWrapper('wrapper-buttons');
  const buttonMinus = createButton('button', 'btn-icon');
  buttonMinus.innerHTML = minusIcon;
  const buttonPlus = createButton('button', 'btn-icon');
  buttonPlus.innerHTML = plusIcon;
  const quantity = createNewElement('p', ['text', 'text-cart']);
  quantity.textContent = '1';

  wrapperButtons.append(buttonMinus, quantity, buttonPlus);
  wrapperDescription.append(productName, productCategory, wrapperButtons);
  wrapperInfo.append(wrapperImg, wrapperDescription);

  const wrapperPrice = createWrapper('wrapper-price');
  const productPrice = createNewElement('p', ['text', 'text-cart']);
  productPrice.textContent = `${product.price} €`;
  const buttonRemove = createButton('button', 'btn-icon');
  buttonRemove.innerHTML = crossIcon;
  wrapperPrice.append(productPrice, buttonRemove);

  wrapperProduct.append(wrapperInfo, wrapperPrice);
  return wrapperProduct;
}
