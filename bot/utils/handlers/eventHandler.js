import { promisify } from "util";
import glob from "glob";
const pGlob = promisify(glob);

/**
 * Import and set bot events.
 *
 * @param client
 * @return {Promise<void>}
 */
export default async (client) => {
  const eventFiles = await pGlob(process.cwd() + "/events/*/*.js");
  const featureFiles = await pGlob(process.cwd() + "/features/*/*.event.js");

  const mergedEventFiles = await featureFiles.concat(eventFiles);

  mergedEventFiles.map(async (eventFile) => {
    const { default: event } = await import(eventFile);

    if (!event) {
      console.error(
        `[EVENT_HANDLER] The event file at ${eventFile} is missing a required event declaration`
      );
      return;
    }

    if (!event.name || !event.eventName || !event.execute) {
      console.error(
        `[EVENT_HANDLER] The event at ${eventFile} is missing a required "name" or "eventName" or "execute" property`
      );
      return;
    }

    if (event.once) {
      client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
      client.on(event.name, (...args) => event.execute(client, ...args));
    }

    console.log(`Loaded event : ${event.eventName}`);
  });
};
