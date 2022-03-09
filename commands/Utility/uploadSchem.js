/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
const Discord = require('discord.js');
const request = require('request');
const fs = require('fs');
const guildDb = require('../../utils/guilds');
const { ErrorEmbed } = require('../../utils/functions');

function download(url) {
  request.get(url)
    .on('error', console.error)
    .pipe(fs.createWriteStream('meme.png'));
}

module.exports.run = async (client, msg, args) => {
  // Command
  if (msg.attachements.first()) {
    download(msg.attachments.first().url);
  }
};

module.exports.help = {
  name: 'bite',
  aliases: ['hty'],
  description: 'Upload a schematic file to the server',
  usage: 'upload',
  category: 'Utility',
};
