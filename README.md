# Telegram API wrapper

An unofficial JS-wrapper for the Telegram bot API

**Supports ALL methods in the bot API as of 2016-04-16**

npm: [https://www.npmjs.com/package/teleapiwrapper](https://www.npmjs.com/package/teleapiwrapper)

github: [https://github.com/Suppen/Telegram-API-wrapper-for-JS](https://github.com/Suppen/Telegram-API-wrapper-for-JS)

Official API-documentation: [https://core.telegram.org/bots/api](https://core.telegram.org/bots/api)

Documentation for this package: [https://doc.suppen.no/teleapiwrapper](https://doc.suppen.no/teleapiwrapper)

## Major changes in v2.0

* teleapiwrapper has been converted to ES6, meaning older versions of node are no longer supported.
* All arguments MUST now be given in object form, meaning `bot.sendMessage(123456789, "Cake")` will no longer work. The way to do it now is `bot.sendMessage({chat_id: 123456789, text: "Cake"})`
* The callback is given as a second argument to the method, not as a property of the argument object. Example: `bot.sendMessage({chat_id: 123456789, text: "Cake"}, cb)`
* The major and minor version numbers of this package will now match the official API's version

## How to use

### Create a new wrapper (aka. new bot)

```javascript
const BotAPI = require("teleapiwrapper").BotAPI;

let bot = new BotAPI(botToken);
```

### Send a request

All methods in the API have the signature `methodName(args, cb)`. The arguments to the method are given as an object, and an optional callback function can be called when the API call is completed.
All methods return promises, which can be used instead of callbacks.

```javascript
// Get bot info using callback
bot.getMe({}, (err, res) => {
        if (err) {
                console.log(err);
        } else {
                console.log(res);
        }
});

// Get bot info using promise
bot.getMe().then(res => {
        console.log(res);
}).catch(err => {
        console.log(err);
});


// Send a message
// Arguments are provided as an object to the method

bot.sendMessage({
        chat_id: chatId,
        text: text
});

// Send a message with a reply-keyboard
let keyboard = {/* reply_markup */
        keyboard: [
                ['yes', 'no'],
                [ 'cancel'],
        ],
        resize_keyboard: true
};
bot.sendMessage({
        chat_id: chatId,
        text: text,
        reply_markup: keyboard
});
```

### Sending files

There are a few ways you can send files with your bot. I will demonstrate these ways with the `sendPhoto` method, but all methods which can send files do it this way.

#### With a readable stream
This one sends any readable stream as a file. Easiest method to send a file from your file system
```javascript
bot.sendPhoto({
        chat_id: chatId,
        photo: fs.createReadStream("some_photo.jpg"),
        caption: "This is a really nice photo"
});
```

If the readable stream is an instance of `fs.ReadStream`, like in the example above, the file name will be extracted from the stream, so the receivers will see it named "some_photo.jpg". Other streams don't have the file name in them, and will therefore be named "Some file" if you do not explicitly give it a name with the `InputFile` class described further down

#### With a Buffer
Much the same as sending with a stream, you can send a buffer containing a file
your file system
```javascript
let fileBuffer = fs.readFileSync("some_photo.jpg");
bot.sendPhoto({
        chat_id: chatId,
        photo: fileBuffer
        caption: "This is a really nice photo"
});
```
Note, however, that the receiver(s) will see the file name as "Some file". See the section about the `InputFile` class to change this.

#### By ID
When you send a file to Telegram, you will get the sent message in response. This message contains the ID Telegram assigned to the file. Using this ID, you can resend the file without having to upload it again

```javascript
let photoId = "Adrgvmercfiawejdatruotseafasert";
bot.sendPhoto({
        chat_id: chatId,
        photo: photoId,
        caption: "This is a really nice photo"
});
```

#### With the `InputFile` class

The `InputFile` class is what the above methods are converted to under the hood, but you can also use it explicitly to give a file a specific name.

To use it, first require it:

```javascript
const InputFile = require("teleapiwrapper").InputFile;
```

The `InputFile` constructor takes two arguments: `data` and `filename`. The `data` argument can be a readable stream, a `Buffer` or a `String`, with the same results as the examples above. The `filename` option lets you set a name the receiver(s) of the file will see.

```javascript
let file = new InputFile(fs.createReadStream("some_photo.jpg"), "Very nice photo.jpg");
bot.sendPhoto({
        chat_id: chatId,
        photo: file,
        caption: "This is a really nice photo"
});
```

### Downloading files sent to the bot

Users can send any file to the bot. Telegram allows bots to download files up to 20 MB. If someone has sent a file to your but, you will find a `file_id` in the corresponding `update` object. Use the `getFile` method to get data about the file.

Unfortunately, the `getFile` method does not actually get the file, just data about it, including an URL where you can actually download it. teleapiwrapper therefore has a helper method, named `helperGetFileStream`, which gives you a download stream for that file

```javascript
let file_id = update.message.document.file_id;
bot.getFile({file_id})
  .then(file => {
	// The `file` object does not contain the actual file, just data about it, like a download path, the size and a file name. Pass it on to the `helperGetFileStream` method
	return bot.helperGetFileStream(file);
  }).then(stream => {
	// Now you have a stream containing the actual file. Do whatever you want with it, like saving it to disk:
	stream.pipe(fs.createWriteStream("some_file"));
  }).catch(err => {
	// Something went very wrong when fetching the file
	console.log(err);
  });
```

## Documentation

Everything in the wrapper is documented with JSDoc. The documentation is available in `node_modules/teleapiwrapper/docs/index.html`. Use it well.
They are also readable on [https://doc.suppen.no/teleapiwrapper](https://doc.suppen.no/teleapiwrapper)

## Changelog
* **2.3.0**: Brought the wrapper up to date with BotAPI v2.3
* **2.1.1**: Added the game methods, and added the new arguments to many methods as of 2016-10-03
* **2.1.0**: Brought the wrapper up to date with BotAPI v2.1
* **2.0.2**: Minor changes to the readme, and modularized the code. No functional changes
* **2.0.1**: Minor bugfix
* **2.0.0**: Added methods and updated old ones to support the API v2.0. Converted everything to ES6 and removed support for giving arguments the traditional way. All your bots will probably break on this update
* **0.16.1**: Made the timeout call the callback too, not just reject the promise
* **0.16.0**: Added a timeout to the HTTPS-requests. Defaults to 60 seconds. Available on the `requestTimeout` property
* **0.15.4**: Fixed a bug which would cause errors on boolean parameters
* **0.15.3**: Made `helperDownloadFile` work again
* **0.15.2**: Made the `helperDownloadFile` method also return a promise
* **0.15.1**: Fixed a bug which made method calls without parameters hang forever
* **0.15.0**: Re-added support for promises. Callbacks still work
* **0.14.0**: Changed format of the result object in callbacks. This update **WILL** break your bots, but it should be easy to fix them again
* **0.13.0**: Support for inline bots, and major refactoring

