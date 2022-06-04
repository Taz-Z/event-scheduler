const { info } = require("winston");
const { content, SUCCESS, DANGER } = require("../helpers/consts");
const {
  loadData,
  getSelectMenuValue,
  getFirstTextAnswer,
  saveData,
  updateEmbed,
  getButtonChoiceValue,
} = require("../helpers/helper");

const handleEdit = async (uuid, client, user) => {
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
    `${uuid}&${user.id}&handleEdit`,
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
        `${uuid}&handleEdit&content`,
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
      const dpsOptions = data.dps.map((d) => {
        return { label: `${d.name} (${d.chosenClass})`, value: d.id };
      });
      const dpsToRemove = await getSelectMenuValue(
        user,
        `${uuid}&handleEdit&dps`,
        "Select a dps to remove",
        dpsOptions
      );
      data.dps = data.dps.filter((d) => d.id !== dpsToRemove);
      break;
    case "supp":
      const suppOptions = data.supp.map((d) => {
        return { label: `${d.name} (${d.chosenClass})`, value: d.id };
      });
      const suppToRemove = await getSelectMenuValue(
        user,
        `${uuid}&handleEdit&supp`,
        "Select a dps to remove",
        suppOptions
      );
      data.supp = data.supp.filter((d) => d.id !== suppToRemove);
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
