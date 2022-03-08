/* eslint-disable consistent-return */
const Discord = require('discord.js');
const { ErrorEmbed, SuccessEmbed } = require('../../utils/functions');
const usersDb = require('../../utils/users');
const { availableLanguages, languagesFlags } = require('../../settings');

module.exports.run = async (client, msg, args) => {
  // Command
  const embed = new Discord.MessageEmbed();
  if (!args[0]) return ErrorEmbed(msg, '**Please specify a language to change to.**');

  const newLanguage = args[0].toUpperCase();
  if (availableLanguages.indexOf(newLanguage) < 0) {
    embed.setColor('RED')
      .setTitle('**Invalid language!**')
      .setDescription('**Available languages:**');
    // eslint-disable-next-line array-callback-return
    availableLanguages.map((lang) => {
      embed.addField(lang, languagesFlags[availableLanguages.indexOf(lang)], true);
    });
    return msg.channel.send({ embeds: [embed] });
  }
  await usersDb.SetLang(msg.author.id, newLanguage);
  SuccessEmbed(msg, `**Language changed to ${languagesFlags[availableLanguages.indexOf(newLanguage)]} ${newLanguage}!**`);
};

module.exports.help = {
  name: 'changelanguage',
  aliases: ['setlang', 'lang'],
  description: 'To change your language',
  usage: '',
  category: 'Settings',
};
