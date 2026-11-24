import { createNewElement } from '../../utils/createNewElement';
import { lorem } from '../../utils/lorem';
import { createWrapper } from '../wrapper/wrapper';
import { createPerson } from '../person/person';
import { teammates } from '../person/personData';
import './main.css';

export function createMain(): HTMLElement {
  const main = createNewElement('main', 'main');

  const sectionProject = createNewElement('section', 'section', 'section-project');
  const heading = createNewElement('h1', ['heading', 'heading-primary']);
  heading.textContent = 'About Our Project';

  const description = createNewElement('p', 'text');
  description.textContent = lorem;

  const sectionAbout = createNewElement('section', 'section', 'section-about');
  const wrapper = createWrapper('wrapper-about');
  const personCards = teammates.map(createPerson);

  wrapper.append(...personCards);
  sectionProject.append(heading, description);
  sectionAbout.append(wrapper);
  main.append(sectionProject, sectionAbout);
  return main;
}
