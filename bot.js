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
      setWorm(lines[2*i+1], lines[2*i+2]);
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
      if(isUser(element)){
        wormList.delete(element);
      }
    });
    fileSystem.writeFileSync(wormlistpath, JSON.stringify([...wormList]), function(err){
      if (err) {
        return console.log(err);
      }
    });
    const d = new Date();
    console.log("logged @", d);
})

function parseID(id){
  if(!isNaN(id)){
    console.log(id + "Skipped bc valid");
    return id;
  }
  try{
  let parseids = id.split(/[^0-9|,]/);
  return parseids[3];
  }
  catch(err){
    console.error(err);
    return null;
  }
}

function newLine(){
  console.log("-------------------------------");
}

function setWorm(id, worms, message){
  let parsedID = parseID(id);
  if(!isNaN(worms)&& isUser(parsedID)){
    try{
      wormList.set(parsedID, worms);
    }
    catch(err){
      console.error(err);
      message.channel.send("Invalid command usage. Please check the guide on using commands");
    }
  }
  else{
    message.channel.send("Invalid command usage. Please check the guide on using commands");
  }
}

function setWorm(id, worms){
  let parsedID = parseID(id);
  if(!isNaN(worms)&& isUser(parsedID)){
    try{
      wormList.set(parsedID, worms);
    }
    catch(err){
      console.log("Invalid id");
    }
  }
}

function displayWorms(id, channel){
  let parsedID = parseID(id);
  var worms = getWorms(parsedID);
  if(wormList.get(parsedID) > 0){
    channel.send(id + " has +" + worms + " worm");  
  }
  else{
    channel.send(id + " has " + worms + " worm");  
  }
}

function getWorms(id){
  let parsedID = parseID(id);
  let worms = wormList.get(parsedID);
  if(!isNaN(worms)&&isUser(parsedID)){
      return worms;
  }
  else{
    if(isUser(parsedID)){
      console.log('User ' + id + ' record initialized');
      wormList.set(parsedID, 0);
      return 0;
    }
    else{
      console.log("User "+ id + " does not exist");
      return NaN;
    }
  }
}

function displayAll(){
  wormList.forEach(element => console.log(element));
}

function isUser(id){
  if(id != null){
    return true;
  }
  else{
    return false;
  }
  /*
  message.guild.members.fetch().then(fetchedMembers => {
      fetchedMembers.forEach(member => function(){
        if(member.id == id){
          return true;
        }
      });
      return false;
   });
  */ 
}

client.on('message', message => {
    // First we use guild.members.fetch to make sure all members are cached
    
    //console.log("value: " + isUser(message, message.author.id));
    /* if(getNumUsers(message, message.author.id) == 1){
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
        var factor;
        if(!isNaN(wormCount)){
          if(message.content.startsWith(`${prefixSub}`)){
            factor = -1;
            message.channel.send(id + " has lost " + wormCount + " worms.");
          }
          if(message.content.startsWith(`${prefixAdd}`)){
            factor = 1;
            message.channel.send(id + " has gained " + wormCount + " worms.");
          }
          setWorm(id, parseInt(getWorms(id)) + factor*wormCount, message);
          displayWorms(id, message.channel);
        }
        else{
          message.channel.send(message.author.tag + " invalid number of worms. Please try again");
        }
        //getWorms(id);
    }
    if(message.content.startsWith(`${prefixSet}`)){
      var msg = message.content.split(' ');
      var wormCount = parseInt(msg[1],10);
      var id = msg[2];
      if(isUser(id)){
        setWorm(id, wormCount, message);
        displayWorms(id, message.channel);
      }
      else{
        message.channel.send(message.author.tag + " invlaid user ID. Please tell me who you are talking about");
      }
    }
    if(message.content.startsWith(`${prefixGet}`)){
      var msg = message.content.split(' ');
      var id = msg[1];
      ///var parsedID = parseID(id);

      if(id == null){
        displayAll();
        message.channel.send(message.author.tag + " invalid user ID. Please tell me who you are talking abouokt");
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