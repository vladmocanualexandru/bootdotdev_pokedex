import { State } from "./state.js";

const MIN_BASE_EXPERIENCE = 36;
const MAX_BASE_EXPERIENCE = 635;

export async function commandCatch(state: State, pokemonName: string) {

    if (!pokemonName) {
        console.log("Please provide a pokemon name");
        return;
    }

    if (state.pokedex[pokemonName]) {
        console.log(`${pokemonName} is already in your Pokedex`);
        return;
    }

    const response = await state.pokeApi.fetchPokemon(pokemonName);

    console.log(`Throwing a Pokeball at ${response.name}...`);

    let escaped = false;
    for (let i = 0; i < 3; i++) {
        console.log("");
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay for catching attempt

        escaped = (Math.random() * (MAX_BASE_EXPERIENCE - MIN_BASE_EXPERIENCE) + MIN_BASE_EXPERIENCE) <= response.base_experience;
        if (escaped) break;
    }

    if (!escaped) {
        console.log(`${response.name} was caught!`);
        state.pokedex[response.name] = response;
    } else {
        console.log(`${response.name} escaped!`);
    }
}