# Telegram API wrapper

An unofficial JS-wrapper for the Telegram chat API. Currently focused on bots.

**Supports ALL methods in the bot API as of 2016-01-04**, but currently none in the regular API

npm: [https://www.npmjs.com/package/teleapiwrapper](https://www.npmjs.com/package/teleapiwrapper)

github: [https://github.com/Suppen/Telegram-API-wrapper-for-JS](https://github.com/Suppen/Telegram-API-wrapper-for-JS)

Official API-documentation: [https://core.telegram.org/bots/api](https://core.telegram.org/bots/api)

**IMPORTANT!!!!** teleapiwrapper **0.14.0** changed the result object from the method calls. If you insist on using the old way, set the property "forceOldWay" on your bot to true. Before, the methods returned the unmodified parsed object from the method call. Now, they return the object in the result property of that object. This means that where you earlier used "res.result", you can now use just "res". Example: You call bot.getUpdates(function(err, res) {}); In the callback, you earlier wrote "res.result[0]" to get the first update. Now, you write "res[0]". This option will be removed in later versions of teleapiwrapper, so please modify your code to deal with the new way

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
bot.sendMessage(chatId, text, callback);        // Callback optional

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
        cb: callback    // Again, callback is optional
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

## Promises

teleapiwrapper **0.15.0** added support for ES6 Promises. Promises can now be used on every method instead of (or if you really want to, in addition to) callbacks. Callbacks will still work the way they used to, and probably will for a long time into the future. If you don't have promises in your environment, teleapiwrapper will still work, but you can only use callbacks.

Example:

```javascript
bot.getUpdates({
  offset: offset,
  limit: 50,
  timeout: 60
}).then(function(updates) {
  processUpdates(updates);
}).catch(function(err) {
  console.log("Something went very wrong...");
});
```

## Documentation

Everything in the wrapper is documented with JSDoc. The documentation is available in `node_modules/teleapiwrapper/docs/index.html`. Use it well.
They are also readable on [https://doc.suppen.no/teleapiwrapper](https://doc.suppen.no/teleapiwrapper)

## Changelog
* **0.15.4**: Fixed a bug which would cause errors on boolean parameters
* **0.15.3**: Made `helperDownloadFile` work again
* **0.15.2**: Made the `helperDownloadFile` method also return a promise
* **0.15.1**: Fixed a bug which made method calls without parameters hang forever
* **0.15.0**: Re-added support for promises. Callbacks still work
* **0.14.0**: Changed format of the result object in callbacks. This update **WILL** break your bots, but it should be easy to fix them again
* **0.13.0**: Support for inline bots, and major refactoring
* **0.12.1**: Inserted a missing | in the code, and cleaned the code a bit
* **0.12.0**: Supports the new getFile() method. Also has a helper method called "helperDownloadFile", which actually gets the file for you
* **0.11.0**: All methods now support a single object naming all the methods arguments. See examples

PS: If someone wants to write tests for this package, please do, and send me a pull request on github
