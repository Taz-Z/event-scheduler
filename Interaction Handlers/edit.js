const { content } = require("../helpers/consts");
const {
  loadData,
  getSelectMenuValue,
  getFirstTextAnswer,
  saveData,
  updateEmbed,
  createCustomId,
} = require("../helpers/helper");

const removeUser = async (data, user, uuid) => {
  const options = data.map((d) => {
    return { label: `${d.name} (${d.chosenClass})`, value: d.id };
  });
  const toRemove = await getSelectMenuValue(
    user,
    `${uuid}&handleEdit&dps`,
    "Select a dps to remove",
    options
  );
  return data.filter((d) => d.id !== toRemove);
};

const handleEdit = async (uuid, user, interaction, client) => {
  interaction.reply({ content: "Please check your dms", ephemeral: true });
  const loadedData = await loadData();
  const data = loadedData[uuid];
  if (data.admin !== user.id) {
    return user.send("Not authorized");
  }

  const editOptions = [
    {
      label: "Change what content you are doing",
      value: "content",
    },
    {
      label: "Change what time you are running",
      value: "date",
    },
    {
      label: "Remove a dps in your group",
      value: "dps",
    },
    {
      label: "Remove a support in your group",
      value: "supp",
    },
  ];

  const chosenEdit = await getSelectMenuValue(
    user,
    createCustomId(uuid, user.id, "handleEdit"),
    "What would you like to edit?",
    editOptions
  );

  switch (chosenEdit) {
    case "content":
      const bossOptions = content.map((boss) => {
        return {
          label: boss,
          value: boss,
        };
      });
      const chosenContent = await getSelectMenuValue(
        user,
        createCustomId(uuid, user.id, "handleEdit", "content"),
        "Select a raid to run",
        bossOptions
      );
      data.content = chosenContent;
      break;
    case "date":
      const newDate = await getFirstTextAnswer(
        user,
        "Please enter the new date for your run"
      );
      data.date = newDate;
      break;
    case "dps":
      data.dps = await removeUser(data.dps, user, uuid);
      break;
    case "supp":
      data.supp = await removeUser(data.supp, user, uuid);
      break;
    default:
      break;
  }

  loadedData[uuid] = data;
  saveData(loadedData);

  updateEmbed(data, uuid, client);
  user.send("Updated information successfully");
};

module.exports = { handleEdit };
