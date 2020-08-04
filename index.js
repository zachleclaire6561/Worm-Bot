const Discord = require('discord.js');
const { CronJob } = require('cron');
const { prefixSub, prefixAdd, prefixGet, prefixSet, wormlistpath, token} = require('./config.json');
const client = new Discord.Client();
const cronJob = require("cron").CronJob;
var fileSystem = require('fs');
const { isNullOrUndefined } = require('util');
let wormList = new Discord.Collection();

client.once('ready', () => {
    fileSystem.openSync(wormlistpath, 'r');
    var contents = fileSystem.readFileSync(wormlistpath, 'utf8');
    var lines = contents.split(/[^0-9|-]+/);
    
    //lines.forEach(element => console.log(element));
    for(var i = 0; i < lines.length/2-1; i ++){
      console.log("id#" + lines[2*i+1] + "; worms: " + lines[2*i+2]);
      setWorm(lines[2*i+1], lines[2*i+2])
    }
    console.log('all worms loaded from ' + wormlistpath);

    updateFile.start();
    console.log('periodic file updating started');

    console.log('Ready!');
});

var updateFile = new cronJob('*/10 * * * * *', function(){
    wormList.forEach(element => fileSystem.writeFileSync(wormlistpath, JSON.stringify([...wormList]), function(err){
      if (err) {
        return console.log(err);
      }
      console.log();
    }));
    const d = new Date();
    console.log('logged @', d);
})

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

function displayAll(){
  wormlistpath.forEach(element => console.log(element));
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
      if(id != 'undefined'){
        displayAll();
      }
      displayWorms(id, message.channel);
    }
  });

  client.on('guildMemberAdd', member => {
    // adding them to list
    getWorms(member.id);
  });    

client.login(token);
