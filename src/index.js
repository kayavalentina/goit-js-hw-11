import './styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchImages } from './fetchImages';
import { renderGallery } from './renderGallery';
import { getRefs } from './getRefs';
import { showSpinner, hideSpinner } from './spinner';

showSpinner();
window.addEventListener('load', () => {
  console.log('All resources loaded!');

  hideSpinner();
});

const refs = getRefs();
refs.form.addEventListener('submit', onSearchForm);

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

let pageNumber = 1;
let currentQuery = '';
let totalHits = 0;
const per_page = 40;

async function onSearchForm(evt) {
  evt.preventDefault();
  pageNumber = 1;
  currentQuery = evt.target.searchQuery.value.trim();
  refs.sentinel.style.display = 'none';

  refs.gallery.innerHTML = '';
  showSpinner();
  if (!currentQuery) {
    return Notify.info('Please enter a search keyword!');
  }
  try {
    const response = await fetchImages(currentQuery, pageNumber, per_page);
    const images = response.data.hits;
    totalHits = response.data.totalHits;

    if (images.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else if (totalHits === 1) {
      renderGallery(images);
      lightbox.refresh();
      Notify.success(`Hooray! We found ${totalHits} images.`);
    } else {
      renderGallery(images);
      lightbox.refresh();
      Notify.success(`Hooray! We found ${totalHits} images.`);
      refs.sentinel.style.display = 'block';
    }
  } catch (error) {
    console.log(error);
    Notify.failure('Oops, something went wrong. Please try again later.');
  } finally {
    refs.form.reset();
    hideSpinner();
  }
}

async function onLoadMore() {
  pageNumber += 1;

  const totalPages = Math.ceil(totalHits / per_page);
  if (pageNumber > totalPages) {
    return Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
  try {
    showSpinner();
    const response = await fetchImages(currentQuery, pageNumber, per_page);
    const images = response.data.hits;
    renderGallery(images);
    lightbox.refresh();
    scrollToNextImages();
  } catch (error) {
    console.error(error);
  } finally {
    hideSpinner();
  }
}

function scrollToNextImages() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
     window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && currentQuery !== '') {
      onLoadMore();
    }
  });
};

const options = {
  rootMargin: '200px',
};
const observer = new IntersectionObserver(onEntry, options);

observer.observe(refs.sentinel);

const scrollTopBtn = document.querySelector('#scroll-to-top');

window.addEventListener('scroll', () => {
  if (document.documentElement.scrollTop > 200) {
    scrollTopBtn.style.display = 'block';
  } else {
    scrollTopBtn.style.display = 'none';
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scroll({
    top: 0,
    behavior: 'smooth',
  });
});
