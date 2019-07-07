/* eslint-disable id-length */
const btnSearch = document.getElementById('btn-search');
const inputQuery = document.getElementById('input-query');

const inputQueryNav = document.getElementById('input-query-nav');
const btnSearchNav = document.getElementById('btn-search-nav');

const resultSearch = document.getElementById('result-search');

const detailMovie = document.getElementById('detail-movie');

const btnRating = document.getElementById('btn-rating');

const apiKey = 'apikey=f4578cd7';
let dataSearched;

// Busqueda de la pagina inicial del app

btnSearch.addEventListener('click', (e) => {
  e.preventDefault();
  let query = inputQuery.value;
  if (query !== '') {
    e.preventDefault();
    document.getElementById('navbar-handbook').classList.remove('d-none');
    document.getElementById('main-form').classList.add('d-none');
    document.getElementById('content-movies').classList.remove('d-none');
    const url = `https://www.omdbapi.com/?&${apiKey}&s=${query}`;
    fetchDataSearchTotal(url);
  } else {
    alert('Escribe algo');
  }
  document.getElementById('main-form').reset();
});

// Busqueda en el query del nav 
btnSearchNav.addEventListener('click', (e) => {
  document.getElementById('content-movies').classList.remove('d-none');
  document.getElementById('detail-movie').classList.add('d-none');
  e.preventDefault();
  if (inputQuery.value !== '') {
    let query = inputQueryNav.value;
    const url = `https://www.omdbapi.com/?&${apiKey}&s=${query}`;
    fetchDataSearchTotal(url);
  }
  document.getElementById('nav-form').reset();
});

// Funciones  obtener la data peliculas y pintado 
const fetchDataSearchTotal = (url) => {
  const page = 3;
  let dataPages = [];
  for (let i = 1; i <= page; i++) {
    dataPages.push(fetch(`${url}&page=${[i]}`)
      .then(response => response.json())
      .then(data => data.Search)
    );
  }
  Promise.all(dataPages)
    .then(responses => responses[0].concat(responses[1], responses[2]))
    .then(result => movie.getId(result))
    .then(movie => {
      let newData = [];
      let movieId;
      movieId = movie;
      for (let i = 0; i < movieId.length; i++) {
        newData.push(fetch(`https://www.omdbapi.com/?&${apiKey}&i=${movieId[i]}`).then(response => response.json()));
      }
      Promise.all(newData)
        .then(responses => {
          dataSearched = responses;
          resultSearch.innerHTML = '';
          resultSearch.appendChild(drawTemplate(dataSearched));
        });
    });
};

const drawTemplate = (data) => {
  const totalCard = document.createElement('div');
  totalCard.classList.add('row', 'p-3', 'm-0', 'd-flex', 'justify-content-center');

  for (let i = 0; i < data.length; i++) {
    let card = `        
        <div class="card border-dark col-12  col-sm-3 col-md-2 col-lg-2 my-3 mx-3 text-center">
            ${data[i].Poster === 'N/A'
    ? `<img class="card-img-top" src="./assets/poster.png" alt="${data[i].Title}">`
    :
    `<img class="card-img-top" src="${data[i].Poster}" alt="${data[i].Title}">`}
            
            <div class="card-body">
            <p class="card-title text-info">${data[i].Title}</p>
            <p class = "">${data[i].Year}</p>
            </div>
            <div class="card-footer  bg-dark">
            <small class="text-white"><span class="text-warning">&#9733 </span> ${data[i].imdbRating}</small>
            </div>
      </div>
    `;
    totalCard.innerHTML += card;
  }
  return totalCard;
};

// Funciones  para la descripcion de cada pelicula

resultSearch.addEventListener('click', (event) => {
  if (event.target.alt !== undefined) {
    const url = `https://www.omdbapi.com/?&${apiKey}&t=${event.target.alt}`;
    fetchDataDetails(url);
    document.getElementById('content-movies').classList.add('d-none');
    document.getElementById('detail-movie').classList.remove('d-none');
  }
});

const fetchDataDetails = (url) => {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const dataDetail = movie.getItemDetails(data);
      detailMovie.innerHTML = ' ';
      detailMovie.innerHTML = drawDetailsTemplate(dataDetail);
    });
};

const drawDetailsTemplate = (obj) => {
  let template = ` 
    <div class="container">
      <div class="row my-5">
        <div class="col-md-6  d-flex justify-content-center">
            <img class="" src="${obj.Poster}" alt="${obj.Title}">
        </div>
        <div class="col-md-6 p-5">
            <h5 class="text-center">${obj.Title}</h5>
            <p class="">Tipo: ${obj.Type}</p>
            <p class="">Rating: ${obj.imdbRating}</p>
            <p class="">Duración: ${obj.Runtime} min</p>
            <p class="">Género: ${obj.Genre}</p>
            <p class="">Actores: ${obj.Actors}</p>
            <p class="">Sinopsis: ${obj.Plot}</p>
        </div>
      </div> 
    </div>    
    `;
  return template;
};


// Raiting
btnRating.addEventListener('click', () => {
  const dataOrdered = movie.sortData(dataSearched);
  resultSearch.innerHTML = '';
  resultSearch.appendChild(drawTemplate(dataOrdered));
});


