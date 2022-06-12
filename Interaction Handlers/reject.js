const { getRaidData } = require("../helpers/helper");

const handleReject = async (uuid, client, admin, queryString, interaction) => {
  const [id, name, _] = queryString.split("-");
  const data = await getRaidData(uuid);
  const user = client.users.cache.get(id);
  user.send(`You were declined for: ${data.leader}'s ${data.content} Run`);
  interaction.reply(`${name} was declined for your ${data.content} Run`);
};

module.exports = { handleReject };
