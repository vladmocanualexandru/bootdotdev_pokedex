import type { State } from "./state.js";

export async function commandMapPrevious(state: State) {
    await commandMap(state, false);
}

export async function commandMap(state: State, next: boolean = true) {

    if (next && !state.nextLocationURL && (state.prevLocationURL)) {
        console.log("You're on the last page\n");
        return;
    }

    if (!next && !state.prevLocationURL) {
        console.log("You're on the first page\n");
        return;
    }

    const response = await state.pokeApi.fetchLocations(next?state.nextLocationURL:state.prevLocationURL);

    state.nextLocationURL = response.next;
    state.prevLocationURL = response.previous;

    if (!state.prevLocationURL) {
        console.log("You're on the first page\n");
    }

    if (!state.nextLocationURL) {
        console.log("You're on the last page\n");
    }

    for (let location of response.results) {
        console.log(location.name);
    }
}
