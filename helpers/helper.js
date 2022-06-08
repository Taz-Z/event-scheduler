const {
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} = require("discord.js");
const fs = require("fs");
const {
  PRIMARY,
  SUCCESS,
  DANGER,
  APPLY,
  RESCIND,
  EDIT,
  supportClasses,
} = require("./consts");

const hasValidRole = (givenRoles, ...addtionalRoles) => {
  const acceptedRoles = new Set();
  if (addtionalRoles) {
    addtionalRoles.forEach((item) => acceptedRoles.add(item));
  }

  return givenRoles?.some((r) => acceptedRoles.has(r.id));
};

const getBaseEmbed = (title) => {
  const Discord = require("discord.js");
  return new Discord.MessageEmbed()
    .setColor(`#d4af37`)
    .setTitle(title)
    .setAuthor({
      name: "Reaper's Scheduler",
      iconURL: "https://i.imgur.com/kYJ7fbn.png",
    });
};

const getButtonChoiceValue = async (
  memb,
  content,
  options,
  time = 60000,
  isEmbed = false,
  isChannel = false
) => {
  const buttons = options.map((btn) => {
    const button = new MessageButton()
      .setStyle("PRIMARY")
      .setLabel(btn.label)
      .setCustomId(btn.customId);
    if ("style" in btn) {
      button.setStyle(btn.style);
    }
    if ("emoji" in btn) {
      button.setEmoji(btn.emoji);
    }
    return button;
  });
  const components = [new MessageActionRow().addComponents(...buttons)];
  const msg = isEmbed
    ? await memb.send({
        embeds: [content],
        components,
      })
    : await memb.send({
        content,
        components,
      });

  const filter = (i) => {
    i.deferUpdate();
    return isChannel ? i.user.id !== memb.id : i.user.id === memb.id;
  };

  try {
    const interaction = await msg.awaitMessageComponent({
      filter,
      componentType: "BUTTON",
      time,
    });

    return interaction.customId;
  } catch (e) {
    throw e;
  }
};
const getClassValue = async (memb, id, content) => {
  const classes = [
    "Berserker",
    "Paladin",
    "Gunlancer",
    "Destroyer",
    "Striker",
    "Wardancer",
    "Scrapper",
    "Soulfist",
    "Glavier",
    "Gunslinger",
    "Artillerist",
    "Deadeye",
    "Sharpshooter",
    "Bard",
    "Sorceress",
    "Arcana",
    "ShadowHunter",
    "Deathblade",
  ];
  return await getSelectMenuValue(
    memb,
    id,
    content,
    classes.reduce((acc, curr) => {
      acc.push({ label: curr, value: curr });
      return acc;
    }, [])
  );
};

const getSelectMenuValue = async (memb, id, content, options) => {
  const components = [
    new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId(id)
        .setPlaceholder("Nothing selected")
        .addOptions(options)
    ),
  ];

  const msg = await memb.send({
    content,
    components,
  });

  const filter = (i) => {
    i.deferUpdate();
    return i.user.id === memb.id;
  };

  try {
    const interaction = await msg.awaitMessageComponent({
      filter,
      componentType: "SELECT_MENU",
      time: 60000,
    });

    return interaction.values[0];
  } catch (e) {
    throw e;
  }
};

const getFirstTextAnswer = async (memb, question) => {
  const filter = (m) => m.author.id === memb.id;
  const msg = await memb.send(question);
  const collected = await msg.channel.awaitMessages({
    filter,
    idle: 60000,
    max: 1,
  });
  return collected.first()?.content ?? "";
};

const dataFile = "schedule.json";

const loadData = async () => {
  return JSON.parse(await fs.readFileSync(dataFile));
};

const getRaidData = async (id) => {
  return (await loadData())[id];
};

const saveData = async (data) => {
  await fs.writeFileSync(dataFile, JSON.stringify(data));
};

const isDps = (chosenClass) => !supportClasses.has(chosenClass);

const getBaseRaidEmbed = (data, uuid) => {
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
      .setLabel("RSVP")
      .setStyle(SUCCESS)
      .setDisabled(data.dps.length >= 6 && data.supp.length >= 2),
    new MessageButton()
      .setCustomId(`${uuid}&${RESCIND}`)
      .setLabel("Cancel RSVP")
      .setStyle(DANGER),
    new MessageButton()
      .setCustomId(`${uuid}&${EDIT}`)
      .setLabel("Edit")
      .setStyle(PRIMARY)
  );

  return { embed: [embed], components: [row] };
};
const updateEmbed = async (data, uuid, client) => {
  const options = getBaseRaidEmbed(data, uuid);
  const ids = require("../channel_ids.json");
  const originalEmbed = await client.channels.cache
    .get(ids.raid_channel)
    .messages.fetch(data.messageId);
  originalEmbed.edit(options);
};

module.exports = {
  hasValidRole,
  getBaseEmbed,
  getSelectMenuValue,
  getButtonChoiceValue,
  getFirstTextAnswer,
  loadData,
  saveData,
  getRaidData,
  getClassValue,
  isDps,
  updateEmbed,
};
