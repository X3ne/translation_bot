const Discord = require('discord.js');

const embed = new Discord.MessageEmbed();

function ErrorEmbed(msg, text) {
  embed.setColor('RED').setDescription(text);
  msg.channel.send({ embeds: [embed] });
}

function SuccessEmbed(msg, text) {
  embed.setColor('GREEN').setDescription(text);
  msg.channel.send({ embeds: [embed] });
}

function GetColor(msg) {
  let color = msg.member.displayHexColor;
  if (color === '#000000') color = 'RANDOM';

  return color;
}

module.exports = {
  ErrorEmbed,
  SuccessEmbed,
  GetColor,
};
