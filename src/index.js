import './styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios, { isCancel, AxiosError } from 'axios';
import SlimSelect from 'slim-select'
import 'slim-select/dist/slimselect.css';

// Імпортуємо бібліотеку notiflix
import Notiflix from "notiflix";

// Функція для виконання запитів до Pixabay API та оновлення галереї
async function fetchImages(query, page) {
  const apiKey = 'YOUR_API_KEY'; // Замініть це на свій ключ доступу Pixabay
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

// Функція для відображення зображень у галереї
function renderImages(images) {
  const gallery = document.querySelector('.gallery');
  
  // Очищаємо галерею перед додаванням нових зображень
  gallery.innerHTML = '';

  images.forEach(image => {
    const photoCard = document.createElement('div');
    photoCard.classList.add('photo-card');

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.loading = 'lazy';

    const info = document.createElement('div');
    info.classList.add('info');

    const likes = createInfoItem('Likes', image.likes);
    const views = createInfoItem('Views', image.views);
    const comments = createInfoItem('Comments', image.comments);
    const downloads = createInfoItem('Downloads', image.downloads);

    info.appendChild(likes);
    info.appendChild(views);
    info.appendChild(comments);
    info.appendChild(downloads);

    photoCard.appendChild(img);
    photoCard.appendChild(info);

    gallery.appendChild(photoCard);
  });
}

// Функція для створення елементу інформації
function createInfoItem(label, value) {
  const infoItem = document.createElement('p');
  infoItem.classList.add('info-item');
  infoItem.innerHTML = `<b>${label}:</b> ${value}`;
  return infoItem;
}

// Обробник події для форми пошуку
document.querySelector('.search-form').addEventListener('submit', function (event) {
  event.preventDefault();
  const searchQuery = event.target.searchQuery.value.trim();
  if (searchQuery) {
    currentPage = 1; // Скидаємо поточну сторінку до першої при новому пошуку
    fetchImages(searchQuery, currentPage);
  }
});

// Обробник події для кнопки "Load more"
document.querySelector('.load-more').addEventListener('click', function () {
  const searchQuery = document.querySelector('.search-form input[name="searchQuery"]').value.trim();
  if (searchQuery) {
    currentPage++; // Збільшуємо поточну сторінку при завантаженні наступної групи зображень
    fetchImages(searchQuery, currentPage);
  }
});