const Discord = require('discord.js');
const { CronJob } = require('cron');
const { prefixSub, prefixAdd, prefixGet, prefixSet, wormlistpath, token} = require('./config.json');
const client = new Discord.Client();
const cronJob = require('cron').CronJob;
var fileSystem = require('fs');
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
    console.log("all worms loaded from " + wormlistpath);

    updateFile.start();
    console.log("periodic file updating started");

    console.log("Ready!");
    client.user.setActivity("Powered by the souls of dead worms");
});

var updateFile = new cronJob("*/10 * * * * *", function(){
    var list = wormList.keyArray();
    list.forEach(element => function(){
      if(element === null){
        wormList.delete(element);
      }
    });
    fileSystem.writeFileSync(wormlistpath, JSON.stringify([...wormList]), function(err){
      if (err) {
        return console.log(err);
      }
      console.log();
    });
    const d = new Date();
    console.log("logged @", d);
})

function setWorm(id, worms, message){
  if(!isNaN(worms)){
    try{
      wormList.set(id, worms);
    }
    catch(err){
      console.error(err);
      message.channel.send("Invalid command usage. Please check the guide on using commands");
    }
  }
}


function setWorm(id, worms){
  if(!isNaN(worms)){
    try{
      wormList.set(id, worms)
    }
    catch(err){
      console.log("Invalid id");
    }
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
    if(id != 'undefined'){
      wormList.set(id, 0);
    }
    return NaN;
  }
}

function displayAll(){
  wormList.forEach(element => console.log(element));
}

let getNumUsers = function(message, id){
  var num;
  message.guild.members.fetch().then(fetchedMembers => {
      num = fetchedMembers.filter(member => member.id == id).size;
      console.log(num);
      return num;
   });

 //  console.log(num);
  // return num;
}

client.on('message', message => {
    // First we use guild.members.fetch to make sure all members are cached
    
    console.log("value: " + getNumUsers(message, message.author.id));   /* if(getNumUsers(message, message.author.id) == 1){
      message.channel.send("You da person");
    }
    
    else{
      message.channel.send("You not da person");
    }
    */

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
        setWorm(id, wormList.get(id) + factor*wormCount, message);
        displayWorms(id, message.channel);
    }
    if(message.content.startsWith(`${prefixSet}`)){
      var msg = message.content.split(' ');
      var wormCount = msg[1];
      var id = msg[2];
      setWorm(id, wormCount, message);
      displayWorms(id, message.channel);
    }
    if(message.content.startsWith(`${prefixGet}`)){
      var msg = message.content.split(' ');
      var id = msg[1];
      if(id === null){
        displayAll();
        message.channel.send(message.author.tag + " invlaid user ID. Please tell me who you are talking about");
      }
      else{
        displayWorms(id, message.channel);
      }
    }
  });

  client.on('guildMemberAdd', member => {
    // adding them to list
    getWorms(member.id);
  });

client.login(token);