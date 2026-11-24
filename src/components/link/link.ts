import { createNewElement } from '../../utils/createNewElement';
import './link.css';

export function createLink(url: string, text?: string, className?: string): HTMLAnchorElement {
  const link = document.createElement('a');
  link.classList.add('link');
  link.href = `${url}`;

  if (text) {
    const wrapperText = createNewElement('span', 'span');
    wrapperText.textContent = text;
    link.append(wrapperText);
  }

  if (className) link.classList.add(className);

  return link;
}
