const imageContainer = document.querySelector('.image-container');

// check to see if swipe up happening... if so add class to make image move offscreen.

imageContainer.addEventListener('touchstart', e => {
    console.log("touch start!", e);
});

imageContainer.addEventListener('touchend', e => {
    console.log("touch end!", e);
});

imageContainer.addEventListener('touchmove', e => {
    console.log("touch move!!!", e.changedTouches[0].pageY);
    console.log('e.target: ',e);
    e.target.classList.add('fly-away');
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
                let pokeImage = document.createElement('img');
                pokeImage.srcset = individualPokemon.sprites.front_default;
                imageContainer.append(pokeImage);
                pokemonArray.push(individualPokemon);
            });
    }
}

fetchPokemon();


// touchmove handler
function process_touchmove(ev) {
    // Set call preventDefault()
    ev.preventDefault();
}