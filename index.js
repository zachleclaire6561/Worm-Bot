const Discord = require('discord.js');
const { prefixSub, prefixAdd, prefixGet, prefixSet, wormlistpath, token} = require('./config.json');
const client = new Discord.Client();
var fileSystem = require('fs');
const { CronJob } = require('cron');
var updateFile = require("cron").CronJob;

let wormList = new Discord.Collection();

client.once('ready', () => {
    console.log('Ready!');
    
});

new CronJob("00 00 7* * 0", function(){

}, null, true)

function setWorm(id, worms){
  if(!isNaN(worms)){
    wormList.set(id, worms)
  }
}

function displayWorms(id, channel){
  var worms = getWorms(id);
  if(wormList.get(id) > 0){
    channel.send(id + " has +" + wormList.get(id) + " worm");  
  }
  else{
    channel.send(id + " has " + wormList.get(id) + " worm");  
  }
}

function getWorms(id){
  let worms = wormList.get(id);
  if(!isNaN(worms)){
    return worms;
  }
  else{
    wormList.set(id, 0);
    return NaN;
  }
}

client.on('message', message => {
    if((message.content.startsWith(`${prefixSub}`) || message.content.startsWith(`${prefixAdd}`))){
        var msg = message.content.split(' ');
        let wormCount = parseInt(msg[1], 10);
        var id = msg[2];
        
        var factor = 0;
        if(!isNaN(wormCount)){
          if(message.content.startsWith(`${prefixSub}`)){
            factor = -1;
            message.channel.send(id + " has lost " + wormCount + " worms.");
          }
          if(message.content.startsWith(`${prefixAdd}`)){
            factor = 1;
            message.channel.send(id + " has gained " + wormCount + " worms.");
          }
        }
        else{
          message.channel.send(message.author.tag + " invalid number of worms. Please try again");
        }
        getWorms(id);
        setWorm(id, wormList.get(id) + factor*wormCount);
        displayWorms(id, message.channel);
    }
    if(message.content.startsWith(`${prefixSet}`)){
      var msg = message.content.split(' ');
      var wormCount = msg[1];
      var id = msg[2];
      setWorm(id, wormCount);
      displayWorms(id, message.channel);
    }
    if(message.content.startsWith(`${prefixGet}`)){
      var msg = message.content.split(' ');
      var id = msg[1];
      displayWorms(id, message.channel);
    }
  });

  client.on('guildMemberAdd', member => {
    // adding them to list
    getWorms(member.id);
  });    

client.login(token);
