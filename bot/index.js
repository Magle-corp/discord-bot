import { Client, GatewayIntentBits, Collection } from "discord.js";
import dotenv from "dotenv";
import database from "./database/index.js";

dotenv.config();

// Start Sequelize ORM.
await database();

// Add appropriates intents for the bot.
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

// Create the bot commands collection.
client.commands = new Collection();

const handlers = ["eventHandler", "commandHandler"];

// Import and execute handlers.
handlers.map(async (handler) => {
  const { default: handlerFunction } = await import(
    `./utils/handlers/${handler}.js`
  );
  await handlerFunction(client);
});

client.login(process.env.DISCORD_TOKEN);
