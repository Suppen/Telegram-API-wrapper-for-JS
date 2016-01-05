# Telegram API wrapper

An unofficial JS-wrapper for the Telegram chat API. Currently focused on bots.

**Supports ALL methods in the bot API as of 2015-09-21**, but currently none in the regular API

npm: [https://www.npmjs.com/package/teleapiwrapper](https://www.npmjs.com/package/teleapiwrapper)

github: [https://github.com/Suppen/Telegram-API-wrapper-for-JS](https://github.com/Suppen/Telegram-API-wrapper-for-JS)

Official API-documentation: [https://core.telegram.org/bots/api](https://core.telegram.org/bots/api)

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

// There are two ways to give arguments to a method.
// One is to just give them in the order the API documentation says
bot.sendMessage(chatId, text, callback);	// Callback optional

// The other is to provide an object as the method's only parameter

bot.sendMessage({
	chat_id: chatId,
	text: text,
	cb: callback
});

// Send a more fancy message

// Send a message with a reply-keyboard
var keyboard = { /*  reply_markup */
	keyboard: [
		['yes', 'no'],
		[ 'cancel'],
	],
	resize_keyboard: true
};
bot.sendMessage(chatId, text, null, 0, 0, keyboard, callback);
// or
bot.sendMessage({
	chat_id: chatId,
	text: text,
	keyboard: keyboard,
	cb: callback	// Again, callback is optional
});

// Send a photo (same approach with other file sendings)
bot.sendPhoto({
	chat_id: chatId,
	photo: fs.createReadStream("some_photo.jpg"),
	caption: "This is a really nice photo"
});

// Send a photo by ID (same approach with other file sendings)
var photoId = "Adrgvmercfiawejdatruotseafasert";
bot.sendPhoto({
	chat_id: chatId,
	photo: photoId,
	caption: "This is a really nice photo"
});

// Download a file sent to the bot
bot.getFile(file_id, function(err, res) {
	bot.helperDownloadFile(res.result, function(err, res) {
		// res is now a http.IncomingMessage with the file.
		res.pipe(fs.createWriteStream("downloadedFile"));
	});
});

// If you want to give the file a specific name, you create an object of type DataTypes.InputFile and give it to the method
var DataTypes = require("teleapiwrapper").DataTypes;

var file = new DataTypes.InputFile(fs.createReadStream("somefile"), "Very important file.txt");
bot.sendDocument({
	chat_id: chatId,
	document: file
});

// The DataTypes.InputFile constructor can be initialized with a string, a buffer, a readable stream or an already existing InputFile.
// If given a string, it is interpreted as a file ID for an already uploaded file, so Telegram will just resend that one.
// Otherwise, it will upload the file.
// If you pass it an instance of fs.ReadStream, it will itself extract the name of the file from the stream and use that, unless you override it yourself

```

## Changelog
* **0.13.0**: Support for inline bots, and major refactoring
* **0.12.1**: Inserted a missing | in the code, and cleaned the code a bit
* **0.12.0**: Supports the new getFile() method. Also has a helper method called "helperDownloadFile", which actually gets the file for you
* **0.11.0**: All methods now support a single object naming all the methods arguments. See examples
* **0.10.1**: Added missing datatypes and updated existing ones
* **0.10.0**: Updated the API to match the bot API as of Sep. 7 2015. See also the [BotAPI changelog](https://core.telegram.org/bots/api-changelog) **THIS UPDATE MAY BREAK YOUR BOTS!** but not updating can also break them
* **0.9.4**: Made it possible to send ANY stream.Readable as a file as long as it has a string as "path"-attribute. If it doesn't, you get a warning
* **0.9.3**: Added the "Update"-type to DataTypes
* **0.9.1**: Removed debugoutput from the code
* **0.9.0**: The wrapper now internally serializes objects and arrays given to it, so arguments like ''reply_markup'' are now given actual objects, not JSON-strings
* **0.8.1**: Fixed a bug which would crash the process if no connection could be made to the server
* **0.8.0**: Got rid of the wrapper object for input files

PS: If someone wants to write tests for this package, please do, and send me a pull request on github
