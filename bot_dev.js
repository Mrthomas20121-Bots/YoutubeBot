const Discord = require('discord.io');
const fs = require('fs');
const request = require('request');

/*
 auth: {
	 token,
	 _token,
	 apikey,
	 id
 }
*/
var auth = require('./auth.json');

var prefix = "v!"
var d = new Date();
var channel = `https://www.googleapis.com/youtube/v3/search?key=${auth.apikey}&channelId=${auth.id}&part=snippet,id&order=date&maxResults=1`

request.get(channel, (err, res, body) => {
	let item = JSON.parse(body).items[0];
	d = new Date(item.snippet.publishedAt);
});

// Initialize Discord Bot
var bot = new Discord.Client({
   token: /*auth._token*/auth._token,
   autorun: true
});
bot.on('ready', (event) => {
		console.log('Logged in as %s', bot.username);
		
		setInterval(() => {
			request.get(channel, (err, res, body) => {
				if(err) throw err;
				let item = JSON.parse(body).items[0]
				let itemDate = new Date(item.snippet.publishedAt);
				console.log(itemDate<d);
				if(itemDate<d) {
					let videoid = item.id.videoId;
					var videoUrl = `https://www.youtube.com/watch?v=${videoid}`
					// size = itemDate;
					bot.sendMessage({
						to:'363656716056788992',
						message:videoUrl
					}, (err, res) => {
						if(err) throw err;
						console.log(`new video ${videoUrl}`);
					});
					d=itemDate;
				}
			});
		}, 5000);
});

bot.on('message', (user, userID, channelID, message, event) => {

	if(message.startsWith(prefix)) {
		let args = message.slice(prefix.length).split(" ");
		if(args[0] == "latestvid") {
			request.get(channel, (err, res, body) => {
				let videoid = JSON.parse(body).items[0].id.videoId;
				bot.sendMessage({
					to:channelID,
					message:`https://www.youtube.com/watch?v=${videoid}`
				}, (err1, res1) => {
					if(err1) throw err1;
				});
			});		
		}
	}
});

bot.on('disconnect', (errMsg, code) => {
    if(errMsg) {
      console.log(errMsg);
    }
    console.log(code);
    bot.connect();
});
