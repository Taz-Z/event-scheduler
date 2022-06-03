const { SUCCESS, DANGER } = require("../helpers/consts");
const {
  getButtonChoiceValue,
  getFirstTextAnswer,
  getBaseEmbed,
  getClassValue,
  getRaidData,
} = require("../helpers/helper");

const handleApply = async (uuid, user, client) => {
  let notes = "";
  const data = await getRaidData(uuid);
  const chosenClass = await getClassValue(
    user,
    `${uuid}-chosenClass`,
    "Select your class"
  );
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
  console.log(user);
  const admin = client.users.cache.get(data.admin);
  const embed = getBaseEmbed(`Application for: ${user.username}`);
  embed.addField("Class", chosenClass);
  embed.addField("Additional Notes", notes ? notes : "No additional Notes");
};

module.exports = { handleApply };
