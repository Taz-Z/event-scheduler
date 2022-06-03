const {
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} = require("discord.js");
const fs = require("fs");

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

const getIdGuildMemb = (message) => {
  const ids = JSON.parse(fs.readFileSync("./channel_ids.json", "utf8"));
  const guild = message.client.guilds.cache.get(ids["guild"]);
  const memb = guild.members.cache.get(message.author.id);
  return [ids, guild, memb];
};

const getMemb = (message) => {
  const [ids, guild, memb] = getIdGuildMemb(message);
  return memb;
};

const getGuild = (message) => {
  const [ids, guild, memb] = getIdGuildMemb(message);
  return guild;
};

const getIds = (message) => {
  const [ids, guild, memb] = getIdGuildMemb(message);
  return ids;
};

const getGuildFromClient = async (client) => {
  const ids = JSON.parse(fs.readFileSync("./channel_ids.json", "utf8"));
  return client.guilds.cache.get(ids.guild);
};

const createEmbedSpace = () => ({ name: "\u200b", value: "\u200b" });

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

module.exports = {
  getMemb,
  getIdGuildMemb,
  hasValidRole,
  getBaseEmbed,
  createEmbedSpace,
  getGuild,
  getIds,
  getGuildFromClient,
  getSelectMenuValue,
  getButtonChoiceValue,
  getFirstTextAnswer,
  loadData,
  saveData,
  getRaidData,
  getClassValue,
};
