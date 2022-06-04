const { MessageButton, MessageActionRow } = require("discord.js");
const {
  SUCCESS,
  DANGER,
  ACCEPT_APPLICATION,
  REJECT_APPLICATION,
} = require("../helpers/consts");
const {
  getButtonChoiceValue,
  getFirstTextAnswer,
  getBaseEmbed,
  getClassValue,
  getRaidData,
  isDps,
} = require("../helpers/helper");

const handleApply = async (uuid, user, client) => {
  const data = await getRaidData(uuid);

  let notes = "";
  const chosenClass = await getClassValue(
    user,
    `${uuid}&chosenClass`,
    "Select your class"
  );
  const amDps = isDps(chosenClass);
  const noteOptions = [
    { label: "Yes", customId: `${uuid}&yes`, style: SUCCESS },
    { label: "No", customId: `${uuid}&no`, style: DANGER },
  ];
  const addNotes = await getButtonChoiceValue(
    user,
    "Would you like to send any additonal notes to the raid leader?",
    noteOptions
  );
  const noteChoice = addNotes.split("&")[1] === "yes";
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
        .setCustomId(`${uuid}&${ACCEPT_APPLICATION}&${queryString}`),
      new MessageButton()
        .setStyle(DANGER)
        .setLabel("Deny")
        .setCustomId(`${uuid}&${REJECT_APPLICATION}&${queryString}`)
    ),
  ];

  admin.send({ embeds: [embed], components });
};

module.exports = { handleApply };
