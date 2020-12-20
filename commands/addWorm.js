const { Message, MessageReaction } = require("discord.js");

module.exports = {
    name: "addWorm",
    description: "gives worms to user; addWorm <number> <user_tag>",
    execute(message, args) {
        //if (message.member.id != message.guild.ownerID && !message.member.roles.cache.some(roles => roles.name == "Worm Queen"))
        //    message.reply("You don't have the 'Worm Queen' Role");
        if (args.length != 2) {
            message.reply("Invalid command. Use the help command to find more information on my commands");
            return;
        }

        // parsing data
        deltaWorm = parseInt(args[0]);
        targetID = args[1].replace(/[^0-9]/g, '');

        // getting data from cache
        currentWorms = message.client.WormCache.get(targetID);
        MAXWORMS = 9223372036854775808;

        if (typeof deltaWorm != 'number' || !isFinite(deltaWorm)) {
            message.reply("Invalid command parameters. Use the help command to find more information on our commands");
            return;
        }

        // checks if target exists && target is not user
        if (!message.guild.members.cache.some(member => member.id == targetID)) {
            message.reply(`User ${args[1]} does not exist`);
            return;
        }

        if (message.author.id == targetID) {
            message.reply(`You can't give yourself worms.`);
            return;
        }

        // not in cache
        if (currentWorms == undefined) {
            message.client.SQLConnection.query(`SELECT Worm_Count FROM wormdata WHERE user_ID = '${targetID}'`, function(err, result, fields) {
                if (err) throw err;
                if (result.length == 0) {
                    currentWorms = deltaWorm;
                    if (Math.abs(currentWorms) < MAXWORMS) {
                        message.client.SQLConnection.query(`INSERT INTO wormdata (user_ID, Worm_Count) VALUES (${targetID},'${deltaWorm}')`, function(err, request, fields) {
                            if (err) throw err;
                        });
                    } else {
                        message.reply("That's too many worms. How about you try with fewer worms!");
                    }
                } else {
                    currentWorms = result[0].Worm_Count + deltaWorm;
                    if (Math.abs(currentWorms) < MAXWORMS) {
                        message.client.SQLConnection.query(`UPDATE wormdata SET Worm_Count = '${currentWorms}' WHERE user_ID = ${targetID}`, function(err, request, fields) {
                            if (err) throw err;
                        });
                    } else {
                        message.reply("That's too many worms. How about you try with fewer worms!");
                    }
                }
                if (Math.abs(currentWorms) < MAXWORMS) {
                    message.channel.send(`Increasing Worm score of <@!${targetID}> by ${deltaWorm}`);
                    message.channel.send(`<@!${targetID}> now has ${currentWorms} worms`);
                }
            });
        } else {
            currentWorms += deltaWorm;
            if (currentWorms < MAXWORMS) {
                message.client.SQLConnection.query(`UPDATE wormdata SET Worm_Count = '${currentWorms}' WHERE user_ID = ${targetID}`, function(err, request, fields) {
                    if (err) throw err;
                });
                message.channel.send(`Increasing Worm score of <@!${targetID}> by ${deltaWorm}`);
                message.channel.send(`<@!${targetID}> now has ${currentWorms} worms`);
            } else {
                message.reply("That's too many worms. How about you try with fewer worms!");
            }
        }
        if (Math.abs(currentWorms) > 9223372036854775808 || currentWorms == undefined) {
            message.client.WormCache.set(targetID, undefined);
        } else {
            message.client.WormCache.set(targetID, currentWorms);
        }
    }
}