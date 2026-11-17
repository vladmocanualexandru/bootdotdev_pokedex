import { PokeAPI } from "./pokeapi.js";
import type { State } from "./state.js";

export async function commandMapPrevious(state: State) {
    await commandMap(state, false);
}

export async function commandMapNext(state: State) {
    await commandMap(state, true);
}

export async function commandMap(state: State, next: boolean = true) {

    if (next && !state.nextLocationURL && (state.prevLocationURL)) {
        console.log("You're on the last page");
        return;
    }

    if (!next && !state.prevLocationURL) {
        console.log("You're on the first page");
        return;
    }

    const response = await state.pokeApi.fetchLocations(next?state.nextLocationURL:state.prevLocationURL);

    state.nextLocationURL = response.next;
    state.prevLocationURL = response.previous;

    for (let location of response.results) {
        console.log(location.name);
    }

    state.pageNumber += next ? 1 : -1;

    console.log(`\nPage ${state.pageNumber}/${Math.ceil((response.count ?? 0) / PokeAPI.PAGE_SIZE)}`);
    
}
