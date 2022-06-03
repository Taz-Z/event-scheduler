const { SlashCommandBuilder } = require("@discordjs/builders");
const { getBaseEmbed } = require("../helpers/helper");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("raid")
    .setDescription("Sets up a raid embed!")
    .addStringOption((option) =>
      option
        .setName("content")
        .setDescription("The raid which you are doing")
        .setRequired(true)
        .addChoices(
          {
            name: "Argos P1",
            value: "Argos P1",
          },
          {
            name: "Argos P2",
            value: "Argos P2",
          },
          {
            name: "Argos P3",
            value: "Argos P3",
          },
          {
            name: "Normal Valtan",
            value: "Normal Valtan",
          },
          {
            name: "Hard Mode Valtan",
            value: "Hard Mode Valtan",
          },
          {
            name: "Normal Vykas",
            value: "Normal Vykas",
          },
          {
            name: "Hard Mode Vykas",
            value: "Hard Mode Vykas",
          }
        )
    )
    .addStringOption((option) =>
      option
        .setName("date")
        .setDescription("Date and time of raid")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("leader")
        .setDescription("Name of raid leader")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("role")
        .setDescription("Are you a dps or support?")
        .setRequired(true)
        .addChoices(
          {
            name: "I am a dps",
            value: "dps",
          },
          {
            name: "I am a support",
            value: "supp",
          }
        )
    ),
  async execute(interaction) {
    const content = interaction.options.getString("content");
    const date = interaction.options.getString("date");
    const leader = interaction.options.getString("leader");
    const dps = interaction.options.getString("role");
    console.log(content, date, leader, dps);
    if (!content || !date || !leader || !role) return;
    const embed = getBaseEmbed("Uhhh");
    await interaction.reply({ embeds: [embed] });
  },
};
