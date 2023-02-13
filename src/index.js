import './css/styles.css';
import Notiflix, { Notify } from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.getElementById('search-box'),
  listEl: document.querySelector('.country-list'),
  infoEl: document.querySelector('.country-info'),
};

const array = [];

refs.inputEl.addEventListener(
  'input',
  debounce(searchContries, DEBOUNCE_DELAY)
);

function searchContries(e) {
  e.preventDefault();

  const inputText = e.target.value.trim();

  if (inputText === '') {
    Notiflix.Notify.info('Please choose your country.');
    clearMarkUp(refs.listEl);
    return;
  }

  fetchCountries(inputText)
    .then(responce => {

      const countryQuantity = responce.length;

      if (countryQuantity > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name'
        );

      } else if (countryQuantity > 2 && countryQuantity < 10) {
        clearMarkUp(refs.infoEl);
        refs.listEl.innerHTML = createCountryList(responce);

      } else if (countryQuantity === 1) {
        clearMarkUp(refs.listEl);
        refs.infoEl.innerHTML = createCountryInfo(responce[0]);
      }
    })
    .catch(err => {
      clearMarkUp(refs.infoEl);
      clearMarkUp(refs.listEl);
      
      if (err.message === '404') {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
    });
}

function clearMarkUp(element) {
  element.innerHTML = '';
}

function createCountryInfo(object) {
  return `<h1><img src='${object.flags.svg}'width="50px" height="30px"/>
  <span>${object.name}</span></h1>
  <ul class="list">
  <li><b>Capital:</b> ${object.capital}</li>
  <li><b>Population:</b> ${object.population}</li>
  <li><b>Languages:</b> ${object.languages
    .map(el => el.name)
    .join(', ')}</li></ul>`;
}

function createCountryList(array) {
  return array
    .map(
      el =>
        `<li><img src='${el.flags.svg}'width="50px" height="30px"/>
        <span>${el.name}</span></li>`
    )
    .join('');
}
