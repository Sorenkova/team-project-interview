export type PageName = 'about' | 'catalog' | 'cart';

const pageNames: PageName[] = ['about', 'catalog', 'cart'];

export function getPageName(hash: string): PageName {
  const name = hash.replace('#', '');
  return pageNames.find((pageName) => pageName === name) ?? 'about';
}
