var Discord = require('discord.io');
var auth = require('./auth.json');
var feed = require("feed-read-parser");
const mysql = require('mysql');
var SqlString = require('sqlstring');

var title = "";
var a;
let prefix = "v!"
let channel_id = "UCZ-oWkpMnHjTJpeOOlD80OA"
let database = {
	host : "localhost",
	user: "mrthomas20121",
	password: "mrthomas20121",
	database: "vandiland"
}

feed(`https://www.youtube.com/feeds/videos.xml?channel_id=${channel_id}`, (err, articles) => {
    // Each article has the following properties:
    //
    //   * "title"     - The article title (String).
    //   * "author"    - The author's name (String).
    //   * "link"      - The original article link (String).
    //   * "content"   - The HTML content of the article (String).
    //   * "published" - The date that the article was published (Date).
    //   * "feed"      - {name, source, link}
    //
    if(err) {
        console.log(err);
    }
		title = articles[0].title;
		a = articles;
    //myFeed = articles[0].link;
});

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', (event) => {
    console.log('Logged in as %s - %s\n', bot.username, bot.id);
	//console.log(event)
	setTimeout(() => {
		feed(`https://www.youtube.com/feeds/videos.xml?channel_id=${channel_id}`, function(err, articles) {
			
			if(err) throw err;
			if(a[0].title == articles[0].title || a == articles) {
					// both date are the same
			}
			else {
				title = articles[0].title;
				bot.sendMessage({
					to: '363656716056788992',
					message: `<@&335505885294231554> Vandiril uploaded a new video! ${articles[0].link}`
				});
			}
		});
	}, 1000);
});

bot.on('message', (user, userID, channelID, message, event) => {
    if(message.startsWith(prefix)) {
      let cmd = message.slice(prefix.length).split(" ");
			if(cmd[0] == "warn") {
				bot.sendMessage({
					to:channelID,
					message:`*${event.d.mentions[0].username} have been warned*`
				});
				let reason = cmd.slice(2).join(" ").toString();
				bot.sendMessage({
					to:event.d.mentions[0].id,
					message:`you have been warned by **${user}** in **${bot.channels[channelID].name}** for : ***${reason}.*** \nplease don't do that again thanks.`
				});
				var con = mysql.createConnection({
					host: database.host,
					user: database.user,
					password: database.password,
					database: database.database
				});
				
				con.connect(function(err) {
					con.query(`INSERT INTO warns VALUES (${SqlString.escape(event.d.mentions[0].id)}, ${SqlString.escape(event.d.mentions[0].username)}, ${SqlString.escape(reason)}, ${SqlString.escape(bot.channels[channelID].name)}, ${SqlString.escape(user)})`, function (err, result, fields) {
						if (err) throw err;
						//console.log(result);
					});
					con.end(function(err) {
						//console.log(err);
					})
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
