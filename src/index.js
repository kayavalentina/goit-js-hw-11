import './styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios, { isCancel, AxiosError } from 'axios';
import SlimSelect from 'slim-select'
import 'slim-select/dist/slimselect.css';

//Функція для виконання запитів до Pixabay API та оновлення галереї
async function fetchImages(query, page) {
  const apiKey = '39743312-4508a0e311c8ff0ec9a823a0a'; // Замініть це на свій ключ доступу Pixabay
  const perPage = 40; // Кількість зображень на сторінці (максимум 40)
  const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.hits.length === 0) {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    } else {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      renderImages(data.hits);
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    Notiflix.Notify.failure('An error occurred while fetching images. Please try again later.');
  }
}