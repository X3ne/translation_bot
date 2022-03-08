/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable no-loop-func */
const Discord = require('discord.js');
const guildDb = require('../../utils/guilds');
const { ErrorEmbed, SuccessEmbed, GetColor } = require('../../utils/functions');

module.exports.run = async (client, msg, args, prefix) => {
  // Command
  if (!msg.channel.permissionsFor(msg.author).has(Discord.Permissions.FLAGS.MANAGE_CHANNELS)) return ErrorEmbed(msg, '**You need the `Manage Channels` permission to use this command!**');
  if (!args[0]) return ErrorEmbed(msg, '**Please specify an array of channels id to use translations**');
  const array = [];
  for (let i = 0; i < args.length; i++) {
    const channel = msg.guild.channels.cache.find((c) => c.id === args[i]);
    if (!channel) return ErrorEmbed(msg, '**Invalid channel id**');
    if (channel.type === 'GUILD_VOICE') return ErrorEmbed(msg, '**You can\'t use voice channels as translations**');
    if (!channel.permissionsFor(client.user).has(Discord.Permissions.FLAGS.SEND_MESSAGES)) return ErrorEmbed(msg, '**I need the `Send Messages` permission to send messages in this channel!**');
    if (array.indexOf(channel.id) > -1) return ErrorEmbed(msg, '**You can\'t use the same channel twice**');
    array.push(channel.id);
  }
  await guildDb.SetTranslateChannels(msg.guild.id, array.join(','));
  const embed = new Discord.MessageEmbed()
    .setColor('GREEN')
    .setDescription('**Successfully set the translation channels**');
  // eslint-disable-next-line array-callback-return
  array.map((id) => {
    const channel = msg.guild.channels.cache.find((c) => c.id === id);
    embed.addField(channel.name, channel.id, true);
  });
  msg.channel.send({ embeds: [embed] });
};

module.exports.help = {
  name: 'changechannels',
  aliases: ['cc'],
  description: 'Change the channels where the bot sends translations',
  usage: 'changelanguage [channels ids]',
  category: 'Settings',
};
