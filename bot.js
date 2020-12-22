//dependencies
const Discord = require('discord.js');
const fs = require('fs');
const { prefix, token, myDB, hostID, username, password } = require('./config.json');
/*
var mysql = require('mysql');

var con = mysql.createConnection({
    host: hostID,
    user: username,
    password: password,
    database: myDB
});
*/

client = new Discord.Client();
client.commands = new Discord.Collection();
// Cache for Worm Count
client.WormCache = new Discord.Collection();
client.RaceCache = new Discord.Collection();
/*
client.SQLConnection = con;

client.SQLConnection.connect(function(err) {
    if (err) throw err;
    console.log("Connected to Database!");
});
*/
// importing commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
let commandCount = 1;
console.group(`Loading ${commandFiles.length} Files`);
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log(`${commandCount}/${commandFiles.length} command ${command.name} loaded`);
    commandCount++;
}
console.groupEnd();
console.log('Files loaded Successfully');

client.once('ready', () => {
    client.user.setPresence({
        status: 'online',
        activity: {
            name: 'Eating the souls of dead worms',
            type: 'PLAYING',
            url: 'https://www.google.com'
        }
    })

    client.on('message', message => {
        if (message.content.startsWith(prefix)) {
            let command = message.content.split(' ')[0];
            command = command.slice(prefix.length, command.length);
            // check if command exists before proceding
            if (!client.commands.has(command)) return;
            if (command == "help")
                console.log('help command called');
            try {
                let args = message.content.split(' ');
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
                message.reply(`there was an error trying to execute the '${command}' command!`);
            }
        }
    });
});

client.login(token);