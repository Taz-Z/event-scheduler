const { SlashCommandBuilder } = require("@discordjs/builders");

const TAX = 0.95;
const DUNGEON_SPLIT = 0.75;
const RAID_SPLIT = 0.875;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bid")
    .setDescription("Get bid price for equal splits")
    .addIntegerOption((option) =>
      option
        .setName("price")
        .setDescription("The price ofthe item")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("content")
        .setDescription("Select dungeon/raid")
        .setRequired(true)
        .addChoices(
          {
            name: "Dungeon (4 man content)",
            value: 4,
          },
          {
            name: "Raid (8 man content)",
            value: 8,
          }
        )
    ),
  async execute(interaction) {
    const price = interaction.options.getInteger("price");
    const content = interaction.options.getInteger("content");
    if (!content || !price) return;
    const bidValue = Math.floor(
      price * TAX * (content === 4 ? DUNGEON_SPLIT : RAID_SPLIT)
    );
    interaction.reply({
      content: `You should bid: ${bidValue}g`,
      ephemeral: true,
    });
  },
};
