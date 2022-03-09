/* eslint-disable object-curly-newline */
/* eslint-disable array-callback-return */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-console */
require('dotenv').config();
const { Client, Intents, Collection, MessageEmbed } = require('discord.js');
const translate = require('deepl');
const LanguageDetect = require('languagedetect');
const fs = require('fs');
const guildDb = require('./utils/guilds');

const lngDetector = new LanguageDetect();
const client = new Client({ intents: [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES,
] });

// Boot
client.on('ready', async () => {
  console.log(`
    ╔═════════════════════════════════╗
    ║-->  Bot Name : ${client.user.username}
    ╟─────────────────────────────────╢
    ║-->  Prefix   : ${process.env.PREFIX}
    ╚═════════════════════════════════╝
    Prêt !
  `);
  client.user.setActivity('🚧 En développement', { type: 'WATCHING' });
});

// Commands loader
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync('./commands/');

const folders = fs.readdirSync('./commands/');
const foldernum = folders.length;

Array.from({ length: foldernum }, (x, num) => {
  fs.readdir(`./commands/${folders[num]}`, (err, file) => {
    if (err) console.log(err);

    const jsfile = file.filter((f) => f.split('.').pop() === 'js');
    if (jsfile.length <= 0) {
      console.log('❌  ->Impossible de trouver la commande !');
      return;
    }

    jsfile.forEach((f) => {
      const props = require(`./commands/${folders[num]}/${f}`);
      console.log(`✔️  -> ${f} loaded !`);
      client.commands.set(props.help.name, props);
      props.help.aliases.forEach((alias) => {
        client.aliases.set(alias, props.help.name);
      });
    });
  });
});

client.on('messageCreate', async (msg) => {
  // Dm
  if (msg.author.bot) return;
  if (msg.channel.type === 'dm') return;

  // prefix
  const prefix = process.env.PREFIX;

  // Commands
  const args = msg.content.slice(prefix.length).trim().split(' ');
  const cmd = args.shift().toLowerCase();
  let command;

  // translate
  if (!msg.content.startsWith(prefix)) {
    const guild = await guildDb.Fetch(msg.guild.id);
    if (!guild.channelsId) return;
    const channels = guild.channelsId.split(',');
    if (!channels.includes(msg.channel.id)) return;
    const detect = lngDetector.detect(msg.content, 1);
    if (!detect[0] || detect[0][0] === 'french') return;
    translate({
      free_api: true,
      text: msg.content,
      target_lang: 'FR',
      auth_key: process.env.DEEPL_KEY,
    }).then((res) => {
      if (res.data.translations[0].detected_source_language === 'FR') return;
      const embed = new MessageEmbed()
        .setColor('GREEN')
        .setDescription(`\`\`\`${res.data.translations[0].text}\`\`\``)
        .setAuthor({ name: msg.author.tag, iconURL: msg.author.displayAvatarURL() });
      msg.channel.send({ embeds: [embed] });
    }).catch((err) => {
      console.log(err);
      const embed = new MessageEmbed()
        .setColor('RED')
        .setDescription(`\`\`\`${err}\`\`\``)
        .setAuthor({ name: msg.author.tag, iconURL: msg.author.displayAvatarURL() });

      msg.channel.send({ embeds: [embed] });
    });
    return;
  }

  // Exec command
  if (client.commands.has(cmd)) {
    command = client.commands.get(cmd);
  } else {
    command = client.commands.get(client.aliases.get(cmd));
  }

  if (command) command.run(client, msg, args, prefix);
});

// Token
client.login(process.env.TOKEN);
client.on('error', console.error);
