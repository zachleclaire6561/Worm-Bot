module.exports = {
    name: 'getWorm',
    description: 'returns the current number of worms for a user; getWorm <user_tag>',
    execute(message, args) {
        if (args.length != 1 || args[0] == undefined) {
            message.reply("Invalid command. You can use the help command to find more information on our commands");
            return;
        }

        // parsing data
        targetID = args[0].replace(/[^0-9]/g, '');

        //Checks if user exists
        if (!message.guild.members.cache.some(member => member.id == targetID)) {
            message.reply(`User ${args[0]} does not exist`);
            return;
        }

        //Gets cache data 
        currentWorms = message.client.WormCache.get(targetID);

        //Data not in cache
        if (currentWorms == undefined) {
            message.client.SQLConnection.query(`SELECT Worm_Count FROM wormdata WHERE user_ID = '${targetID}'`, function(err, result, fields) {
                if (err) throw err;
                if (result.length == 0) {
                    currentWorms = 0;
                    message.client.SQLConnection.query(`INSERT INTO wormdata (user_ID, Worm_Count) VALUES (${targetID},'0')`, function(err, request, fields) {
                        if (err) throw err;
                    });
                } else {
                    currentWorms = result[0].Worm_Count;
                }
                message.reply(`<@!${targetID}> has ${currentWorms} worms`);
                message.client.WormCache.set(targetID, currentWorms);
            });
        } else {
            message.reply(`<@!${targetID}> has ${currentWorms} worms`);
        }
    }
}