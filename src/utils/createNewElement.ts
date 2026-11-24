export function createNewElement(tag: string, className: string | string[], id?: string): HTMLElement {
  const item = document.createElement(tag);

  if (Array.isArray(className)) {
    item.classList.add(...className);
  } else {
    item.classList.add(`${className}`);
  }

  if (id) item.id = id;

  return item;
}
