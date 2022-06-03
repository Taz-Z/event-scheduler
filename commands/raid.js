const { SlashCommandBuilder } = require("@discordjs/builders");
const { getBaseEmbed } = require("../helpers/helper");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("raid")
    .setDescription("Sets up a raid embed!")
    .addStringOption((option) =>
      option
        .setName("Raid Type")
        .setDescription("The raid which you are doing")
        .setRequired(true)
        .addChoices(
          {
            name: "Normal Valtan",
            value: "Normal Valtan",
          },
          {
            name: "Hard Mode Valtan",
            value: "Hard Mode Valtan",
          }
        )
    ),

  async execute(interaction) {
    const embed = getBaseEmbed("Uhhh");
    await interaction.reply({ embeds: [embed] });
  },
};
