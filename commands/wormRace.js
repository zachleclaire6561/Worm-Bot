const cron = require('cron');

module.exports = {
    name: 'wormRace',
    description: 'Under Development',
    execute(message, args) {
        if (args.length != 1) {
            message.reply("Invalid command. This command has the format '=WormCount <amount of worms> <User tag>'");
            return;
        }
        var cronJob = cron.CronJob;
        var race = new cronJob('/100 * * * * * *', function() {
            let race = '|' + '/n' +
                '|' + '/n';
            message.channel.send(race);
            /*
             if () {
                 wormCount = message.client.WormTally.get(message.author.id)
                 message.cliet.commands.get('addWorm').execute(message, '${}');
             }
             */
        }, null, null, 'America/Los_Angeles');
    }
}