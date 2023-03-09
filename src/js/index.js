import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchImages } from './fetchImages';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const notFoundError =
  'Sorry, there are no images matching your search query. Please try again.';
const noMoreImagesError =
  "We're sorry, but you've reached the end of search results.";
const totalImages = 'Hooray! We found totalHits images.';
const lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250 });
let pageIndex = 1;

const refs = {
  searchForm: document.querySelector('.search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

refs.searchForm.addEventListener('submit', loadImages);
refs.loadMoreBtn.addEventListener('click', loadMoreImages);

const clearGallery = () => {
  refs.gallery.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');
};

async function loadImages(e) {
  e.preventDefault();
  clearGallery();
  const {
    elements: { searchQuery },
  } = e.target;
  const term = searchQuery.value.trim();

  pageIndex = 1;

  if (term.length === 0) {
    Notify.failure(notFoundError);
    return;
  }

  try {
    const data = await fetchImages(term);
    if (data.hits.length === 0) {
      Notify.failure(notFoundError);
    } else {
      createGallery(data);
    }
  } catch (error) {
    console.log(error);
  }
}

async function loadMoreImages() {
  const {
    elements: { searchQuery },
  } = refs.searchForm;
  const term = searchQuery.value.trim();

  pageIndex += 1;

  try {
    const data = await fetchImages(term, pageIndex);
    if (data.hits.length === 0) {
      Notify.failure(noMoreImagesError);
      refs.loadMoreBtn.classList.add('is-hidden');
    } else {
      createGallery(data);
    }
  } catch (error) {
    console.log(error);
  }
}

const createGaleryImages = data => {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = data;
  return `
  <a class="photo-link" href="${largeImageURL}">
    <div class="photo-card">
      <img class="photo" src="${webformatURL}" alt="${tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes</b>${likes}
        </p>
        <p class="info-item">
          <b>Views</b>${views}
        </p>
        <p class="info-item">
          <b>Comments</b>${comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>${downloads}
        </p>
      </div>
    </div>
  </a>`;
};

function createGallery({ hits, totalHits }) {
  const galleryMarkup = hits.map(createGaleryImages).join('');
  refs.gallery.insertAdjacentHTML('beforeend', galleryMarkup);
  refs.loadMoreBtn.classList.remove('is-hidden');
  lightbox.refresh();
}
