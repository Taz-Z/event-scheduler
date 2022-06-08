const { SlashCommandBuilder } = require("@discordjs/builders");
const { classes, content } = require("../helpers/consts");
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

    const newRaid = {
      admin: interaction.user.id,
      leader,
      messageId: "",
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

    const ids = require("../channel_ids.json");
    const channelToSend = await interaction.client.channels.cache.get(
      ids.raid_channel
    );

    const reply = await channelToSend.send({
      ...getBaseEmbed(newRaid, interaction.id),
      fetchReply: true,
    });

    newRaid.messageId = reply.id;

    interaction.reply({
      content: "Posted embed in static-raid-groups channel",
      ephemeral: true,
    });

    const schedule = await loadData();
    schedule[interaction.id] = newRaid; //add some data
    await saveData(schedule);
  },
};
