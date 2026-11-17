import { State } from "./state.js";

export async function commandExplore(state: State, location: string) {

    if (!location) {
        console.log("Please provide a location to explore");
        return;
    }

    const response = await state.pokeApi.fetchLocation(location);

    for (let pokemonEncounter of response.pokemon_encounters) {
        console.log(pokemonEncounter.pokemon.name);
    }

}