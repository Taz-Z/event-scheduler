const { getRaidData } = require("../helpers/helper");

const handleReject = async (uuid, user, interaction, client, queryString) => {
  const [id, name, _] = queryString.split("-");
  const data = await getRaidData(uuid);
  const userToSend = client.users.cache.get(id);
  userToSend.send(
    `You were declined for: ${data.leader}'s ${data.content} Run`
  );
  interaction.reply(`${name} was declined for your ${data.content} Run`);
};

module.exports = { handleReject };
