import type { State } from "./state.js";

export async function commandHelp(state: State) {
    const commands = state.commands;
    const commandLines = [];

    for (let command in commands) {
        commandLines.push(`${commands[command].name}: ${commands[command].description}`)
    }

    console.log(`Usage:\n${commandLines.join("\n")}`);
}
