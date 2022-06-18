const { Client, Intents, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { token } = require("./auth.json");
const {
  APPLY,
  RESCIND,
  EDIT,
  ACCEPT_APPLICATION,
  REJECT_APPLICATION,
} = require("./helpers/consts");
const { handleAccept } = require("./Interaction Handlers/accept");
const { handleApply } = require("./Interaction Handlers/apply");
const { handleEdit } = require("./Interaction Handlers/edit");
const { handleReject } = require("./Interaction Handlers/reject");
const { handleRescind } = require("./Interaction Handlers/rescind");
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

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

client.once("ready", () => {
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    const [uuid, actionType, queryString] = interaction.customId.split("&");

    switch (actionType) {
      case APPLY:
        await handleApply(uuid, interaction.user, interaction, client);
        break;
      case ACCEPT_APPLICATION:
        await handleAccept(
          uuid,
          interaction.user,
          interaction,
          client,
          queryString
        );
        break;
      case RESCIND:
        await handleRescind(uuid, interaction.user, interaction, client);
        break;
      case EDIT:
        await handleEdit(uuid, interaction.user, interaction, client);
        break;
      case REJECT_APPLICATION:
        await handleReject(
          uuid,
          interaction.user,
          interaction,
          client,
          queryString
        );
        break;
      default:
        break;
    }
  } else if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.login(token);
