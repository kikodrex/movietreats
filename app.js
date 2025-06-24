const API_KEY = 'b4dcc4d7e05faa999e28002a02c3607a';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';
let currentItem = {
  id: 299534,
  media_type: 'movie',
  title: 'Avengers: Endgame',
  overview: 'After the devastating events of Avengers: Infinity War...',
  vote_average: 8.4,
  poster_path: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg'
};

function initDisplay() {
  document.getElementById('modal-image').src = `${IMG_URL}${currentItem.poster_path}`;
  document.getElementById('modal-title').textContent = currentItem.title;
  document.getElementById('modal-description').textContent = currentItem.overview;
  document.getElementById('modal-rating').innerHTML = '★'.repeat(Math.round(currentItem.vote_average / 2));
  changeServer();
}

function changeServer() {
  const server = document.getElementById('server').value;
  const type = currentItem.media_type;
  let url = '';
  if (server === 'vidsrc.cc') {
    url = `https://vidsrc.cc/v2/embed/${type}/${currentItem.id}`;
  } else if (server === 'vidsrc.me') {
    url = `https://vidsrc.net/embed/${type}/?tmdb=${currentItem.id}`;
  } else if (server === 'player.videasy.net') {
    url = `https://player.videasy.net/${type}/${currentItem.id}`;
  } else if (server === 'mappletv') {
    url = `https://mapple.tv/embed/${type}/${currentItem.id}`;
  }
  document.getElementById('modal-video').src = url;
}

function toggleTheme() {
  document.body.classList.toggle('light-theme');
}

initDisplay();
