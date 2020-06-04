const imageContainer = document.querySelector('.image-container');
const pokemonContainer = document.querySelector('.desktop-image-container');
const socket = io();
let touchY = 0;
const pokemonArray = [];
let currentPokemonDispatched = false;
let onMobile = isMobile();
initHandlebars();

imageContainer.addEventListener('touchstart', handleTouchStart);
imageContainer.addEventListener('touchend',handleTouchEnd);
imageContainer.addEventListener('touchmove',handleTouchMove);

function handleTouchStart(e) {
    touchY = e.changedTouches[0].pageY;
}

function handleTouchEnd() {
    touchY = 0;
    currentPokemonDispatched = false;
}

function handleTouchMove(e) {
    const distanceSwiped = touchY -  e.changedTouches[0].pageY;
    if (currentPokemonDispatched || distanceSwiped < 60) {
        return;
    }
    e.target.classList.add('fly-away');
    socket.emit('pokemon to add', {id: e.target.id});
    currentPokemonDispatched = true;
}

function fetchPokemon(){
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
        .then(response => response.json())
        .then(allpokemon => getIndividualPokemon(allpokemon));
}

function getIndividualPokemon({results}) {
    for (let i = 0; i < results.length; i++) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${results[i].name}`)
            .then(response => response.json())
            .then(individualPokemon => {
                addImage(individualPokemon);
                pokemonArray.push(individualPokemon);
            });
    }
}

function addImage(individualPokemon) {
    let pokeImage = document.createElement('img');
    pokeImage.src = individualPokemon.sprites.front_default;
    pokeImage.id = individualPokemon.id;
    imageContainer.append(pokeImage);
}

fetchPokemon();

socket.on('pokemon from server', ({id}) => {
    const pokemonObj = pokemonArray.filter(pokemon => pokemon.id == id)[0];
    const html = Handlebars.templates.cards(pokemonObj);
    let child = document.createElement('div');
    child.innerHTML = html;
    child.id = "pokemon" + id;
    pokemonContainer.append(child);
    setTimeout(()=> {
        child.children[0].style.top = 0;
    }, 100);
    window.scrollTo({
        'behavior': 'smooth',
        'top': document.body.clientHeight - window.innerHeight
    });
});


function isMobile() {
    var match = window.matchMedia || window.msMatchMedia;
    if (match) {
        var mq = match('(pointer:coarse)');      
        return mq.matches || window.innerWidth < 600;
    }
    return false;
}

function initHandlebars() {
    Handlebars.templates = Handlebars.templates || {};

    var templates = document.querySelectorAll('script[type="text/x-handlebars-template"]');

    Array.prototype.slice.call(templates).forEach(function(script) {
        Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML);
    });
}