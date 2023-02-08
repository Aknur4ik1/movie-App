"use strict";
// hello 
const API_KEY = "1e53a67a-54e3-4f16-b291-251fa2d90bc5";
const ApiUrlPopular =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";
const SEARCH_API =
  "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_MOVIE_INFO = "https://kinopoiskapiunofficial.tech/api/v2.2/films/"

getMovie(ApiUrlPopular);

async function getMovie(url) {
  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const respData = await resp.json();
  createMovie(respData);
}

function getClassByRate(number) {
  if (number >= 7) {
    return "green";
  } else if (number >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

function createMovie(data) {
  const moviesElement = document.querySelector(".movies");

  //  сброс предыдущих фильмов
  document.querySelector(".movies").innerHTML = "";
  
  data.films.forEach((movie) => {
    const filmElement = document.createElement("div");
    filmElement.classList.add("movie");
    filmElement.innerHTML = `<div class="movie__cover-inner">
        <img src="${movie.posterUrlPreview}"
        class ="movie__cover"
        alt ="${movie.nameRu}"
        />
        <div class="movie__cover--darkened"></div>
        </div>
        <div class="movie__info">
            <div class="movie__title">${movie.nameRu}</div>
            <div class="movie__category">${movie.genres.map(
              (category) => ` ${category.genre}`
            )}</div>
            <div class="movie__average movie__average--${getClassByRate(
              parseInt(movie.rating) < 10 ? movie.rating : 8.5
            )}">${(parseInt(movie.rating) < 10 ? movie.rating : 8.5)}</div>
        </div>`;
    filmElement.addEventListener("click",() => openModal(movie.filmId))
    moviesElement.appendChild(filmElement);
  });
}

const form = document.querySelector("form");
const search = document.querySelector(".header__search");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const apiSearchUrl = `${SEARCH_API}${search.value}`;
  if (search.value) {
    getMovie(apiSearchUrl);
    search.value = "";
  }
});

// Modal part
const modalEl = document.querySelector(".modal")

async function openModal(id) {

    const resp = await fetch(API_MOVIE_INFO + id, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
        },
      });

const respData = await resp.json();    
modalEl.classList.add("modal--show")
document.body.classList.add("stop-scrolling")

modalEl.innerHTML = `<div class="modal__card">
<img class="modal__movie-backdrop" src="${respData.posterUrl}" alt="">
<h2>
  <span class="modal__movie-title">Название-${respData.nameRu}</span>
  <span class="modal__movie-release-year>Год-${respData.year}</span>
</h2>
<ul class="modal__movie-info">
  <div class="loader"></div>
  <li class="modal__movie-genre">Жанр-${respData.genres.map((el)=> `<span>${el.genre}</span>`)}</li>
 ${respData.filmLength ?`<li class="modal__movie-runtime">Время-${respData.filmLength}минут</li>`:""}
  <li>Сайт:<a class="modal__movie-site" href="${respData.webUrl}">${respData.webUrl}</a></li>
  <li class="modal__movie-overview">Описание-${respData.description}</li>
</ul>
<button type="button" class="modal__button-close">Закрыть</button>
</div>`

 const buttonClose = document.querySelector(".modal__button-close")
 buttonClose.addEventListener("click", () =>closeModal())
}

function closeModal (){
    modalEl.classList.remove("modal--show")
    document.body.classList.remove("stop-scrolling")
}

window.addEventListener("click", (event) => {
    if(event.target === modalEl){
        closeModal()
    }
})



