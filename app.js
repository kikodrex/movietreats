const channels = [
  { name: 'News Channel', url: 'live/news.mp4' },
  { name: 'Sports Channel', url: 'live/sports.mp4' },
  { name: 'Music Channel', url: 'live/music.mp4' }
];

const videoPlayer = document.getElementById('custom-player');
const videoSource = document.getElementById('video-source');
const titleEl = document.getElementById('title');
const descEl = document.getElementById('description');
const ratingEl = document.getElementById('rating');

let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

function showHome() {
  document.getElementById('live-tv').style.display = 'none';
  document.getElementById('watchlist-section').style.display = 'none';
  document.getElementById('poster').style.display = '';
  videoPlayer.style.display = '';
  document.querySelector('.details').style.display = '';
}

function showLiveTV() {
  document.getElementById('live-tv').style.display = 'block';
  document.getElementById('watchlist-section').style.display = 'none';
  renderChannels();
}

function showWatchlist() {
  document.getElementById('live-tv').style.display = 'none';
  document.getElementById('watchlist-section').style.display = 'block';
  renderWatchlist();
}

function renderChannels() {
  const container = document.getElementById('channel-list');
  container.innerHTML = '';
  channels.forEach(ch => {
    const div = document.createElement('div');
    div.className = 'channel';
    div.textContent = ch.name;
    div.onclick = () => {
      playVideo(ch.url, ch.name, 'Live stream of ' + ch.name, 5);
    };
    container.appendChild(div);
  });
}

function playVideo(url, title, desc, rating) {
  videoSource.src = url;
  videoPlayer.load();
  titleEl.textContent = title;
  descEl.textContent = desc;
  ratingEl.innerHTML = '★'.repeat(rating);
}

function addToWatchlist() {
  const item = {
    title: titleEl.textContent,
    src: videoSource.src
  };
  if (!watchlist.find(w => w.src === item.src)) {
    watchlist.push(item);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    alert('Added to watchlist!');
  } else {
    alert('Already in watchlist!');
  }
}

function renderWatchlist() {
  const ul = document.getElementById('watchlist');
  ul.innerHTML = '';
  watchlist.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.title;
    li.onclick = () => {
      playVideo(item.src, item.title, 'From your watchlist', 4);
    };
    ul.appendChild(li);
  });
}

function updateVisitorCounter() {
  let visits = parseInt(localStorage.getItem('visits')) || 0;
  visits++;
  localStorage.setItem('visits', visits);
  document.getElementById('visitor-counter').textContent = `Visits: ${visits}`;
}

updateVisitorCounter();
playVideo('sample.mp4', 'Sample Movie', 'Enjoy our custom player without ads!', 4);
