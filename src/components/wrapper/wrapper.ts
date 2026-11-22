export function createWrapper(className?: string): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.classList.add('wrapper', `${className}`);
  return wrapper;
}
