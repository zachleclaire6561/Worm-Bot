"use strict";

var _require = require("discord.js"),
    Message = _require.Message,
    MessageReaction = _require.MessageReaction;

module.exports = {
  name: "addWorm",
  description: "Adds Worms to User; addWorm <number> <user_tag>",
  execute: function execute(message, args) {
    //if (message.member.id != message.guild.ownerID && !message.member.roles.cache.some(roles => roles.name == "Worm Queen"))
    //        message.reply("You don't have the 'Worm Queen' Role");
    if (args.length != 2) {
      message.reply("Invalid command. Use the help command to find more information on my commands");
      return;
    } // parsing data


    deltaWorm = parseInt(args[0]);
    targetID = args[1].replace(/[^0-9]/g, '');
    currentWorms = message.client.WormTally.get(targetID);

    if (typeof deltaWorm != 'number' || !isFinite(deltaWorm)) {
      message.reply("Invalid command parameters. Use the help command to find more information on our commands");
      return;
    } // checks if target exists && target is not user


    if (!message.guild.members.cache.some(function (member) {
      return member.id == targetID;
    })) {
      message.reply("User ".concat(args[1], " does not exist"));
      return;
    }

    if (message.author.id == targetID) {
      message.reply("You can't give yourself worms.");
      return;
    }

    if (currentWorms == undefined) {
      currentWorms = deltaWorm;
    } else {
      currentWorms += deltaWorm;
    }

    message.client.WormTally.set(targetID, currentWorms); //console.log(`Parsed Data: ${deltaWorm}; ${target}; ${args[1]}`);

    message.channel.send("Increasing Worm score of <@!".concat(targetID, "> by ").concat(deltaWorm));
    message.channel.send("<@!".concat(targetID, "> now has ").concat(message.client.WormTally.get(targetID), " worms"));
  }
};