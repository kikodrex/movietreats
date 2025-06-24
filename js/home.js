function changeServer() {
  const server = document.getElementById('server').value;
  const id = currentItem.id;
  const type = currentItem.media_type || 'movie';
  let src = '';

  if (server === 'vidsrc.cc') {
    src = `https://vidsrc.cc/v2/embed/${type}/${id}`;
  } else if (server === 'mapple') {
    if (type === 'movie') {
      src = `https://mappletv.uk/watch/movie/${id}`;
    } else {
      // Example: append season/episode dynamically
      src = `https://mappletv.uk/watch/tv/${id}-1-1`;
    }
  } else if (server === 'custom') {
    src = `https://yourcustomserver.com/player/${id}`;
  }

  document.getElementById('modal-video').src = src;
}

function toggleTheme() {
  document.body.classList.toggle('dark');
}

function addToWatchlist() {
  let watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
  if (!watchlist.find(item => item.id === currentItem.id)) {
    watchlist.push(currentItem);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    alert('Added to Watchlist');
  }
}
