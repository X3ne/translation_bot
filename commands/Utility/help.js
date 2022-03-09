/* eslint-disable object-shorthand */
/* eslint-disable no-useless-concat */
/* eslint-disable consistent-return */
/* eslint-disable no-undef */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-shadow */
const { stripIndents } = require('common-tags');
const Discord = require('discord.js');
const { ErrorEmbed, SuccessEmbed, GetColor } = require('../../utils/functions');

module.exports.run = async (client, msg, args, prefix) => {
  // Command
  if (!args[0]) {
    function getAll(client, msg) {
      const embed = new Discord.MessageEmbed()
        .setColor(GetColor(msg))
        .setTitle(`**Help \`${prefix}\`**`);

      const commands = (category) => client.commands
        .filter((cmd) => cmd.help.category === category)
        .map((cmd) => `${cmd.help.name}`)
        .join(', ');

      const info = client.categories
        .map((cat) => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n \`\`\`${commands(cat) || 'None'}\`\`\` `)
        .reduce((string, category) => `${string}\n${category}\n`);

      embed.setDescription(info).setTimestamp(new Date()).setFooter(`${client.user.username}` + ' | ' + `${msg.author.username}`, `${client.user.avatarURL()}`);
      return msg.channel.send({ embeds: [embed] });
    }

    return getAll(client, msg);
  }
  function getCMD(client, msg, input) {
    const cmd = client.commands.get(input.toLowerCase())
    || client.commands.get(client.aliases.get(input.toLowerCase()));

    const info = `**Aucune information trouvée pour cette commande \`${input.toLowerCase()}\`**`;

    if (!cmd) {
      return ErrorEmbed(msg, info);
    }

    const cname = cmd.help.name;
    if (cmd.help.aliases.length < 1) caliases = 'None';
    if (cmd.help.aliases.length > 1) caliases = cmd.help.aliases;
    if (cmd.help.description.length < 1) description = 'None';
    if (cmd.help.description.length > 1) description = cmd.help.description;
    if (cmd.help.usage.length < 1) usage = 'None';
    if (cmd.help.usage.length > 1) usage = cmd.help.usage;
    const { category } = cmd.help;

    if (cmd.help.name) {
      const embed = new Discord.MessageEmbed()
        .setTitle(`**${cname}**`)
        .setColor(GetColor(msg))
        .setDescription(`**Name : \`\`\`${cname}\`\`\`**
          \n**Aliases : \`\`\`${caliases}\`\`\`**
          \n**Description : \`\`\`${description}\`\`\`**
          \n**Usage : \`\`\`${usage}\`\`\`**
          \n**Category : \`\`\`${category}\`\`\`**`)
        .setTimestamp(new Date())
        .setFooter(`${client.user.username}` + ' | ' + `${msg.author.username}`, `${client.user.avatarURL()}`);
      return msg.channel.send({ embeds: [embed] });
    }
    return SuccessEmbed(msg, info);
  }

  return getCMD(client, msg, args[0]);
};

module.exports.help = {
  name: 'help',
  aliases: [],
  description: "Affiche la page d'aide du bot",
  usage: 'help {commande}',
  category: 'Utility',
};
