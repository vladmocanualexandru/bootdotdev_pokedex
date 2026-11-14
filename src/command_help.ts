import type { State } from "./state.js";

export function commandHelp(state: State) {
    const commands = state.commands;
    const commandLines = [];
    for (let command in commands) {
        commandLines.push(`${command}: ${commands[command].description}`)
    }

    console.log(`Welcome to the Pokedex!
Usage:

${commandLines.join("\n")}`);
}
