const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");
const { APPLY, RESCIND, EDIT, SUCCESS } = require("../helpers/consts");
const { getBaseEmbed, loadData, saveData } = require("../helpers/helper");

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
    )
    .addStringOption((option) =>
      option.setName("dps1").setDescription("Name of a dps")
    )
    .addStringOption((option) =>
      option.setName("dps2").setDescription("Name of a dps")
    )
    .addStringOption((option) =>
      option.setName("dps3").setDescription("Name of a dps")
    )
    .addStringOption((option) =>
      option.setName("dps4").setDescription("Name of a dps")
    )
    .addStringOption((option) =>
      option.setName("dps5").setDescription("Name of a dps")
    )
    .addStringOption((option) =>
      option.setName("dps6").setDescription("Name of a dps")
    )
    .addStringOption((option) =>
      option.setName("supp1").setDescription("Name of a support")
    )
    .addStringOption((option) =>
      option.setName("supp2").setDescription("Name of a support")
    ),

  async execute(interaction) {
    const content = interaction.options.getString("content");
    const date = interaction.options.getString("date");
    const leader = interaction.options.getString("leader");
    const role = interaction.options.getString("role");
    if (!content || !date || !leader || !role) return;
    const embed = getBaseEmbed(`${leader}'s ${content} Run`);
    embed
      .setDescription(`Date/Time of run: ${date}`)
      .addFields([
        {
          name: "Dps Slot 1",
          value: role === "dps" ? leader : "OPEN",
          inline: true,
        },
        { name: "Dps Slot 2", value: "OPEN", inline: true },
        { name: "Dps Slot 3", value: "OPEN", inline: true },
        { name: "Dps Slot 4", value: "OPEN", inline: true },
        { name: "Dps Slot 5", value: "OPEN", inline: true },
        { name: "Dps Slot 6", value: "OPEN", inline: true },
        {
          name: "Support Slot 1",
          value: role === "dps" ? "OPEN" : leader,
          inline: true,
        },
        { name: "Support Slot 2", value: "OPEN", inline: true },
      ])
      .setFooter({ text: "Click on the button below to apply to the group" });

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(`${interaction.id}-${APPLY}`)
        .setLabel("Apply to Group")
        .setStyle(SUCCESS),
      new MessageButton()
        .setCustomId(`${interaction.id}-${RESCIND}`)
        .setLabel("Can't Make It")
        .setStyle(DANGER),
      new MessageButton()
        .setCustomId(`${interaction.id}-${EDIT}`)
        .setLabel("Edit")
        .setStyle(PRIMARY)
    );

    const newRaid = {
      admin: interaction.user.id,
      content,
      date,
      dps: [],
      supp: [],
    };
    const schedule = await loadData();
    schedule[interaction.id] = newRaid; //add some data
    await saveData(schedule);

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
