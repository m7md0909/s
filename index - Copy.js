const {
  Client,
  Intents,
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");
const rules = require("./rules.json");
const fs = require("fs");
const { startServer } = require("./alive.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.once("ready", () => {
  console.log(`Bot is Ready! ${client.user.tag}`);
  console.log(`Code by Wick Studio`);
  console.log(`discord.gg/wicks`);
});

client.on("messageCreate", async (message) => {
  if (message.content === "!rules") {
    if (message.member.permissions.has("ADMINISTRATOR")) {
      const row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("select")
          .setPlaceholder("قائمة القوانين")
          .addOptions(
            rules.map((rule) => ({
              label: rule.title,
              description: rule.id,
              value: rule.id,
            })),
          ),
      );

      const embed = new MessageEmbed()
        .setColor("#f8ca3d")
        .setThumbnail(
          "https://media.discordapp.net/attachments/911577714501226556/1263090399812128788/output-onlinegiftools.gif?ex=6698f81a&is=6697a69a&hm=7d28006f66a28d99f52e181405bfefb38665f15a3c3ea197d34e3868cdc59809&=",
        )
        .setTitle("قوانين السيرفر")
        .setDescription(
          "**الرجاء اختيار احد القوانين لقرائته من قائمة الاختيارات تحت**",
        )
        .setImage(
          "https://media.discordapp.net/attachments/911577714501226556/1263090400256589875/bnr.webp?ex=6698f81a&is=6697a69a&hm=0e0aa7a392f149a17ec2ca2ba7bc1d1a5097b13f575ca3736532134837367610&=&format=webp",
        )
        .setFooter({ text: "Rules Bot" })
        .setTimestamp();

      const sentMessage = await message.channel.send({
        embeds: [embed],
        components: [row],
      });
      await message.delete();
    } else {
      await message.reply({
        content: "You need to be an administrator to use this command.",
        ephemeral: true,
      });
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isSelectMenu()) {
    const rule = rules.find((r) => r.id === interaction.values[0]);
    const text = fs.readFileSync(rule.description, "utf-8");
    const ruleEmbed = new MessageEmbed()
      .setColor("#841b1b")
      .setTitle(rule.title)
      .setDescription(text)
      .setFooter({ text: "Rules Bot" })
      .setTimestamp();

    await interaction.reply({ embeds: [ruleEmbed], ephemeral: true });
  }
});

startServer();

client.login(process.env.TOKEN);
