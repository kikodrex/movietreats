const API_KEY = 'b4dcc4d7e05faa999e28002a02c3607a';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

let currentItem = null;

document.addEventListener("DOMContentLoaded", init);

async function init() {
  displaySkeletons('movies-list');
  displaySkeletons('tvshows-list');
  displaySkeletons('anime-list');
  displaySkeletons('livetv-list');

  const [movies, tv, anime, liveTV] = await Promise.all([
    fetchTrending('movie'),
    fetchTrending('tv'),
    fetchTrendingAnime(),
    fetchLiveTV()
  ]);

  displayList(movies, 'movies-list');
  displayList(tv, 'tvshows-list');
  displayList(anime, 'anime-list');
  displayLiveTV(liveTV);
}

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
    results = results.concat(
      data.results.filter(i => i.original_language === 'ja' && i.genre_ids.includes(16))
    );
  }
  return results;
}

async function fetchLiveTV() {
  return [
    { name: 'Channel One', streamUrl: 'https://example.com/stream1' },
    { name: 'Channel Two', streamUrl: 'https://example.com/stream2' }
  ];
}

function displaySkeletons(containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const s = document.createElement('div');
    s.className = 'skeleton';
    container.appendChild(s);
  }
}

function displayList(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  items.forEach(item => {
    const img = document.createElement('img');
    img.dataset.src = `${IMG_URL}${item.poster_path}`;
    img.alt = item.title || item.name;
    img.className = 'lazy';
    img.onclick = () => showPlayer(item);
    container.appendChild(img);
  });
  lazyLoadImages();
}

function displayLiveTV(channels) {
  const container = document.getElementById('livetv-list');
  container.innerHTML = '';
  channels.forEach(ch => {
    const el = document.createElement('div');
    el.textContent = ch.name;
    el.className = 'live-item';
    el.style.cursor = 'pointer';
    el.onclick = () => {
      document.getElementById('player-section').style.display = 'block';
      document.getElementById('modal-video').src = ch.streamUrl;
      document.getElementById('modal-image').src = '';
      document.getElementById('modal-title').textContent = ch.name;
      document.getElementById('modal-description').textContent = '';
      document.getElementById('modal-rating').innerHTML = '';
    };
    container.appendChild(el);
  });
}

function showPlayer(item) {
  currentItem = item;
  document.getElementById('player-section').style.display = 'block';
  document.getElementById('modal-image').src = `${IMG_URL}${item.poster_path}`;
  document.getElementById('modal-title').textContent = item.title || item.name;
  document.getElementById('modal-description').textContent = item.overview || '';
  document.getElementById('modal-rating').innerHTML = '★'.repeat(Math.round(item.vote_average / 2));
  changeServer();
}

function changeServer() {
  if (!currentItem) return;
  const server = document.getElementById('server').value;
  document.getElementById('modal-video').src = `https://vidsrc.cc/v2/embed/${currentItem.media_type || 'movie'}/${currentItem.id}`;
}

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
