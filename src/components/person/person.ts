import { createNewElement } from '../../utils/createNewElement';
import { createWrapper } from '../wrapper/wrapper';
import { createLink } from '../link/link';
import { lorem } from '../../utils/lorem';
import githubLogo from '../../assets/icons/logo-github.svg?raw';
import type { IPersonData } from '../../utils/types';
import './person.css';

export function createPerson(person: IPersonData): HTMLDivElement {
  const wrapperPerson = createWrapper('wrapper-person');
  const wrapperDescription = createWrapper('wrapper-person-text');
  const wrapperImg = createWrapper('wrapper-person-img');

  const personName = createNewElement('h2', ['heading', 'heading-secondary']);
  personName.textContent = person.name;

  const descriptionPerson = createNewElement('p', ['text', 'text-person']);
  descriptionPerson.textContent = lorem.slice(0, 335);

  const link = createLink(person.githubLink, person.githubName, 'link-person');
  link.insertAdjacentHTML('beforeend', githubLogo);

  wrapperDescription.append(personName, descriptionPerson, link);
  wrapperPerson.append(wrapperImg, wrapperDescription);

  return wrapperPerson;
}
