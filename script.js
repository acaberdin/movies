let API_KEY = '';
let API_URL = '';
let SEARCH_API_URL = '';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';

const api_key = document.getElementById('api_key');
const form = document.getElementById('form');
const search = document.getElementById('search');
const main = document.getElementById('main');

function setApiKey() {
  API_KEY = api_key.value;
  API_URL =
    'https://api.themoviedb.org/3/discover/movie?' + 'sort_by=popularity.desc&' + `api_key=${API_KEY}&` + 'page=1';
  SEARCH_API_URL = 'https://api.themoviedb.org/3/search/movie?' + `api_key=${API_KEY}&` + 'query="';
}
// Get initial movies
getMovies(API_URL);

async function getMovies(url) {
  if (!url || url === '') {
    showInstructions();
  } else {
    try {
      const res = await fetch(url);
      if (res.status === 200) {
        const data = await res.json();
        showMovies(data.results);
      } else {
        showInstructions();
      }
    } catch (err) {
      console.log(err.message);
      showInstructions();
    }
  }
}

function showInstructions() {
  main.innerHTML = '';
  const movieElement = document.createElement('div');
  movieElement.classList.add('movie');
  movieElement.innerHTML = `
  <div class="movie-info">
    <div>
      <i class="fas fa-exclamation-circle fa-3x"></i>
      <h3>Couldn't load movies</h3>
      <p>This page requires an API key for <a href="https://www.themoviedb.org/">The Movies Database</a>.</p>
      <p>Please make sure, that you have a valid <a href="https://www.themoviedb.org/settings/api">API key</a>, and place it in the header of this page.</p>
      </div>
    </div>
    `;
  main.appendChild(movieElement);
}

function showMovies(movies) {
  main.innerHTML = '';
  movies.forEach((movie) => {
    const { title, poster_path, vote_average, overview, release_date } = movie;
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');
    movieElement.innerHTML = `
          <img
          src="${IMG_PATH + poster_path}"
          alt="${title}"
          />
          <div class="movie-info">
            <div>
              <small>(${new Date(release_date).getFullYear()})</small>
              <h3>${title}</h3>
            </div>
            <span class="${getClassByRate(vote_average)}">${vote_average}</span>
          </div>
          <div class="overview">
            <h3>Overview</h3>
            ${overview}
          </div>`;

    main.appendChild(movieElement);
  });
}

function getClassByRate(rate) {
  if (rate >= 8) {
    return 'green';
  } else if (rate >= 5) {
    return 'orange';
  } else {
    return 'red';
  }
}

search.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    form.dispatchEvent(new Event('submit'));
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  setApiKey();

  const searchTerm = search.value;

  if (searchTerm && searchTerm !== '') {
    getMovies(SEARCH_API_URL + searchTerm + '"');
  } else {
    getMovies(API_URL);
  }
});