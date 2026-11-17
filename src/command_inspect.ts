import { State } from "./state.js";

export async function commandInspect(state: State, pokemonName: string) {

    if (!pokemonName) {
        console.log("Please provide a pokemon name");
        return;
    }

    if (! state.pokedex[pokemonName]) {
        console.log(`you have not caught that pokemon`);
        return;
    }

    const pokemonEntry = state.pokedex[pokemonName];

    console.log(`
Name: ${pokemonEntry.name}
Height: ${pokemonEntry.height}
Weight: ${pokemonEntry.weight}
Stats:
${pokemonEntry.stats.map(s => `- ${s.stat.name}: ${s.base_stat}`).join("\n")}
Types:
${pokemonEntry.types.map(t => `- ${t.type.name}`).join("\n")}
`);

}