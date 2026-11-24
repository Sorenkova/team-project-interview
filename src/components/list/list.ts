import { createLink } from '../link/link';
import { createNewElement } from '../../utils/createNewElement';
import type { INavigationItem } from '../../utils/types';

export function createList(items: INavigationItem[]): HTMLUListElement {
  const list = document.createElement('ul');
  list.classList.add('list');

  const listItems = items.map((item) => {
    const listItem = createNewElement('li', 'list-item');
    listItem.append(createLink(item.href, item.text, item.className));
    return listItem;
  });

  list.append(...listItems);
  return list;
}
