import { State } from "./state.js";

export async function commandPokedex(state: State) {  
    if (Object.keys(state.pokedex).length === 0) {
        console.log("Your Pokedex is empty");
    } else {
        let totalXp = 0;
        for (const pokemonName in state.pokedex) {
            console.log(`- ${pokemonName} (${state.pokedex[pokemonName].base_experience} XP)`);
            totalXp += state.pokedex[pokemonName].base_experience;
        }
        console.log(`\nTotal XP: ${totalXp}`);
    }
}