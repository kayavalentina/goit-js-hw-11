export function getRefs() {
  return {
    form: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    sentinel: document.querySelector('#sentinel'),
    spinner: document.querySelector('.spinner'),
    body: document.querySelector('body'),
  };
}