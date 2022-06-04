const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton } = require("discord.js");
const {
  APPLY,
  RESCIND,
  EDIT,
  SUCCESS,
  DANGER,
  PRIMARY,
  classes,
  content,
} = require("../helpers/consts");
const {
  getBaseEmbed,
  loadData,
  saveData,
  isDps,
} = require("../helpers/helper");

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
          ...content.map((boss) => {
            return {
              name: boss,
              value: boss,
            };
          })
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
        .setName("chosenclass")
        .setDescription("Select your class")
        .setRequired(true)
        .addChoices(
          ...classes.map((classChoice) => {
            return {
              name: classChoice,
              value: classChoice,
            };
          })
        )
    ),
  async execute(interaction) {
    const content = interaction.options.getString("content");
    const date = interaction.options.getString("date");
    const leader = interaction.options.getString("leader");
    const chosenClass = interaction.options.getString("chosenclass");
    if (!content || !date || !leader || !chosenClass) return;
    const amDps = isDps(chosenClass);
    const embed = getBaseEmbed(`${leader}'s ${content} Run`);
    embed
      .setDescription(`Date/Time of run: ${date}`)
      .addFields([
        {
          name: "Dps Slot 1",
          value: amDps ? `${leader} (${chosenClass})` : "OPEN",
          inline: true,
        },
        { name: "Dps Slot 2", value: "OPEN", inline: true },
        { name: "Dps Slot 3", value: "OPEN", inline: true },
        { name: "Dps Slot 4", value: "OPEN", inline: true },
        { name: "Dps Slot 5", value: "OPEN", inline: true },
        { name: "Dps Slot 6", value: "OPEN", inline: true },
        {
          name: "Support Slot 1",
          value: !amDps ? `${leader} (${chosenClass})` : "OPEN",
          inline: true,
        },
        { name: "Support Slot 2", value: "OPEN", inline: true },
      ])
      .setFooter({ text: "Click on the button below to apply to the group" });

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(`${interaction.id}&${APPLY}`)
        .setLabel("Apply to Group")
        .setStyle(SUCCESS),
      new MessageButton()
        .setCustomId(`${interaction.id}&${RESCIND}`)
        .setLabel("Can't Make It")
        .setStyle(DANGER),
      new MessageButton()
        .setCustomId(`${interaction.id}&${EDIT}`)
        .setLabel("Edit")
        .setStyle(PRIMARY)
    );

    const reply = await interaction.reply({
      embeds: [embed],
      components: [row],
      fetchReply: true,
    });

    const newRaid = {
      admin: interaction.user.id,
      leader,
      messageId: reply.id,
      content,
      date,
      dps: amDps
        ? [
            {
              id: interaction.user.id,
              name: leader,
              chosenClass,
            },
          ]
        : [],
      supp: !amDps
        ? [
            {
              id: interaction.user.id,
              name: leader,
              chosenClass,
            },
          ]
        : [],
    };
    const schedule = await loadData();
    schedule[interaction.id] = newRaid; //add some data
    await saveData(schedule);
  },
};
