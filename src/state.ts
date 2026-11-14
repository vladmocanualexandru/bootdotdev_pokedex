import { createInterface, type Interface } from 'node:readline';
import { stdin, stdout } from 'node:process';
import { cleanInput } from './repl.js';
import { commandExit } from "./command_exit.js";
import { commandHelp } from "./command_help.js";

export type CLICommand = {
  name: string;
  description: string;
  callback: (state: State) => void;
};

export type State = {
    rl: Interface;
    commands: Record<string, CLICommand>;
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
    // can add more commands here
  };
}

export function initState(): State {

  const rl = createInterface({
    input: stdin,
    output: stdout,
    prompt: "Pokedex > "
  });

  const state = {
    rl: rl,
    commands: getCommands()
  };

  rl.on('line', (line) => {
      const words = cleanInput(line);

      if (words.length > 0) {
          const command = words[0];

          const commands = getCommands();

          if (!commands.hasOwnProperty(command)) {
              console.log("Unknown command");
          } else {
              try {
                commands[command].callback(state);
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
    commands: getCommands()
  };
}
