const Discord = require('discord.js');
const { IncomingMessage } = require('http');

module.exports = {
    name: 'help',
    description: 'HELP ME.',
    execute(message, args) {
        let desc = "\n"
        message.client.commands.forEach(element => desc += (element.name + ": " + element.description + "\n\n"));
        const helpEmbed = new Discord.MessageEmbed()
            .setColor('4AE383')
            .setTitle('Mr. Worm Commands')
            .setDescription(desc)
            .setTimestamp()
            .setFooter('Hell inc.');
        message.reply(helpEmbed);
    }
}