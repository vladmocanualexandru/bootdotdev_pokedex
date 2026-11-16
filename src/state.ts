import { createInterface, type Interface } from 'node:readline';
import { stdin, stdout } from 'node:process';
import { cleanInput } from './repl.js';
import { commandExit } from "./command_exit.js";
import { commandHelp } from "./command_help.js";
import { commandMap, commandMapPrevious } from './command_map.js';
import { PokeAPI } from './pokeapi.js';

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State) => Promise<void>;
};

export type State = {
    rl: Interface;
    commands: Record<string, CLICommand>;
    pokeApi: PokeAPI,
    nextLocationURL: string | null,
    prevLocationURL: string | null;
};

export function getCommands(): Record<string, CLICommand> {
  return {
    exit: {
      name: "exit",
      description: "Exit the Pokedex",
      callback: commandExit,
    },
    help: {
      name: "help",
      description: "Displays this help",
      callback: commandHelp,
      },
    map: {
      name: "map",
      description: "Displays next page of available locations (first call brings first page)",
      callback: commandMap,
      },
    mapb: {
      name: "mapb",
      description: "Displays previous page of available locations",
      callback: commandMapPrevious,
    },
    // can add more commands here
  };
}

export function initState(): State {

  const rl = createInterface({
    input: stdin,
    output: stdout,
    prompt: "Pokedex > "
  });

  const pokeApi = new PokeAPI(30000);

  const state = {
    rl: rl,
    commands: getCommands(),
    pokeApi: pokeApi,
    nextLocationURL: null,
    prevLocationURL: null
  };

  rl.on('line', async (line) => {
      const words = cleanInput(line);

      if (words.length > 0) {
          const command = words[0];

          const commands = getCommands();

          if (!commands.hasOwnProperty(command)) {
              console.log("Unknown command");
          } else {
              try {
                await commands[command].callback(state);
                console.log("\n");
              } catch (error) {
                  console.log(`Error while executing command ${command}: ${error}`);
              }
          }
      }

      rl.prompt();
  });

  rl.prompt();

  return {
    rl: rl,
    pokeApi: pokeApi,
    commands: getCommands(),
    nextLocationURL: null,
    prevLocationURL: null
  };
}
