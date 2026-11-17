import { createInterface, type Interface } from 'node:readline';
import type { Pokemon } from './pokeapi.js'
import { stdin, stdout } from 'node:process';
import { cleanInput } from './repl.js';
import { commandExit } from "./command_exit.js";
import { commandHelp } from "./command_help.js";
import { commandMapNext, commandMapPrevious } from './command_map.js';
import { commandExplore } from './command_explore.js';
import { commandInfo } from './command_info.js';
import { commandCatch } from './command_catch.js';
import { PokeAPI } from './pokeapi.js';
import { commandPokedex } from './command_pokedex.js';

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State, ...args: string[]) => Promise<void>;
};

export type State = {
    rl: Interface;
    commands: Record<string, CLICommand>;
    pokeApi: PokeAPI,
    nextLocationURL: string | null,
    prevLocationURL: string | null,
    pageNumber: number,
    pokedex: Record<string, Pokemon>,
};

export function getCommands(): Record<string, CLICommand> {
  return {
    help: {
      name: "help",
      description: "Displays this help",
      callback: commandHelp,
      },
    map: {
      name: "map",
      description: "Displays next page of available locations (first call brings first page)",
      callback: commandMapNext,
      },
    mapb: {
      name: "mapb",
      description: "Displays previous page of available locations",
      callback: commandMapPrevious,
    },
    explore: {
      name: "explore <location>",
      description: "Displays available pokemons in the given location",
      callback: commandExplore,
    },
    info: {
      name: "info <pokemon>",
      description: "Displays information about the given pokemon",
      callback: commandInfo,
    },
    catch: {
      name: "catch <pokemon>",
      description: "Attempts to catch the given pokemon",
      callback: commandCatch,
    },
    pokedex: {
      name: "pokedex",
      description: "Displays your Pokedex",
      callback: commandPokedex,
    },
    exit: {
      name: "exit",
      description: "Exit the Pokedex",
      callback: commandExit,
    },
  };
}

export function initState(): State {

  const rl = createInterface({
    input: stdin,
    output: stdout,
    prompt: "Pokedex > "
  });

  const pokeApi = new PokeAPI(300000);

  const state = {
    rl: rl,
    commands: getCommands(),
    pokeApi: pokeApi,
    nextLocationURL: null,
    prevLocationURL: null,
    pageNumber: 0,
    pokedex: {},
  };

  rl.on('line', async (line) => {
      const words = cleanInput(line);

      if (words.length > 0) {
          const command = words[0];

          const commands = getCommands();

          console.log("");
          if (!commands.hasOwnProperty(command)) {
              console.log("Unknown command (type 'help' for commands)");
          } else {
              try {
                await commands[command].callback(state, ...words.slice(1));
              } catch (error) {
                console.log(`Error while executing command ${command}: ${error}`);
              }
            }

          console.log("");
          }

      rl.prompt();
  });

  rl.prompt();

  state.rl = rl;
  return state;
}
