export function createInput(id: string, placeholder: string): HTMLInputElement {
  const input = document.createElement('input');
  input.classList.add('input');
  input.id = id;
  input.placeholder = placeholder;
  return input;
}
