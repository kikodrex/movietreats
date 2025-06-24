const API_KEY = 'b4dcc4d7e05faa999e28002a02c3607a';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';

let currentItem;

async function fetchTrending(type) {
  const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}

async function fetchTrendingAnime() {
  let all = [];
  for (let page = 1; page <= 2; page++) {
    const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page}`);
    const data = await res.json();
    all = all.concat(data.results.filter(i => i.original_language === 'ja' && i.genre_ids.includes(16)));
  }
  return all;
}

function displayBanner(item) {
  const banner = document.getElementById('banner');
  banner.style.backgroundImage = `url(${IMG_URL}${item.backdrop_path})`;
  document.getElementById('banner-title').textContent = item.title || item.name;
}

function displayList(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  items.forEach(item => {
    if (!item.poster_path) return;
    const img = document.createElement('img');
    img.src = `${IMG_URL}${item.poster_path}`;
    img.alt = item.title || item.name;
    img.onclick = () => showDetails(item);
    container.appendChild(img);
  });
}

function showDetails(item) {
  currentItem = item;
  document.getElementById('modal').style.display = 'flex';
  document.getElementById('modal-image').src = `${IMG_URL}${item.poster_path}`;
  document.getElementById('modal-title').textContent = item.title || item.name;
  document.getElementById('modal-description').textContent = item.overview;
  document.getElementById('modal-rating').innerHTML = '★'.repeat(Math.round(item.vote_average / 2));
  changeServer();
}

function changeServer() {
  const server = document.getElementById('server').value;
  let url = '';
  if (server === 'vidsrc.cc') {
    url = `https://vidsrc.cc/v2/embed/${currentItem.media_type}/${currentItem.id}`;
  } else if (server === 'vidsrc.me') {
    url = `https://vidsrc.net/embed/${currentItem.media_type}/?tmdb=${currentItem.id}`;
  } else if (server === 'player.videasy.net') {
    url = `https://player.videasy.net/${currentItem.media_type}/${currentItem.id}`;
  }
  document.getElementById('modal-video').src = url;
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal-video').src = '';
}

function openSearchModal() {
  document.getElementById('search-modal').style.display = 'flex';
  document.getElementById('search-input').focus();
}

function closeSearchModal() {
  document.getElementById('search-modal').style.display = 'none';
  document.getElementById('search-results').innerHTML = '';
}

const searchTMDBDebounced = debounce(searchTMDB, 300);

async function searchTMDB() {
  const query = document.getElementById('search-input').value.trim();
  if (!query) return;
  const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}`);
  const data = await res.json();
  const results = document.getElementById('search-results');
  results.innerHTML = '';
  data.results.forEach(item => {
    if (!item.poster_path) return;
    const img = document.createElement('img');
    img.src = `${IMG_URL}${item.poster_path}`;
    img.alt = item.title || item.name;
    img.onclick = () => {
      closeSearchModal();
      showDetails(item);
    };
    results.appendChild(img);
  });
}

function addToWatchlist() {
  let list = JSON.parse(localStorage.getItem('watchlist')) || [];
  if (!list.find(i => i.id === currentItem.id)) {
    list.push(currentItem);
    localStorage.setItem('watchlist', JSON.stringify(list));
    renderWatchlist();
  }
}

function renderWatchlist() {
  const container = document.getElementById('watchlist');
  container.innerHTML = '';
  const list = JSON.parse(localStorage.getItem('watchlist')) || [];
  list.forEach(item => {
    const img = document.createElement('img');
    img.src = `${IMG_URL}${item.poster_path}`;
    img.alt = item.title || item.name;
    img.onclick = () => showDetails(item);
    container.appendChild(img);
  });
}

function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function toggleTheme() {
  document.body.classList.toggle('light-theme');
}

async function init() {
  const movies = await fetchTrending('movie');
  const tv = await fetchTrending('tv');
  const anime = await fetchTrendingAnime();
  displayBanner(movies[Math.floor(Math.random() * movies.length)]);
  displayList(movies, 'movies-list');
  displayList(tv, 'tvshows-list');
  displayList(anime, 'anime-list');
  renderWatchlist();
}

init();
