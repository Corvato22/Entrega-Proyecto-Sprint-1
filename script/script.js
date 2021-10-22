const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1'
const IMG_PATH = `https://image.tmdb.org/t/p/w1280`
const SEARCH_URL = 'http://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="'

let templateCard = document.getElementById('template-card').content;
let fragment = document.createDocumentFragment();
let items = document.getElementById('items');

const getData = async () => {

    let url = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1%27';
    let response = await fetch(url);
    let data = await response.json();
    let { results } = data;
    return results;
}

const showData = async () => {

    let movies = await getData();
    movies.forEach(movie => {
        templateCard.querySelector('.image-cards').setAttribute("src", IMG_PATH + movie.poster_path);
        templateCard.querySelector('.status').textContent = movie.vote_average;
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    });

    items.appendChild(fragment);
}

document.addEventListener('DOMContentLoaded', showData)

let btn = document.getElementById('btnBuscar');

btn.addEventListener('click', async () => {
    let text = document.getElementById('inputBuscar').value;

    let dataBase = await getData();
    let searching = dataBase.filter(movie => movie.original_title.toLowerCase() === text.toLowerCase())
    searching.forEach(movie => {
        templateCard.querySelector('.image-cards').setAttribute("src", IMG_PATH + movie.poster_path);
        templateCard.querySelector('.status').textContent = movie.vote_average;

        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    })
    items.innerHTML = "";
    items.appendChild(fragment);
});