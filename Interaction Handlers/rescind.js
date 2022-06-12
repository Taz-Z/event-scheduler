const { loadData, saveData, updateEmbed } = require("../helpers/helper");

const handleRescind = async (uuid, client, user, interaction) => {
  const loadedData = await loadData();
  const raidData = loadedData[uuid];
  const userId = user.id;

  raidData.dps = raidData.dps.filter((d) => d.id !== userId);
  raidData.supp = raidData.supp.filter((d) => d.id !== userId);

  loadedData[uuid] = raidData;

  await saveData(loadedData);
  await updateEmbed(raidData, uuid, client);

  const admin = client.users.cache.get(raidData.admin);
  interaction.reply({
    content: `You have successfully been removed from ${raidData.leader}'s ${raidData.content} Run`,
    ephemeral: true,
  });
  admin.send(
    `${user.username} has removed themselves from your ${raidData.content} Run`
  );
};

module.exports = {
  handleRescind,
};
