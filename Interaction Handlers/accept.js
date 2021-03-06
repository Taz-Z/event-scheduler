const { loadData, saveData, isDps, updateEmbed } = require("../helpers/helper");

const handleAccept = async (uuid, user, interaction, client, queryString) => {
  const loadedData = await loadData();
  const data = loadedData[uuid];
  const [id, name, chosenClass] = queryString.split("-");

  const isInGroup = [...data.dps, ...data.supp].some((d) => d.id === id);
  if (isInGroup) {
    return interaction.reply("User is already in group");
  }

  const amDps = isDps(chosenClass);
  if (amDps) {
    data.dps.push({ id, name, chosenClass });
  } else {
    data.supp.push({ id, name, chosenClass });
  }

  if (data.dps.length > 6 && amDps) {
    return interaction.reply(
      `Failed to accept individual, your group already has enough dps`
    );
  }

  if (data.supp.length > 2 && !amDps) {
    return interaction.reply(
      `Failed to accept individual, your group already has enough supports`
    );
  }

  loadedData[uuid] = data;
  await saveData(loadedData);

  const userToSend = client.users.cache.get(id);
  userToSend.send(
    `You were accepted for: ${data.leader}'s ${data.content} Run`
  );
  interaction.reply(`${name} accepted into your ${data.content} Run`);

  await updateEmbed(data, uuid, client);
};

module.exports = { handleAccept };
