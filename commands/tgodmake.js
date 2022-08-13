const { SlashCommandBuilder, MessageManager } = require("discord.js");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const fs = require("fs");

let isStarted = false;
const userList = new Set();
let playersNum = 0;

const ONE = "1️⃣";
const TWO = "2️⃣";
const THREE = "3️⃣";
const FOUR = "4️⃣";
const FIVE = "5️⃣";
const SIX = "6️⃣";
const SEVEN = "7️⃣";
const EIGHT = "8️⃣";
const NINE = "9️⃣";
const TEN = "🔟";

const reactions = [ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, TEN];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tgodmake") //command Name
    .setDescription("The Game of Death Make Room"), //command Description

  async execute(interaction) {
    // const channel = interaction.channel;
    if (isStarted == false) {
      const filePath = `./data.json`;
      isStarted = true;
      const username = interaction.user;

      userList.add(username.tag);
      playersNum++;

      const message = await interaction.reply({
        content: `:skull:The Game Of Death:skull:\n${username} made game.\nYou can Join by pressing Emoji\n💥 : Join Game\n⬇⬇`,
        fetchReply: true,
      });

      message
        .react("💥")
        .catch((error) =>
          console.error("One of the emojis failed to react:", error)
        );

      const filter = (reaction, user) => {
        return reaction.emoji.name === "💥";
      };

      const collector = message.createReactionCollector({
        filter,
        time: 10000,
      });

      collector.on("collect", (reaction, user) => {
        if (user.tag != interaction.user.tag && user.id !== message.author.id) {
          interaction.channel.send(`${user}형이 참가했대`);
          console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
          userList.add(user.tag);
          playersNum++;
        }
        if (playersNum > 9) {
          message.reactions
            .removeAll()
            .catch((error) =>
              console.error("Failed to clear reactions:", error)
            );
          interaction.channel.send(`사람이 꽉 찼어`);
        }
      });
      collector.on("end", (collected) => {
        message.reactions
          .removeAll()
          .catch((error) => console.error("Failed to clear reactions:", error));

        console.log(`userList.size : ${userList.size}`);
        console.log(`playersNum : ${playersNum}`);
        console.log(`userList : ${[...userList]}`);

        if (userList.size < 3) {
          interaction.editReply({
            content: `참여자가 3명 이상이어야 시작할 수 있어`,
          });
          isStarted = false;
          userList.clear();
          playersNum = 0;
          fs.writeFile(
            filePath,
            `{"gameStep" : 1, "userList" : []}`,
            "utf8",
            function (err, data) {
              if (err) {
                // 파일 쓰기 실패
                console.log(err);
              } else {
                // 파일 쓰기 성공
              }
            }
          );
        } else {
          const userListArr = [...userList];
          let userListJson = `{"gameStep" : 2, "userList" : [`;
          for (let i = 0; i < userListArr.length; i++) {
            userListJson += `"${userListArr[i]}",`;
          }
          userListJson += `"lastUSER"]}`;

          fs.writeFile(filePath, userListJson, "utf8", function (err, data) {
            if (err) {
              // 파일 쓰기 실패
              console.log(err);
            } else {
              // 파일 쓰기 성공
              interaction.editReply({
                content: `참여자 명단이 작성됐어. /tgodstart 를 입력해서 게임을 시작할 수 있어!`,
              });
            }
          });
        }
      });
    } else if (isStarted == true) {
      await interaction.reply({
        content: `이미 게임이 진행되고 있는것 같아`,
        ephemeral: true,
      });
    }
  },
};
