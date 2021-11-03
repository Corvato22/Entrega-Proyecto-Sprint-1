//* Slider
const splide = new Splide('.splide', {
    type: 'loop',
    padding: '5rem',
    autoplay: true,
});

//* URL'S
const URL_ESTANDAR = 'https://api.themoviedb.org/3/discover/movie?&api_key=3fa24de710feb7c63980b6f2b06381f9&page='
const URL_MAS_VALORADAS = 'https://api.themoviedb.org/3/discover/movie?api_key=3fa24de710feb7c63980b6f2b06381f9&language=en-US&sort_by=vote_average.desc&include_adult=false&vote_count.gte=2500&vote_average.gte=7&page='
const URL_MENOS_VALORADAS = 'https://api.themoviedb.org/3/discover/movie?api_key=3fa24de710feb7c63980b6f2b06381f9&language=en-US&sort_by=vote_average.asc&include_adult=false&vote_count.gte=2500&vote_average.te=7&page='
const URL_SEARCH = 'https://api.themoviedb.org/3/search/movie?api_key=3fa24de710feb7c63980b6f2b06381f9&language=en-US&include_adult=false&query='
const URL_CRUD_PELICULAS = 'http://localhost:4001/peliculas/'
const IMG_PATH = `https://image.tmdb.org/t/p/w1280`
//! const API_KEY = '3fa24de710feb7c63980b6f2b06381f9'

//* Clasificaciones
const TODAS = document.getElementById('todas');
const MASVALORADAS = document.getElementById('mas-valoradas');
const MENOSVALORADAS = document.getElementById('menos-valoradas');
const VERDESPUES = document.getElementById('ver-despues');

//* Modal registro
const MODAL = document.getElementById("myModal");
const BTNUSER = document.getElementById("btnUser");
const BTNCORREOREGISTER = document.getElementById("btnCorreo");
const BTNEDITARREGISTER = document.getElementById("btnEditar");
const BTNELIMINARREGISTER = document.getElementById("btnEliminar");
const SPAN = document.getElementById("close-modal")

//* Cards de películas
let fragment = document.createDocumentFragment();
let items = document.getElementById('items');
let templateCard = document.getElementById('template-card').content;
const LOADERCONTAINER = document.getElementById('loaderContainer');

//* Modal peliculas
const MODALMOVIES = document.getElementById("modalMovies")
const MODALCONTAINERMOVIES = document.getElementById("modalContainerMovies")
let sliderVerAhora = document.getElementById('botonAhoraSlider')

//* No scroll ininito
let notscroll = false;

//* No loader
let notLoader = false;

//* Obtener datos
const getData = async () => {
    let response = await fetch(urlFilter());
    let data = await response.json();
    let { results } = data;
    return results;
}
//* Buscar datos
const getSearch = async (search) => {
    let response = await fetch(URL_SEARCH + search);
    let data = await response.json();
    let { results } = data;
    console.log(data.results)
    return results;
}

//* Mostrar datos
const showData = async () => {
    let movies = await getData();
    movies.forEach(movie => {
        asignarAtributos(movie);
    });
    items.appendChild(fragment);
}

//* Obtener datos CRUD
const GET_CRUD_PELICULAS = async () => {
    let response = await fetch(URL_CRUD_PELICULAS);
    let data = await response.json();
    return data;
}

document.addEventListener('DOMContentLoaded', () => {
    showData()
    cargarSlide()
    splide.mount();
})

//* Asigna atributos a cards de películas
function asignarAtributos(movie) {
    let imgNotFound = ('https://user-images.githubusercontent.com/89666937/139378550-18f90768-62aa-401c-ab3e-bfc2cb599cc8.png')
    if (movie.poster_path == null) {
        templateCard.querySelector('.image-cards').setAttribute("src", imgNotFound);
    } else {
        templateCard.querySelector('.image-cards').setAttribute("src", IMG_PATH + movie.poster_path);
    }

    templateCard.querySelector('.card').setAttribute("id", movie.id)
    templateCard.getElementById('container-vote-average').setAttribute("class", colorVoteAverage(movie));
    templateCard.querySelector('.vote-average').textContent = movie.vote_average.toFixed(1);
    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
}

//* Inserta atributos a cards de películas
function insertarAtributos() {
    items.innerHTML = "";
    items.appendChild(fragment);
}

//* Cambia color del borde de calificación de peliculas según su valor
function colorVoteAverage(movie) {
    if (movie.vote_average < 7) {
        return "vote-average-container-blue";
    } else {
        return "vote-average-container-yellow";
    }
}

//* Buscador
let btn = document.getElementById('btnBuscar');
btn.addEventListener('click', async (e) => {
    notscroll = true;
    notLoader = true;
    let text = document.getElementById('inputBuscar').value;
    let dataBase = await getSearch(text);
    let resultNotFound = ('https://user-images.githubusercontent.com/89666937/139575820-8939a25e-7a1e-430a-ba6d-abb6f6a49616.png')
    if (dataBase.length === 0) {
        items.innerHTML = "";
        document.querySelector('.head-line').textContent = ''
        items.innerHTML = `
                <div class="result-not-found-container">
                <img class="result-not-found-image" src="${resultNotFound}">
                <h3>No se encontraron resultados para "${text}"</h3>
                </div>
            `
    } else {
        e.preventDefault();
        document.querySelector('.head-line').textContent = 'Resultados de busqueda para ' + (text)
        console.log(dataBase);
        dataBase.forEach(movie => {
            asignarAtributos(movie)
        })
        insertarAtributos();
    }
});

//* Menu todas
TODAS.addEventListener('click', async () => {
    notscroll = false;
    MASVALORADAS.setAttribute("class", "");
    MENOSVALORADAS.setAttribute("class", "");
    TODAS.setAttribute("class", "active");
    VERDESPUES.setAttribute("class", "");
    let dataBase = await getData();
    dataBase.forEach(movie => {
        document.querySelector('.head-line').textContent = 'Todas las películas'
        asignarAtributos(movie);
    })
    insertarAtributos();
});

//* Menu más valoradas
MASVALORADAS.addEventListener('click', async () => {
    notscroll = false;
    MASVALORADAS.setAttribute("class", "active");
    MENOSVALORADAS.setAttribute("class", "");
    TODAS.setAttribute("class", "");
    VERDESPUES.setAttribute("class", "");
    let dataBase = await getData();
    dataBase.forEach(movie => {
        document.querySelector('.head-line').textContent = 'Más valoradas'
        asignarAtributos(movie);
    })
    insertarAtributos();
});

//* Menu menos valoradas
MENOSVALORADAS.addEventListener('click', async () => {
    notscroll = false;
    MASVALORADAS.setAttribute("class", "");
    MENOSVALORADAS.setAttribute("class", "active");
    TODAS.setAttribute("class", "");
    VERDESPUES.setAttribute("class", "");
    let dataBase = await getData();
    dataBase.forEach(movie => {
        document.querySelector('.head-line').textContent = 'Menos valoradas'
        asignarAtributos(movie);
    })
    insertarAtributos();
});
let dataBase = undefined;
//* Menu ver después
VERDESPUES.addEventListener('click', async () => {
    notscroll = true;
    notLoader = true;
    MASVALORADAS.setAttribute("class", "");
    MENOSVALORADAS.setAttribute("class", "");
    TODAS.setAttribute("class", "");
    VERDESPUES.setAttribute("class", "active");
    dataBase = await GET_CRUD_PELICULAS();
    console.log(dataBase)
    dataBase.forEach(movie => {
        document.querySelector('.head-line').textContent = 'Ver después'
        let imgNotFound = ('https://user-images.githubusercontent.com/89666937/139378550-18f90768-62aa-401c-ab3e-bfc2cb599cc8.png')
        if (movie.poster_path == null) {
            templateCard.querySelector('.image-cards').setAttribute("src", imgNotFound);
        } else {
            templateCard.querySelector('.image-cards').setAttribute("src", IMG_PATH + movie.poster_path);
        }

        templateCard.querySelector('.card').setAttribute("id", movie.idPelicula)
        templateCard.getElementById('container-vote-average').setAttribute("class", colorVoteAverage(movie));
        templateCard.querySelector('.vote-average').textContent = movie.vote_average.toFixed(1);
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    })
    insertarAtributos();
});


//* Slider
const cargarSlide = async () => {
    let dataBase = await getData();
    let ordenar = dataBase.sort((a, b) => 0.5 - Math.random());
    const arrayToCut = ordenar
    const n = 10
    const dataBaseCut = arrayToCut.slice(0, n)
    dataBaseCut.forEach(movie => {

        const divSlider = document.createElement('div');
        divSlider.classList.add('splide__slide')
        divSlider.innerHTML = `
            <div class="filter"></div>
            <h2 class="title-slider">${movie.title}</h2>
            <img src="${IMG_PATH + movie.backdrop_path}">
            <button id="botonAhoraSlider" class="boton-ahora">&#9654; VER AHORA</button>
            <button id="${movie.id}" class="boton-despues">&#43; VER DESPUÉS</button>
        `
        splide.add(divSlider)
    })
}

//* Loader 
let onLoader = () => {
    if (notLoader === true) {
        alert('funciona')
        LOADERCONTAINER.style.display = "none";
    } else {
        LOADERCONTAINER.style.display = "block";
    }
}

//* Scroll infinito
let pages = 2;
const onScroll = async (e) => {
    if (notscroll === true) {
        return
    } else {
        if (window.scrollY + window.innerHeight >= document.body.offsetHeight) {
            let url = urlFilter() + pages;
            console.log(url);
            let resp = await fetch(url)
            let data = await resp.json();
            let { results } = data;
            pages = data.page + 1
            results.forEach(movie => {
                asignarAtributos(movie)
            });
            items.appendChild(fragment);
            e.preventDefault();
        }
    }
}
window.addEventListener('scroll', onScroll,)

//* URL filter
function urlFilter() {
    if (MASVALORADAS.classList.contains('active')) {
        return URL_MAS_VALORADAS
    } else if (MENOSVALORADAS.classList.contains('active')) {
        return URL_MENOS_VALORADAS
    } else {
        return URL_ESTANDAR
    }
}

//* Modal registro
BTNUSER.onclick = (e) => {
    MODAL.style.display = "flex";
    e.preventDefault();
}
BTNCORREOREGISTER.onclick = (e) => {
    BTNEDITARREGISTER.style.display = "block";
    BTNELIMINARREGISTER.style.display = "block";
    e.preventDefault();
}
SPAN.onclick = function () {
    MODAL.style.display = "none";
    BTNEDITARREGISTER.style.display = "none";
    BTNELIMINARREGISTER.style.display = "none";
}
window.onclick = function (e) {
    if (e.target == MODAL) {
        MODAL.style.display = "none";
        BTNEDITARREGISTER.style.display = "none";
        BTNELIMINARREGISTER.style.display = "none";
    }
}

//* Modal peliculas

items.onclick = async function (e) {
    if (e.target.classList.contains('image-cards')) {
        e.preventDefault();
        console.log("Click")
        MODALMOVIES.style.display = "flex";

        let idMovieSeleccionada = e.target.parentNode.id;
        let urlMovieDetails = `https://api.themoviedb.org/3/movie/${idMovieSeleccionada}?api_key=3fa24de710feb7c63980b6f2b06381f9&append_to_response=videos`;
        let response = await fetch(urlMovieDetails);
        let details = await response.json();
        console.log(details)
        MODALCONTAINERMOVIES.innerHTML = `
            <div class="imagen-pelicula-modal">
                <img src="${IMG_PATH + details.poster_path}">
            </div>
            <div class="container-info-pelicula-modal">
                <span id="closeModalMovies" class="close-modal-movies">&times;</span>
                <h2 class="titulo-pelicula-modal">${details.title}</h2>
                <p class="descripcion-pelicula-modal">${details.overview}</p>
                <div class="datos-pelicula-modal">
                    <h4 class="año-pelicula-modal">${details.release_date}</h4>
                    <i class="fas fa-circle"></i>
                    <h4 class="genero-pelicula-modal">${details.genres[0].name}, ${details.genres[1].name}</h4>
                </div>
                <div class="modal-container-botones">
                    <button id="botonAhoraModal" class="boton-ahora-modal">&#9654; VER AHORA</button>
                    <button id="botonDespuesModal" class="boton-despues-modal">&#43; VER DESPUÉS</button>
                    <button id="botonEliminarModal" class="boton-eliminar-modal">&times ELIMINAR</button>
                </div>
                <div id="modalContainerTrailer" class="modal-container-trailer">
                    <iframe id="trailerWindow" src="https://www.youtube.com/embed/${(details.videos.results[0].key)}"
                        title="YouTube video player" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                </div>
            </div>
            `;

        let modalContainerTrailer = document.getElementById("modalContainerTrailer");
        let botonAhoraModal = document.getElementById("botonAhoraModal");
        let botonDespuesModal = document.getElementById("botonDespuesModal");
        let botonEliminarModal = document.getElementById("botonEliminarModal");
        let spanModalMovies = document.getElementById("closeModalMovies");
        let trailerWindow = document.getElementById("trailerWindow");

        if (VERDESPUES.classList.contains('active')) {
            botonDespuesModal.style.display = "none";
        }

        if (VERDESPUES.classList.contains('active')) {
            botonEliminarModal.style.display = "block";
        }

        botonAhoraModal.addEventListener('click', () => {
            modalContainerTrailer.style.display = "flex";
            e.preventDefault();
        })

        botonAhoraModal.onclick = function (e) {
            modalContainerTrailer.style.display = "flex";
            e.preventDefault();
        }
        spanModalMovies.onclick = function (e) {
            MODALMOVIES.style.display = "none";
            trailerWindow.setAttribute('src', '');
            e.preventDefault();
        }

        MODALMOVIES.onclick = function (e) {
            if (e.target == MODALMOVIES) {
                MODALMOVIES.style.display = "none";
                trailerWindow.setAttribute('src', '');
                e.preventDefault();
            }
        }

        botonDespuesModal.onclick = async function (e) {
            title = details.title
            poster_path = (IMG_PATH + details.poster_path)
            vote_average = details.vote_average
            idPelicula = details.id

            await fetch(URL_CRUD_PELICULAS, {
                method: 'POST',
                body: JSON.stringify({
                    title,
                    poster_path,
                    vote_average,
                    idPelicula
                }),
                headers: {
                    "Content-Type": "application/json; charset=UTF-8"
                }
            })
            e.preventDefault();
        }

        botonEliminarModal.onclick = async function (e) {
            let movieToDelete = dataBase.filter((element) => {
                return element.idPelicula == parseInt(idMovieSeleccionada)
            })
            console.log(movieToDelete, idMovieSeleccionada, dataBase)
            if (movieToDelete.length) {
                await fetch(URL_CRUD_PELICULAS + movieToDelete[0].id, {
                    method: 'DELETE',
                })
            }
            e.preventDefault();
        }
    }
};