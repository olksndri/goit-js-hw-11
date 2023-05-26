'use strict';

import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { renderEl } from './render-foo';
import { scrollFoo } from './scroll-foo';
import { getPhotos } from './getData-foo';

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

const addPhotos = async inSubmit => {
  const promiseResult = await getPhotos(inputValue, page);
  hits = promiseResult.hits;
  totalHits = promiseResult.totalHits;

  if (inSubmit && totalHits !== 0 && submitCounter > 1) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }
  if (hits.length !== 0) {
    hits.forEach(el => {
      photosCounter += renderEl(el);
    });
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
