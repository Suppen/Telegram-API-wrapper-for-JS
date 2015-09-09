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
// Note: All methods support callbacks on the form function(error, result), where "result" is the parsed JSON-response from the server
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
bot.sendMessage(chatId, text, null, 0, 0, keyboard, callback);

// Send a message with a reply-keyboard, with all arguments given as an object to the method. ALL methods support this.
bot.sendMessage({
	chat_id: chatId,
	text: text,
	keyboard: keyboard,
	cb: callback	// Again, callback is optional
});

// Send a photo (same approach with other file sendings)
bot.sendPhoto(chatId, fs.createReadStream("some_photo.jpg"), "This is a really nice photo");

// Send a photo by ID (same approach with other file sendings)
var photoId = "Adrgvmercfiawejdatruotseafasert";
bot.sendPhoto(chatId, photoId, "This is a really nice photo");
```

## Changelog
* **0.11.0**: All methods now support a single object naming all the methods arguments. See examples
* **0.10.1**: Added missing datatypes and updated existing ones
* **0.10.0**: Updated the API to match the bot API as of Sep. 7 2015. See also the [BotAPI changelog](https://core.telegram.org/bots/api-changelog) **THIS UPDATE MAY BREAK YOUR BOTS!** but not updating can also break them
* **0.9.4**: Made it possible to send ANY stream.Readable as a file as long as it has a string as "path"-attribute. If it doesn't, you get a warning
* **0.9.3**: Added the "Update"-type to DataTypes
* **0.9.1**: Removed debugoutput from the code
* **0.9.0**: The wrapper now internally serializes objects and arrays given to it, so arguments like ''reply_markup'' are now given actual objects, not JSON-strings
* **0.8.1**: Fixed a bug which would crash the process if no connection could be made to the server
* **0.8.0**: Got rid of the wrapper object for input files
