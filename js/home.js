const API_KEY = 'b4dcc4d7e05faa999e28002a02c3607a';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

let currentItem = null;

/* Init on load */
document.addEventListener("DOMContentLoaded", init);

async function init() {
  displaySkeletons('movies-list');
  displaySkeletons('tvshows-list');
  displaySkeletons('anime-list');

  const [movies, tvshows, anime, liveTV] = await Promise.all([
    fetchTrending('movie'),
    fetchTrending('tv'),
    fetchTrendingAnime(),
    fetchLiveTV()
  ]);

  displayList(movies, 'movies-list');
  displayList(tvshows, 'tvshows-list');
  displayList(anime, 'anime-list');
  displayLiveTV(liveTV);
}

/* Fetch functions */
async function fetchTrending(type) {
  const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}

async function fetchTrendingAnime() {
  let results = [];
  for (let page = 1; page <= 2; page++) {
    const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page}`);
    const data = await res.json();
    const filtered = data.results.filter(item =>
      item.original_language === 'ja' && item.genre_ids.includes(16)
    );
    results = results.concat(filtered);
  }
  return results;
}

async function fetchLiveTV() {
  // Example: Replace with real API if you have one
  return [
    { name: 'Channel 1', streamUrl: 'https://example.com/channel1' },
    { name: 'Channel 2', streamUrl: 'https://example.com/channel2' }
  ];
}

/* Display functions */
function displayList(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  items.forEach(item => {
    const img = document.createElement('img');
    img.dataset.src = `${IMG_URL}${item.poster_path}`;
    img.alt = item.title || item.name;
    img.className = 'lazy';
    img.onclick = () => showDetails(item);
    container.appendChild(img);
  });
  lazyLoadImages();
}

function displaySkeletons(containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton';
    container.appendChild(skeleton);
  }
}

function displayLiveTV(channels) {
  const section = document.createElement('section');
  section.innerHTML = '<h2><i class="fa-solid fa-tower-broadcast"></i> Live TV</h2>';
  const list = document.createElement('div');
  list.className = 'list';
  channels.forEach(ch => {
    const el = document.createElement('div');
    el.className = 'live-item';
    el.innerHTML = `<div>${ch.name}</div>`;
    el.onclick = () => playLiveTV(ch.streamUrl);
    list.appendChild(el);
  });
  section.appendChild(list);
  document.body.appendChild(section);
}

function playLiveTV(url) {
  currentItem = { id: 'live', media_type: 'live' };
  document.getElementById('modal-video').src = url;
}

/* Modal & server switching */
function showDetails(item) {
  currentItem = item;
  document.getElementById('modal-title').textContent = item.title || item.name;
  document.getElementById('modal-description').textContent = item.overview || '';
  document.getElementById('modal-image').src = `${IMG_URL}${item.poster_path}`;
  document.getElementById('modal-rating').innerHTML = '★'.repeat(Math.round(item.vote_average / 2));
  changeServer();
}

function changeServer() {
  const server = document.getElementById('server').value;
  if (!currentItem) return;

  let src = '';
  if (server === 'vidsrc.cc') {
    src = `https://vidsrc.cc/v2/embed/${currentItem.media_type}/${currentItem.id}`;
  } else if (server === 'mapple') {
    if (currentItem.media_type === 'movie') {
      src = `https://mappletv.uk/watch/movie/${currentItem.id}`;
    } else {
      src = `https://mappletv.uk/watch/tv/${currentItem.id}-1-1`;
    }
  }
  document.getElementById('modal-video').src = src;
}

/* Lazy loading */
function lazyLoadImages() {
  const imgs = document.querySelectorAll('img.lazy');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        obs.unobserve(img);
      }
    });
  });
  imgs.forEach(img => observer.observe(img));
}
