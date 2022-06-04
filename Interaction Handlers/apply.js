const { MessageButton, MessageActionRow } = require("discord.js");
const {
  PRIMARY,
  SUCCESS,
  DANGER,
  ACCEPT_APPLICATION,
  REJECT_APPLICATION,
  APPLY,
  RESCIND,
  EDIT,
} = require("../helpers/consts");
const {
  getButtonChoiceValue,
  getFirstTextAnswer,
  getBaseEmbed,
  getClassValue,
  getRaidData,
  loadData,
  saveData,
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

  const queryString = `${user.id}-${user.username}-${chosenClass}-${amDps}`;
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

const handleAccept = async (uuid, client, admin, queryString) => {
  const loadedData = await loadData();
  const data = loadedData[uuid];
  const [id, name, chosenClass, isDps] = queryString.split("-");

  const ids = require("../channel_ids.json");

  if (isDps) {
    data.dps.push({ id, name, chosenClass });
  } else {
    data.supp.push({ id, name, chosenClass });
  }

  loadedData[uuid] = data;
  await saveData(loadedData);

  const fields = [];

  for (let i = 0; i < 6; i++) {
    fields.push({
      name: `Dps Slot ${i + 1}`,
      value:
        i < data.dps.length
          ? `${data.dps[i].name} (${data.dps[i].chosenClass})`
          : "OPEN",
      inline: true,
    });
  }

  for (let i = 0; i < 2; i++) {
    fields.push({
      name: `Support Slot ${i + 1}`,
      value:
        i < data.supp.length
          ? `${data.supp[i].name} (${data.supp[i].chosenClass})`
          : "OPEN",
      inline: true,
    });
  }

  const embed = getBaseEmbed(`${data.leader}'s ${data.content} Run`);
  embed
    .setDescription(`Date/Time of run: ${data.date}`)
    .addFields(fields)
    .setFooter({ text: "Click on the button below to apply to the group" });

  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(`${uuid}&${APPLY}`)
      .setLabel("Apply to Group")
      .setStyle(SUCCESS)
      .setDisabled(data.dps.length === 6 && data.supp.length === 2),
    new MessageButton()
      .setCustomId(`${uuid}&${RESCIND}`)
      .setLabel("Can't Make It")
      .setStyle(DANGER),
    new MessageButton()
      .setCustomId(`${uuid}&${EDIT}`)
      .setLabel("Edit")
      .setStyle(PRIMARY)
  );

  const user = client.users.cache.get(id);
  const originalEmbed = await client.channels.cache
    .get(ids.raid_channel)
    .messages.fetch(data.messageId);
  originalEmbed.edit({ embeds: [embed], components: [row] });
  user.send("You were accepted for: " + `${data.leader}'s ${data.content} Run`);
  admin.send(`${name} accepted into your ${data.content} Run`);
};

module.exports = { handleApply, handleAccept };
