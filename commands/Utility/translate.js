/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
const Discord = require('discord.js');
const translate = require('deepl');
const usersDb = require('../../utils/users');
const { ErrorEmbed } = require('../../utils/functions');
const { availableLanguages } = require('../../settings');

function translateMessage(msg, message, lang) {
  translate({
    free_api: true,
    text: message.content,
    target_lang: lang,
    auth_key: process.env.DEEPL_KEY,
  }).then((res) => {
    const embed = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setDescription(`\`\`\`${res.data.translations[0].text}\`\`\``)
      .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() });
    msg.channel.send({ embeds: [embed] });
  }).catch((err) => {
    console.log(err);
    const embed = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription(`\`\`\`${err}\`\`\``)
      .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() });

    msg.channel.send({ embeds: [embed] });
  });
}

module.exports.run = async (client, msg, args, prefix) => {
  // Command
  if (!args[0]) return ErrorEmbed(msg, '**Usage <lang> [text or message id to translate]**');

  let lang = args[0].toUpperCase();
  let message;
  const user = await usersDb.Fetch(msg.author.id);
  if (availableLanguages.indexOf(lang) < 0) {
    lang = user.lang;
    message = args.join(' ');
  } else {
    message = args.slice(1).join(' ');
  }
  if (parseInt(args[1], 10)) {
    // eslint-disable-next-line arrow-body-style
    msg.channel.messages.fetch(args[1]).then((res) => {
      translateMessage(msg, res, lang);
    // eslint-disable-next-line arrow-body-style
    }).catch((err) => {
      return ErrorEmbed(msg, '**Invalid message id**');
    });
  } else {
    translate({
      free_api: true,
      text: message,
      target_lang: lang,
      auth_key: process.env.DEEPL_KEY,
    }).then((res) => {
      const embed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setDescription(`\`\`\`${res.data.translations[0].text}\`\`\``)
        .setAuthor({ name: msg.author.tag, iconURL: msg.author.displayAvatarURL() });
      msg.channel.send({ embeds: [embed] });
    }).catch((err) => {
      console.log(err);
      const embed = new Discord.MessageEmbed()
        .setColor('RED')
        .setDescription(`\`\`\`${err}\`\`\``)
        .setAuthor({ name: msg.author.tag, iconURL: msg.author.displayAvatarURL() });
      msg.channel.send({ embeds: [embed] });
    });
  }
};

module.exports.help = {
  name: 'translate',
  aliases: ['ts'],
  description: 'Translate a message or text',
  usage: 'translate <lang> [text or message id to translate]',
  category: 'Utility',
};
