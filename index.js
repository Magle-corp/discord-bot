const { Client, GatewayIntentBits, Collection } = require("discord.js");
const dotenv = require("dotenv");
const database = require("./utils/database/connection");

dotenv.config();
database.start();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

client.commands = new Collection();

const handlers = ["eventHandler", "commandHandler"];

handlers.forEach((handler) => require(`./utils/handlers/${handler}`)(client));

client.login(process.env.DISCORD_TOKEN);
