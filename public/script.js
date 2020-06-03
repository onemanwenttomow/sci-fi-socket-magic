const imageContainer = document.querySelector('.image-container');
const pokemonContainer = document.querySelector('.desktop-image-container');
const socket = io();
let pokemonDispatched = false;

initHandlebars();


// check to see if swipe up happening... if so add class to make image move offscreen.

imageContainer.addEventListener('touchstart', e => {
    console.log("touch start!", e);
});

imageContainer.addEventListener('touchend', e => {
    console.log("touch end!", e);
});

imageContainer.addEventListener('touchmove', e => {
    if (pokemonDispatched) {
        return;
    }
    console.log("touch move!!!", e.changedTouches[0].pageY);
    e.target.classList.add('fly-away');
    socket.emit('pokemon to add', {id: e.target.id});
    pokemonDispatched = true;
});

const pokemonArray = [];
function fetchPokemon(){
    fetch("https://pokeapi.co/api/v2/pokemon?limit=10")
        .then(response => response.json())
        .then(allpokemon => getIndividualPokemon(allpokemon));
}

function getIndividualPokemon({results}) {
    for (let i = 0; i < results.length; i++) {
        fetch(`https://pokeapi.co/api/v2/pokemon/${results[i].name}`)
            .then(response => response.json())
            .then(individualPokemon => {
                // console.log('individualPokemon: ',individualPokemon);
                let pokeImage = document.createElement('img');
                pokeImage.srcset = individualPokemon.sprites.front_default;
                pokeImage.id = individualPokemon.id;
                imageContainer.append(pokeImage);
                pokemonArray.push(individualPokemon);
            });
    }
}

fetchPokemon();



socket.on('pokemon from server', ({id}) => {
    console.log('id from server: ',id);
    const pokemonObj = pokemonArray.filter(pokemon => pokemon.id == id)[0];
    console.log('pokemonObj: ',pokemonObj);
    const html = Handlebars.templates.cards(pokemonObj);
    pokemonContainer.innerHTML = html;
    document.querySelector('.card').classList.add('card-fly-in');
});


// touchmove handler
function process_touchmove(ev) {
    // Set call preventDefault()
    ev.preventDefault();
}


function initHandlebars() {
    Handlebars.templates = Handlebars.templates || {};

    var templates = document.querySelectorAll('script[type="text/x-handlebars-template"]');

    Array.prototype.slice.call(templates).forEach(function(script) {
        Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML);
    });

}