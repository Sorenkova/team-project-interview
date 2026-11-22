import { createNewElement } from '../../utils/createNewElement';
import rsLogo from '../../assets/icons/logo-rsschool.svg?raw';
import { createWrapper } from '../wrapper/wrapper';
import { createLink } from '../link/link';
import './footer.css';

export function createFooter(): HTMLElement {
  const footer = createNewElement('footer', 'footer');
  const wrapper = createWrapper('wrapper-footer');
  const footerLink = createLink('https://rs.school/');
  footerLink.innerHTML = rsLogo;

  wrapper.append(footerLink);
  footer.append(wrapper);
  return footer;
}
