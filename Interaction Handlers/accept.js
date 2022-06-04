const { loadData, saveData, isDps, updateEmbed } = require("../helpers/helper");

const handleAccept = async (uuid, client, admin, queryString) => {
  const loadedData = await loadData();
  const data = loadedData[uuid];
  const [id, name, chosenClass] = queryString.split("-");
  const amDps = isDps(chosenClass);

  const isInGroup = [...data.dps, ...data.supp].some((d) => d.id === id);

  if (isInGroup) {
    return admin.send("User is already in group");
  }
  if (amDps) {
    data.dps.push({ id, name, chosenClass });
  } else {
    data.supp.push({ id, name, chosenClass });
  }

  if (data.dps.length > 6 && amDps) {
    return admin.send(
      `Failed to accept individual, your group already has enough dps`
    );
  }

  if (data.supp.length > 2 && !amDps) {
    return admin.send(
      `Failed to accept individual, your group already has enough supports`
    );
  }

  loadedData[uuid] = data;
  await saveData(loadedData);

  const user = client.users.cache.get(id);
  user.send(`You were accepted for: ${data.leader}'s ${data.content} Run`);
  admin.send(`${name} accepted into your ${data.content} Run`);

  await updateEmbed(data, uuid, client);
};

module.exports = { handleAccept };
