import { getRefs } from './getRefs';
const refs = getRefs();

export function showSpinner() {
  refs.body.classList.add('loading');
}

export function hideSpinner() {
  window.setTimeout(function () {
    refs.body.classList.remove('loading');
    refs.body.classList.add('loaded');
  }, 1500);
}