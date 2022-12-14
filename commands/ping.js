const { SlashCommandBuilder } = require("discord.js");
const wait = require("node:timers/promises").setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    const cId = interaction.channelId;
    const user = interaction.user;
    const gId = interaction.guildId;
    const animate = [
      `${user}ðââââââ`,
      `${user}ðð¥âââââ`,
      `${user}ðâ¤âââââ`,
      `${user}ðââ¤ââââ`,
      `${user}ðâââ¤âââ`,
      `${user}ðââââ¤ââ`,
      `${user}ðâââââ¤â`,
    ];

    await interaction.reply(`${animate[0]}`);
    await wait(500);
    for (let i = 1; i < animate.length; i++) {
      await interaction.editReply(`${animate[i]}`);
    }
    await wait(1500);
    await interaction.editReply(`${user}ðââââðggoma`);
  },
};
