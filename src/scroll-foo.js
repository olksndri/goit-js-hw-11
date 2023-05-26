export const scrollFoo = () => {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight / 6,
    behavior: 'smooth',
  });
};
