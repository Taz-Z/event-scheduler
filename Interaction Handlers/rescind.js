const { loadData, saveData, updateEmbed } = require("../helpers/helper");

const handleRescind = async (uuid, client, user) => {
  const loadedData = await loadData();
  const raidData = loadedData[uuid];
  const userId = user.id;

  raidData.dps = raidData.dps.filter((d) => d.id !== userId);
  raidData.supp = raidData.supp.filter((d) => d.id !== userId);

  loadedData[uuid] = raidData;

  await saveData(loadedData);
  await updateEmbed(raidData, uuid, client);

  const admin = client.users.cache.get(raidData.admin);
  user.send(
    `You have successfully been removed from ${raidData.leader}'s ${raidData.content} Run`
  );
  admin.send(
    `${user.username} has removed themselves from your ${raidData.content} Run`
  );
};

module.exports = {
  handleRescind,
};
