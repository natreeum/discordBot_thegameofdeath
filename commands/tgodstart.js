const {
  SlashCommandBuilder,
  ApplicationCommandPermissionType,
  ApplicationCommandOptionWithChoicesAndAutocompleteMixin,
} = require("discord.js");
const fs = require("fs");

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
    .setName("tgodstart")
    .setDescription("The Game of Death Start"),
  async execute(interaction) {
    const filePath = `./data.json`;

    fs.readFile(filePath, "utf8", async function (err, data) {
      if (err) {
        // 파일 읽기 실패
        console.log(err);
      } else {
        // 파일 읽기 성공
        const readDataJson = JSON.parse(data);
        const checkgameStep = readDataJson.gameStep;
        const setUserList = readDataJson.userList;
        const setUserID = new Map();
        const getUserID = new Map();
        const usersChoice = new Map();

        let randNum = 0;
        let randPlayer = 0;
        let nowTurn = 0;

        let printUserList = "";
        for (let i = 0; i < setUserList.length - 1; i++) {
          printUserList += `${reactions[i]} : ${setUserList[i]}\n`;
          setUserID.set(setUserList[i], i + 1);
          getUserID.set(i + 1, setUserList[i]);
        }

        if (checkgameStep == 1) {
          interaction.reply({
            content: `게임할 사람이 모이지 않은것 같은데?\n/tgodmake를 먼저 입력해`,
            ephemeral: true,
          });
        } else if (checkgameStep == 2) {
          const message = await interaction.reply({
            content: `다음 중 본인을 제외한 이모지를 하나 눌러줘!\n${printUserList}`,
            fetchReply: true,
          });
          for (let i = 0; i < setUserList.length - 1; i++) {
            message.react(reactions[i]);
          }
          const filter = (reaction, user) => {
            return (
              reactions.includes(reaction.emoji.name) &&
              user.id !== message.author.id
            );
          };

          const collector = message.createReactionCollector({
            filter,
            time: 15000,
          });

          collector.on("collect", (reaction, user) => {
            console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
            if (reaction.emoji.name === reactions[0]) {
              usersChoice.set(setUserID.get(user.tag), 1);
            } else if (reaction.emoji.name === reactions[1]) {
              usersChoice.set(setUserID.get(user.tag), 2);
            } else if (reaction.emoji.name === reactions[2]) {
              usersChoice.set(setUserID.get(user.tag), 3);
            } else if (reaction.emoji.name === reactions[3]) {
              usersChoice.set(setUserID.get(user.tag), 4);
            } else if (reaction.emoji.name === reactions[4]) {
              usersChoice.set(setUserID.get(user.tag), 5);
            } else if (reaction.emoji.name === reactions[5]) {
              usersChoice.set(setUserID.get(user.tag), 6);
            } else if (reaction.emoji.name === reactions[6]) {
              usersChoice.set(setUserID.get(user.tag), 7);
            } else if (reaction.emoji.name === reactions[7]) {
              usersChoice.set(setUserID.get(user.tag), 8);
            } else if (reaction.emoji.name === reactions[8]) {
              usersChoice.set(setUserID.get(user.tag), 9);
            }
          });
          collector.on("end", async (collected) => {
            message.reactions
              .removeAll()
              .catch((error) =>
                console.error("Failed to clear reactions:", error)
              );
            console.log([...usersChoice]);
            randNum = Math.floor(Math.random() * 10) + 3; // 몇 번 돌건지 설정,
            console.log(`setUserList.length : ${setUserList.length}`);
            randPlayer =
              Math.floor(Math.random() * (setUserList.length - 1)) + 1;
            nowTurn = randPlayer;
            console.log(`randNum:${randNum}`);
            console.log(`randPlayer:${randPlayer}`);
            console.log(`nowTurn:${nowTurn}`);

            for (let i = 0; i < randNum; i++) {
              await interaction.editReply(
                `Rounds : ${randNum}\n현재 라운드 : ${i + 1}\n${getUserID.get(
                  nowTurn
                )} shoot ${getUserID.get(
                  usersChoice.get(setUserID.get(getUserID.get(nowTurn)))
                )}`
              );
              nowTurn = usersChoice.get(nowTurn);
              // nowTurn = usersChoice.get(nowTurn);
              //  setTimeout(() => {
              //   nowTurn = usersChoice.get(nowTurn);
              // }, 1000);
            }
            await interaction.editReply(
              `상금은 ${getUserID.get(
                usersChoice.get(setUserID.get(getUserID.get(nowTurn)))
              )}형이 싹 쓸어갔어!`
            );
          });
        }
      }
    });

    // let checkGameStep = readDataJson.gameStep;
    // console.log(`gameStep : ${checkGameStep}`);

    // if(){};

    // const user = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  },
};
