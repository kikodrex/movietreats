const API_KEY = 'b4dcc4d7e05faa999e28002a02c3607a';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';

// Theme toggle
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light-mode');
}

// Fetch and display trending movies/TV
async function init() {
  const movies = await fetchData('movie');
  const tvshows = await fetchData('tv');
  displayList(movies, 'movies-list', 'movie');
  displayList(tvshows, 'tvshows-list', 'tv');
}

// Fetch data from TMDB
async function fetchData(type) {
  const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}

// Display poster list
function displayList(items, containerId, mediaType) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  items.forEach(item => {
    const img = document.createElement('img');
    img.src = `${IMG_URL}${item.poster_path}`;
    img.alt = item.title || item.name;
    img.onclick = () => addToWatchlist(item, mediaType);
    container.appendChild(img);
  });
}

// Show sections
function showHome() {
  document.getElementById('home-section').style.display = 'block';
  document.getElementById('live-tv-section').style.display = 'none';
  document.getElementById('watchlist-section').style.display = 'none';
}

function showWatchlist() {
  document.getElementById('home-section').style.display = 'none';
  document.getElementById('live-tv-section').style.display = 'none';
  document.getElementById('watchlist-section').style.display = 'block';
  loadWatchlist();
}

// Live TV
async function showLiveTv() {
  document.getElementById('home-section').style.display = 'none';
  document.getElementById('live-tv-section').style.display = 'block';
  document.getElementById('watchlist-section').style.display = 'none';

  const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`);
  const data = await res.json();

  const container = document.getElementById('live-tv-list');
  container.innerHTML = '';

  data.results.slice(0, 5).forEach(show => {
    const tmdb_id = show.id;
    const iframe = document.createElement('iframe');
    iframe.src = `https://mappletv.uk/watch/tv/${tmdb_id}-1-1`;
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';

    const title = document.createElement('h3');
    title.textContent = show.name;

    container.appendChild(title);
    container.appendChild(iframe);
  });
}

// Watchlist
function addToWatchlist(item, mediaType) {
  const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
  if (!watchlist.find(x => x.id === item.id)) {
    watchlist.push({ id: item.id, poster: item.poster_path, title: item.title || item.name, mediaType });
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    alert('Added to Watchlist!');
  } else {
    alert('Already in Watchlist');
  }
}

function loadWatchlist() {
  const list = JSON.parse(localStorage.getItem('watchlist') || '[]');
  const container = document.getElementById('watchlist-list');
  container.innerHTML = '';
  list.forEach(item => {
    const img = document.createElement('img');
    img.src = `${IMG_URL}${item.poster}`;
    img.alt = item.title;
    container.appendChild(img);
  });
}

init();
