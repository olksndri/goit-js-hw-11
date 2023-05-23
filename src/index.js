'use strict';

import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const optionsHTTP = {
  baseUrl: 'https://pixabay.com/api/',
  key: '36627448-7990d21daa2cb7c713fa88e55',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
};

const input = document.querySelector('input[name="searchQuery"]');
const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let inputValue = '';
let photosCounter = '';
let page = 1;
let submitCounter = 0;
let totalHits = 0;
let hits = 0;

let galleryLightBox = new SimpleLightbox('.gallery a');
galleryLightBox.open();

const { baseUrl, key, image_type, orientation, safesearch } = optionsHTTP;

const scrollFoo = () => {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight / 6,
    behavior: 'smooth',
  });
};
const getPhotos = async (input, page) => {
  try {
    const response = await axios.get(
      `${baseUrl}?key=${key}&q=${input}&image_type=${image_type}&orientation=${orientation}&safesearch=${safesearch}&per_page=40&page=${page}`
    );
    const hits = response.data.hits;
    const totalHits = response.data.totalHits;
    return { hits, totalHits };
  } catch (error) {
    console.log('ERROR:', error.message);
  }
};
const addPhotos = async inSubmit => {
  const promiseResult = await getPhotos(inputValue, page);
  hits = promiseResult.hits;
  totalHits = promiseResult.totalHits;
  if (inSubmit && totalHits !== 0 && submitCounter > 1) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }
  if (hits.length !== 0) {
    hits.forEach(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        photosCounter += `<a href="${largeImageURL}"><div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div></a>`;
      }
    );
    gallery.insertAdjacentHTML('beforeend', photosCounter);
    if (inSubmit === true) loadMoreBtn.classList.remove('hidden');
  } else {
    loadMoreBtn.classList.add('hidden');
    if (inSubmit === true) {
      gallery.innerHTML = '';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  }
  galleryLightBox.refresh();
  scrollFoo();
};

input.addEventListener('input', () => {
  inputValue = input.value.trim();
});
form.addEventListener('submit', event => {
  event.preventDefault();
  submitCounter += 1;
  gallery.innerHTML = '';
  photosCounter = '';
  page = 1;
  if (inputValue !== '') {
    if (submitCounter > 1) loadMoreBtn.classList.add('hidden');
    addPhotos(true);
  } else {
    loadMoreBtn.classList.add('hidden');
    Notiflix.Notify.info('Write what to look for');
  }
});
loadMoreBtn.addEventListener('click', () => {
  photosCounter = '';
  page += 1;
  addPhotos(false);
});
