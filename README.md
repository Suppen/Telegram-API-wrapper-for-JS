# Telegram API wrapper for JS

An unofficial JS-wrapper for the Telegram chat API. Currently focused on bots.

npm: https://www.npmjs.com/package/teleapiwrapper

Currently does not support sending files, but everything else should work.

NOTE: From v0.6.0, this no longer uses Promises. I didn't quite get the hang of them, so I went back to callbacks

## Create a new wrapper ##

var BotAPI = require("teleapiwrapper").BotAPI;

var bot = new BotAPI(botToken);

## Send a request ##

bot.getMe(function(err, res) {
	console.log(res);
});
bot.sendMessage(chatId, text);	// Callback optional
