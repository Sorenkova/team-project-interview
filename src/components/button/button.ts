export function createButton(type: 'submit' | 'button', classList?: string, actionText?: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.classList.add('btn');
  button.type = type;
  if (classList) button.classList.add(`${classList}`);
  if (actionText) button.textContent = actionText;
  return button;
}
