# Telegram API wrapper

An unofficial JS-wrapper for the Telegram chat API. Currently focused on bots.

**Supports ALL methods in the bot API**, but currently none in the regular API

npm: [https://www.npmjs.com/package/teleapiwrapper](https://www.npmjs.com/package/teleapiwrapper)

github: [https://github.com/Suppen/Telegram-API-wrapper-for-JS](https://github.com/Suppen/Telegram-API-wrapper-for-JS)

Official API-documentation: [https://core.telegram.org/bots/api](https://core.telegram.org/bots/api)

**Now supports sending files!** But does not support fetching files from Telegram's servers yet...

**NOTE**: From v0.6.0, this no longer uses Promises. I didn't quite get the hang of them, so I went back to callbacks

## Create a new wrapper (aka. new bot)

```javascript
var BotAPI = require("teleapiwrapper").BotAPI;

var bot = new BotAPI(botToken);
```

## Send a request

```javascript
// Note: All methods support callbacks on the form function(error, result), where "result" is the JSON-response from the server
// Get bot info
bot.getMe(function(err, res) {
	console.log(res);
});

// Send a message
bot.sendMessage(chatId, text);	// Callback optional

// Send a message with a reply-keyboard
var keyboard = { /*  reply_markup */
	keyboard: [
        	['yes', 'no'],
		[ 'cancel'],
	],
	resize_keyboard: true
};
bot.sendMessage(chatId, text, 0, 0, keyboard);

// Send a photo (same approach with other file sendings)
bot.sendPhoto(chatId, fs.createReadStream("some_photo.jpg"), "This is a really nice photo");

// Send a photo by ID (same approach with other file sendings)
var photoId = "Adrgvmercfiawejdatruotseafasert";
bot.sendPhoto(chatId, photoId, "This is a really nice photo");
```

## Changelog
* **0.9.1**: Removed debugoutput from the code
* **0.9.0**: The wrapper now internally serializes objects and arrays given to it, so arguments like ''reply_markup'' are now given actual objects, not JSON-strings
* **0.8.1**: Fixed a bug which would crash the process if no connection could be made to the server
* **0.8.0**: Got rid of the wrapper object for input files
