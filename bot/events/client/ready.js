import { Events, REST, Routes } from "discord.js";
import { promisify } from "util";
import glob from "glob";
const pGlob = promisify(glob);

/**
 * Discord event, start bot and set guild slash command.
 */
export default {
  name: Events.ClientReady,
  eventName: "start bot",
  once: true,
  async execute(client) {
    const rest = new REST({ version: "10" }).setToken(
      process.env.DISCORD_TOKEN
    );

    const featureFiles = (
      await pGlob(process.cwd() + "/features/*/command.js")
    ).map((filePath) => filePath);

    const commands = await Promise.all(
      featureFiles.map(async (commandFile) => {
        const { default: command } = await import(commandFile);

        if (!command.data) {
          console.error(
            `[EVENT_READY] The feature command at ${commandFile} is missing a required "data" property`
          );
          return;
        }

        return command.data.toJSON();
      })
    );

    await (async () => {
      try {
        console.log(
          `Started refreshing ${commands.length} application (/) commands`
        );

        const data = await rest.put(
          Routes.applicationGuildCommands(
            process.env.CLIENT_ID,
            process.env.GUILD_ID
          ),
          { body: commands }
        );

        console.log(
          `Successfully reloaded ${data.length} application (/) commands\nReady! Logged in as ${client.user.tag}`
        );
      } catch (error) {
        console.error(
          "[READY_EVENT] An error occurred while refreshing application (/) commands\n",
          error
        );
      }
    })();
  },
};
