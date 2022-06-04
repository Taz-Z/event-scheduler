const { MessageButton, MessageActionRow } = require("discord.js");
const {
  SUCCESS,
  DANGER,
  ACCEPT_APPLICATION,
  REJECT_APPLICATION,
  supportClasses,
} = require("../helpers/consts");
const {
  getButtonChoiceValue,
  getFirstTextAnswer,
  getBaseEmbed,
  getClassValue,
  getRaidData,
  loadData,
  saveData,
} = require("../helpers/helper");

const handleApply = async (uuid, user, client) => {
  const data = await getRaidData(uuid);

  let notes = "";
  const chosenClass = await getClassValue(
    user,
    `${uuid}-chosenClass`,
    "Select your class"
  );
  const isDps = supportClasses.has(chosenClass);
  const noteOptions = [
    { label: "Yes", customId: `${uuid}-yes`, style: SUCCESS },
    { label: "No", customId: `${uuid}-no`, style: DANGER },
  ];
  const addNotes = await getButtonChoiceValue(
    user,
    "Would you like to send any additonal notes to the raid leader?",
    noteOptions
  );
  const noteChoice = addNotes.split("-")[1] === "yes";
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
    .addField("Role", isDps ? "Dps" : "Support")
    .addField("Additional Notes", notes ? notes : "No additional Notes");

  const queryString = `${user.id}-${user.username}-${chosenClass}-${isDps}`;
  const components = [
    new MessageActionRow().addComponents(
      new MessageButton()
        .setStyle(SUCCESS)
        .setLabel("Accept")
        .setCustomId(`${uuid}-${ACCEPT_APPLICATION}-${queryString}`),
      new MessageButton()
        .setStyle(DANGER)
        .setLabel("Deny")
        .setCustomId(`${uuid}-${REJECT_APPLICATION}-${queryString}`)
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

  const dps = data.dps.map((d, i) => {
    return {
      name: `Dps Slot ${i + 1}`,
      value: `${d.name} (${d.chosenClass})`,
      inline: true,
    };
  });

  const supps = data.supp.map((d, i) => {
    return {
      name: `Support Slot ${i + 1}`,
      value: `${d.name} (${d.chosenClass})`,
      inline: true,
    };
  });

  const embed = getBaseEmbed(`${data.leader}'s ${data.content} Run`);
  embed
    .setDescription(`Date/Time of run: ${data.date}`)
    .addFields([...dps, ...supps])
    .setFooter({ text: "Click on the button below to apply to the group" });

  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(`${uuid}-${APPLY}`)
      .setLabel("Apply to Group")
      .setStyle(SUCCESS),
    new MessageButton()
      .setCustomId(`${uuid}-${RESCIND}`)
      .setLabel("Can't Make It")
      .setStyle(DANGER),
    new MessageButton()
      .setCustomId(`${uuid}-${EDIT}`)
      .setLabel("Edit")
      .setStyle(PRIMARY)
  );

  const user = client.users.cache.get(id);
  const originalEmbed = await client.channels.cache
    .get(ids.raid_channel)
    .messages.fetch(data.messageId);
  originalEmbed.edit({ embeds: [embed], components: [row] });
};

module.exports = { handleApply, handleAccept };
