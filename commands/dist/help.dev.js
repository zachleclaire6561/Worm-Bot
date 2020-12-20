"use strict";

var Discord = require('discord.js');

var _require = require('http'),
    IncomingMessage = _require.IncomingMessage;

module.exports = {
  name: 'help',
  description: 'HELP ME.',
  execute: function execute(message, args) {
    var desc = "\n";
    message.client.commands.forEach(function (element) {
      return desc += element.name + ": " + element.description + "\n\n";
    });
    var helpEmbed = new Discord.MessageEmbed().setColor('4AE383').setTitle('Mr. Worm Commands').setDescription(desc).setTimestamp().setFooter('Hell inc.');
    message.reply(helpEmbed);
  }
};