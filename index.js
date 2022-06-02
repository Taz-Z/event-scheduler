const fs = require("fs");
const { Client, Intents, Collection } = require("discord.js");
const { token } = require("./auth.json");
const { prefix } = require("./config.json");
const chan = JSON.parse(fs.readFileSync("./channel_ids.json", "utf8"));
const logger = require("./logger");
const client = new Client({
  intents: [
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
const cooldowns = new Collection();

client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
}

client.once("ready", async () => {
  const ids = JSON.parse(fs.readFileSync("./channel_ids.json", "utf8"));
  const guild = client.guilds.cache.get(ids.guild);
  await guild.members.fetch();
  logger.info("Ready!");
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();
  const allowedCommands = [
    "balance",
    "admin-balance",
    "complete",
    "calc-balance",
    "tinker",
  ];
  if (!allowedCommands.includes(commandName)) return;
  const command = client.commands.get(commandName);
  client.commands.find(
    (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
  );

  if (!command) return;

  if (command.guildOnly && message.channel.type !== "GUILD_TEXT") {
    return message.channel.send("You may not use this command in a DM.");
  }

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.channel.send(
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (error) {
    logger.error(`${error}\n${new Date()}`);
    logger.error(error.toString());
    message.channel.send(
      "Error executing command. Please contact @Developer if this continues to happen."
    );
  }
});

sheetsService.initalizeSheetService();
client.login(token);

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;
});
