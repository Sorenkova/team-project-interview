import { createFooter } from './components/footer/footer';
import { createHeader } from './components/header/header';
import { createMain } from './components/main/main';
import './style.css';

const body = document.querySelector('.body');
const header = createHeader();
const main = createMain();
const footer = createFooter();

if (body instanceof HTMLBodyElement) {
  body.append(header, main, footer);
}
