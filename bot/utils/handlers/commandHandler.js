import { promisify } from "util";
import glob from "glob";
const pGlob = promisify(glob);

/**
 * Import and set bot commands.
 *
 * @param client
 * @return {Promise<void>}
 */
export default async (client) => {
  const featureFiles = (
    await pGlob(process.cwd() + "/features/*/*.command.js")
  ).map((filePath) => filePath);

  featureFiles.map(async (commandFile) => {
    const { default: command } = await import(commandFile);

    if (!command) {
      console.error(
        `[COMMAND_HANDLER] The command file at ${commandFile} is missing a required command declaration`
      );
      return;
    }

    if (!command.data.name) {
      console.error(
        `[COMMAND_HANDLER] The command at ${commandFile} is missing a required "name" property`
      );
      return;
    }

    await client.commands.set(command.data.name, command);

    console.log(`Loaded command : ${command.data.name}`);
  });
};
