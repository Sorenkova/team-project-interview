import { createInput } from '../input/input';
import { createButton } from '../button/button';
import { createNewElement } from '../../utils/createNewElement';

export function createForm(): HTMLFormElement {
  const form = document.createElement('form');
  form.classList.add('form', 'form-sale');
  const label = document.createElement('label');
  label.classList.add('label');
  const labelText = createNewElement('span', ['text', 'text-label']);
  labelText.textContent = 'Get 10% off your order with code SALE10';
  const input = createInput('promo', 'Discount code');
  const button = createButton('submit', 'btn-submit', 'Apply');

  label.append(labelText, input);
  form.append(label, button);
  return form;
}
