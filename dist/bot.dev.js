"use strict";

//dependencies
var Discord = require('discord.js');

var fs = require('fs');

var _require = require('./config.json'),
    prefix = _require.prefix,
    token = _require.token,
    myDB = _require.myDB,
    hostID = _require.hostID,
    username = _require.username,
    password = _require.password;

var mysql = require('mysql');

var con = mysql.createConnection({
  host: hostID,
  user: username,
  password: password,
  database: myDB
});
client = new Discord.Client();
client.commands = new Discord.Collection(); // Cache for Worm Count

client.WormTally = new Discord.Collection();
client.RaceCache = new Discord.Collection();
client.SQLConnection = con;
client.SQLConnection.connect(function (err) {
  if (err) throw err;
  console.log("Connected to Database!");
}); // importing commands

var commandFiles = fs.readdirSync('./commands').filter(function (file) {
  return file.endsWith('.js');
});
var commandCount = 1;
console.group("Loading ".concat(commandFiles.length, " Files"));
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = commandFiles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var file = _step.value;

    var command = require("./commands/".concat(file));

    client.commands.set(command.name, command);
    console.log("".concat(commandCount, "/").concat(commandFiles.length, " command ").concat(command.name, " loaded"));
    commandCount++;
  }
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator["return"] != null) {
      _iterator["return"]();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}

console.groupEnd();
console.log('Files loaded Successfully');
client.once('ready', function () {
  client.user.setPresence({
    status: 'online',
    activity: {
      name: 'Eating the souls of dead worms',
      type: 'PLAYING',
      url: 'https://www.google.com'
    }
  });
  client.on('message', function (message) {
    if (message.content.startsWith(prefix)) {
      var command = message.content.split(' ')[0];
      command = command.slice(prefix.length, command.length); // check if command exists before proceding

      if (!client.commands.has(command)) return;
      if (command == "help") console.log('help command called');

      try {
        var args = message.content.split(' ');
        args.shift();

        for (i = 0; i < args.length; i++) {
          if (args[i] == '') {
            args.splice(i, 1);
            i--;
          }
        }

        client.commands.get(command).execute(message, args);
      } catch (error) {
        console.error(error);
        message.reply("there was an error trying to execute the '".concat(command, "' command!"));
      }
    }
  });
});
client.login(token);