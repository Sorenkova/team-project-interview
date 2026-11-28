import { createWrapper } from '../wrapper/wrapper';
import { createList } from '../list/list';
import { createLink } from '../link/link';
import { createSearch } from '../search/search';
import logoIcon from '../../assets/icons/logo.svg?raw';
import iconMap from '../../assets/icons/map.svg?raw';
import iconAccount from '../../assets/icons/account.svg?raw';
import iconCart from '../../assets/icons/cart.svg?raw';
import { createNewElement } from '../../utils/createNewElement';
import { navigationItems } from './headerData';
import './header.css';

export function createHeader(): HTMLElement {
  const header = createNewElement('header', 'header');
  const headerWrapper = createWrapper('wrapper-header');
  const navigation = createNewElement('nav', 'nav');
  const list = createList(navigationItems);
  const { button: searchButton, overlay: searchOverlay } = createSearch();

  const logoWrapper = createWrapper('wrapper-logo');
  logoWrapper.innerHTML = logoIcon;

  const iconsList = createWrapper('wrapper-icons');
  iconsList.innerHTML = iconMap;
  iconsList.append(searchButton);
  iconsList.insertAdjacentHTML('beforeend', iconAccount);

  const cartLink = createLink('#cart');
  cartLink.innerHTML = iconCart;

  iconsList.append(cartLink);
  navigation.append(list);
  headerWrapper.append(navigation, logoWrapper, iconsList);
  header.append(headerWrapper, searchOverlay);
  return header;
}
