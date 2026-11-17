import { State } from "./state.js";

export async function commandInfo(state: State, pokemonName: string) {

    if (!pokemonName) {
        console.log("Please provide a pokemon name");
        return;
    }

    const response = await state.pokeApi.fetchPokemon(pokemonName);

    console.log(`Name: ${response.name}`);
    console.log(`Base Experience: ${response.base_experience}`);
}