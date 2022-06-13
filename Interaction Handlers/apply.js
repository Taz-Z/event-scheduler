const { MessageButton, MessageActionRow } = require("discord.js");
const {
  SUCCESS,
  DANGER,
  ACCEPT_APPLICATION,
  REJECT_APPLICATION,
  YES,
  NO,
} = require("../helpers/consts");
const {
  getButtonChoiceValue,
  getFirstTextAnswer,
  getBaseEmbed,
  getClassValue,
  getRaidData,
  isDps,
  createCustomId,
} = require("../helpers/helper");

const handleApply = async (uuid, user, interaction, client) => {
  interaction.reply({ content: "Please check your dms", ephemeral: true });
  const data = await getRaidData(uuid);

  let notes = "";
  const chosenClass = await getClassValue(
    user,
    `${uuid}&chosenClass`,
    "Select your class"
  );
  const amDps = isDps(chosenClass);
  const noteOptions = [
    { label: "Yes", customId: createCustomId(uuid, YES), style: SUCCESS },
    { label: "No", customId: createCustomId(uuid, NO), style: DANGER },
  ];
  const addNotes = await getButtonChoiceValue(
    user,
    "Would you like to send any additonal notes to the raid leader?",
    noteOptions
  );
  const noteChoice = addNotes.split("&")[1] === YES;
  if (noteChoice) {
    notes = await getFirstTextAnswer(
      user,
      "Please type any additonal notes you want to send and hit enter"
    );
  }
  const admin = client.users.cache.get(data.admin);
  const embed = getBaseEmbed(
    `Application for: ${data.content} on ${data.date}`
  );
  embed
    .addField("Name", user.username)
    .addField("Class", chosenClass)
    .addField("Role", amDps ? "Dps" : "Support")
    .addField("Additional Notes", notes ? notes : "No additional Notes");

  const queryString = `${user.id}-${user.username}-${chosenClass}`;
  const components = [
    new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle(SUCCESS)
        .setLabel("Accept")
        .setCustomId(createCustomId(uuid, ACCEPT_APPLICATION, queryString)),
      new MessageButton()
        .setStyle(DANGER)
        .setLabel("Deny")
        .setCustomId(createCustomId(uuid, REJECT_APPLICATION, queryString))
    ),
  ];

  admin.send({ embeds: [embed], components });
  user.send("Your application has been submitted");
};

module.exports = { handleApply };
