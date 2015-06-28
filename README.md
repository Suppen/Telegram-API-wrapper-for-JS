# Telegram API wrapper for JS

An unofficial JS-wrapper for the Telegram chat API. Currently focused on bots.

**Supports ALL methods in the API**

npm: [https://www.npmjs.com/package/teleapiwrapper](https://www.npmjs.com/package/teleapiwrapper)
github: [https://github.com/Suppen/Telegram-API-wrapper-for-JS](https://github.com/Suppen/Telegram-API-wrapper-for-JS)

Official API-documentation: [https://core.telegram.org/bots/api](https://core.telegram.org/bots/api)

**Now supports sending files!** But does not support fetching files from Telegram's servers yet...

**NOTE**: From v0.6.0, this no longer uses Promises. I didn't quite get the hang of them, so I went back to callbacks

## Create a new wrapper (aka. new bot) ##

```javascript
var BotAPI = require("teleapiwrapper").BotAPI;

var bot = new BotAPI(botToken);
```

## Send a request ##

```javascript
// Note: All methods support callbacks on the form function(error, result)
// Get bot info
bot.getMe(function(err, res) {
	console.log(res);
});

// Send a message
bot.sendMessage(chatId, text);	// Callback optional

// Send a photo (same approach with other file sendings)
bot.sendPhoto(chatId, fs.createReadStream("some_photo.jpg"), "This is a really nice photo");
```

## Changelog ##
**0.8.0**: Got rid of the wrapper object for input files
