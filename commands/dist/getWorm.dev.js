"use strict";

module.exports = {
  name: 'getWorm',
  description: 'returns the current number of worms for a user; getWorm <user_tag>',
  execute: function execute(message, args) {
    if (args.length != 1 || args[0] == undefined) {
      message.reply("Invalid command. You can use the help command to find more information on our commands");
      return;
    } // parsing data


    targetID = args[0].replace(/[^0-9]/g, ''); //Gets cache data 

    currentWorms = message.client.WormTally.get(targetID); //Checks if user exists 

    if (!message.guild.members.cache.some(function (member) {
      return member.id == targetID;
    })) {
      message.reply("User ".concat(args[0], " does not exist"));
      return;
    }

    console.log(); //Data not in cache

    if (currentWorms == undefined) {
      //Check database
      //message.client.WormTally.set(targetID, 0);
      //message.client.addToDataBase('WormData', );
      message.client.SQLConnection.query("SELECT Worm_Count FROM wormdata WHERE user_ID = '".concat(targetID, "'"), function (err, result, fields) {
        if (err) throw err;
        console.log(result);

        if (result.length == 0) {
          console.log("Entry doesn't exist!");
          currentWorms = 0;
          message.client.SQLConnection.query("INSERT INTO wormdata (user_ID, Worm_Count) VALUES (".concat(targetID, ",'0')"), function (err, request, fields) {
            if (err) throw err;
            console.log('insertion');
          });
        } else {
          currentWorms = result;
        }
      });
    }

    message.reply("<@!".concat(targetID, "> has ").concat(currentWorms, " worms"));
  }
};
/*
client.addToDataBase = function(column, entries, values) {
    var query = "INSERT INTO " + column + "(";
    if (entries.length != values.length) {
        console.log(entries);
        console.log(values);
        throw new Error('Invalid Constructor Parameters');
    }
    for (j = 0; j < entries.length; j++) {
        query += entries[j];
        if (j != entries.length - 1) {
            query += ", ";
        }
    }
    query += ") VALUES ?";
    client.SQLConnection.connect(function(err) {
        if (err) throw err;
        console.log();
        client.SQLConnection.query(query, values, function(err, result) {
            if (err) throw err;
            console.log("Number of Rows Inserted: " + result.affectedRows);
        });
    })
};
client.updateDataBase = function() {
    var query = "INSERT INTO " + column + "(";
    if (entries.length != values.length) {
        console.log(entries);
        console.log(values);
        throw new Error('Invalid Constructor Parameters');
    }
    for (j = 0; j < entries.length; j++) {
        query += entries[j];
        if (j != entries.length - 1) {
            query += ", ";
        }
    }
    query += ") VALUES ?";
    client.SQLConnection.connect(function(err) {
        if (err) throw err;
        console.log();
        client.SQLConnection.query(query, values, function(err, result) {
            if (err) throw err;
            console.log("Number of Rows Inserted: " + result.affectedRows);
        });
    })
};
*/