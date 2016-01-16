/************
 * Exports  *
 ************/

module.exports.BotAPI = BotAPI;
module.exports.DataTypes = DataTypes;

/**************
 *  Requires  *
 **************/

// Require important stuff
var https = require("https");
var urlParser = require("url");
var FormData = require("form-data");
var fs = require("fs");
var stream = require("stream");


/***********************
 *  General functions  *
 ***********************/

// Dummy function, doing nothing at all
function dummyFunc() {};

// Get the callback from an arguments object
function getCb(args) {
	if (args.length == 0) {
		return dummyFunc;
	}

	var cb = args[args.length-1];
	return cb instanceof Function ? cb : dummyFunc;
}

// Parse arguments into an object
function parseArgs(fields, args) {
	var parsed = {};
	if (args.length == 1 && args[0] instanceof Object && !(args[0] instanceof Function)) {	// A single object was given, containing all arguments
		if (typeof args[0].cb == "undefined") {
			args[0].cb = dummyFunc;
		}
		parsed = args[0];
	} else {	// Arguments were given in the traditional way
		parsed.cb = getCb(args);
		if (parsed.cb != dummyFunc) {
			args.length--;
		}

		for (var i = 0; i < args.length && i < fields.length; i++) {
			parsed[fields[i]] = args[i];
		}
	}

	return parsed;
}

/********************************************************
 * Make sure a lack of Promise doesn't break everything *
 ********************************************************/

if (typeof Promise != "function") {
	console.warn("Promises are not available. teleapiwrapper will work, but only with callbacks. Either upgrade nodejs or polyfill promises if you wish to use them");
	Promise = function(func) {
		func(dummyFunc, dummyFunc);
	};
}

/************
 *  BotAPI  *
 ************/

/**
 * Creates a new BotAPI-object for a bot. All methods may take a callback with params error and result
 *
 * @param {String} botToken	The authentication token for the bot, as provided by BotFather
 * @param {String} [botName]	Name of the bot. Not required, and not used. Just creates a handy property, name, on the object to access the bot's name
 *
 * @constructor
 */
function BotAPI(botToken, botName) {
	// Make it usable without "new"
	if (!this) {
		return new BotAPI(botToken);
	}

	/**
	 * The bot's token
	 */
	this.token = botToken;
	if (typeof botName != "undefined") {
		/**
		 * The name of the bot. Not used by the wrapper, just a handle for you
		 */
		this.name = botName;
	}

	/**
	 * teleapiwrapper 0.14.0 changed the result object from the method calls. Set this to "true" to use the old way instead. Before, the methods returned the unmodified parsed object from the method call. Now, they return the object in the result property of that object. This means that where you earlier used "res.result", you can now use just "res". Example: You call bot.getUpdates(function(err, res) {}); In the callback, you earlier wrote "res.result[0]" to get the first update. Now, you write "res[0]". This option will be removed in later versions of teleapiwrapper, so please modify your code to deal with the new way
	 */
	this.forceOldWay = false;
}


// The prototype of the bot BotAPI
BotAPI.prototype = {
	/**
	 * Change this in the constructed object if you for some reason don't want to use this URL
	 */
	methodUrlBase: "https://api.telegram.org/bot<token>/",
	/**
	 * Change this in the constructed object if you for some reason don't want to use this URL
	 */
	fileUrlBase: "https://api.telegram.org/file/bot<token>/",
	/**
	 * A simple method for testing your bot's auth token. Requires no parameters. Returns basic information about the bot in form of a User object.
	 *
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 *
	 * @return {Promise}	A promise which resolves when the method call completes
	 */
	getMe: function() {
		var args = [];
		return this._doRequest("getMe", parseArgs(args, arguments));
	},
	/**
	 * Use this method to forward messages of any kind. On success, the sent Message is returned.
	 * @param {Integer} chat_id	ID of the chat to send the message to
	 * @param {String} text	Message to send to the chat
	 * @param {String} [parse_mode] Send Markdown, if you want Telegram apps to show bold, italic and inline URLs in your bot's message. For the moment, only Telegram for Android and OSX support this.
	 * @param {Boolean} [disable_web_page_preview]	Disables link previews for links in this message
	 * @param {Integer} [reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [reply_markup]	Additional interface options. A JSON-serialized object for a custom reply keyboard, instructions to hide keyboard or to force a reply from the user.
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 *
	 * @return {Promise}	A promise which resolves when the method call completes
	 */
	sendMessage: function() {
		var args = [
			"chat_id",
			"text",
			"parse_mode",
			"disable_web_page_preview",
			"reply_to_message_id",
			"reply_markup"
		];

		return this._doRequest("sendMessage", parseArgs(args, arguments));
	},
	/**
	 * Use this method to forward messages of any kind. On success, the sent Message is returned.
	 * @param {Integer} chat_id	ID of the chat to send the message to
	 * @param {Integer} from_chat_id	Unique identifier for the chat where the original message was sent — User or GroupChat id
	 * @param {Integer} message_id	Unique message identifier
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 *
	 * @return {Promise}	A promise which resolves when the method call completes
	 */
	forwardMessage: function() {
		var args = [
			"chat_id",
			"from_chat_id",
			"message_id"
		];

		return this._doRequest("forwardMessage", parseArgs(args, arguments));
	},
	/**
	 * Use this method to send photos. On success, the sent Message is returned.
	 * @param {Integer} chat_id	ID of the chat to send the message to
	 * @param {String|DataTypes.InputFile} photo	Photo to send. You can either pass a file_id as String to resend a photo that is already on the Telegram servers, or upload a new photo using multipart/form-data.
	 * @param {String} [caption]	Photo caption (may also be used when resending photos by file_id).
	 * @param {Integer} [reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [reply_markup]	Additional interface options. A JSON-serialized object for a custom reply keyboard, instructions to hide keyboard or to force a reply from the user.
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 *
	 * @return {Promise}	A promise which resolves when the method call completes
	 */
	sendPhoto: function() {
		var args = [
			"chat_id",
			"photo",
			"caption",
			"reply_to_message_id",
			"reply_markup"
		];
		var argObj = parseArgs(args, arguments);
		argObj.photo = new DataTypes.InputFile(argObj.photo);
		return this._doRequest("sendPhoto", argObj);
	},
	/**
	 * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .ogg file encoded with OPUS (other formats may be sent as Document). On success, the sent Message is returned.
	 * @param {Integer} chat_id	ID of the chat to send the message to
	 * @param {String|DataTypes.InputFile} audio	Audio file to send. You can either pass a file_id as String to resend an audio that is already on the Telegram servers, or upload a new audio file using multipart/form-data.
	 * @param {Integet} [duration]	Duration of the audio in secondsi
	 * @param {String} [performer]	Performer
	 * @param {String} [title]	Track name
	 * @param {Integer} [reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [reply_markup]	Additional interface options. A JSON-serialized object for a custom reply keyboard, instructions to hide keyboard or to force a reply from the user.
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 *
	 * @return {Promise}	A promise which resolves when the method call completes
	 */
	sendAudio: function() {
		var args = [
			"chat_id",
			"audio",
			"duration",
			"performer",
			"title",
			"reply_to_message_id",
			"reply_markup"
		];
		var argObj = parseArgs(args, arguments);
		argObj.audio = new DataTypes.InputFile(argObj.audio);
		return this._doRequest("sendAudio", argObj);
	},
	/**
	 * Use this method to send general files. On success, the sent Message is returned.
	 * @param {Integer} chat_id	ID of the chat to send the message to
	 * @param {String|DataTypes.InputFile} document	File to send. You can either pass a file_id as String to resend a file that is already on the Telegram servers, or upload a new file using multipart/form-data.
	 * @param {Integer} [reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [reply_markup]	Additional interface options. A JSON-serialized object for a custom reply keyboard, instructions to hide keyboard or to force a reply from the user.
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 *
	 * @return {Promise}	A promise which resolves when the method call completes
	 */
	sendDocument: function() {
		var args = [
			"chat_id",
			"document",
			"reply_to_message_id",
			"reply_markup"
		];
		var argObj = parseArgs(args, arguments);
		argObj.document = new DataTypes.InputFile(argObj.document);
		return this._doRequest("sendDocument", argObj);
	},
	/**
	 * Use this method to send .webp stickers. On success, the sent Message is returned.
	 * @param {Integer} chat_id	ID of the chat to send the message to
	 * @param {String|DataTypes.InputFile} sticker	Sticker to send. You can either pass a file_id as String to resend a sticker that is already on the Telegram servers, or upload a new sticker using multipart/form-data.
	 * @param {Integer} [reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [reply_markup]	Additional interface options. A JSON-serialized object for a custom reply keyboard, instructions to hide keyboard or to force a reply from the user.
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 *
	 * @return {Promise}	A promise which resolves when the method call completes
	 */
	sendSticker: function() {
		var args = [
			"chat_id",
			"sticker",
			"reply_to_message_id",
			"reply_markup"
		];
		var argObj = parseArgs(args, arguments);
		argObj.sticker = new DataTypes.InputFile(argObj.sticker);
		return this._doRequest("sendSticker", argObj);
	},
	/**
	 * Use this method to send video files, Telegram clients support mp4 videos (other formats may be sent as Document). On success, the sent Message is returned.
	 * @param {Integer} chat_id	ID of the chat to send the message to
	 * @param {String|DataTypes.InputFile} video	Video to send. You can either pass a file_id as String to resend a video that is already on the Telegram servers, or upload a new video file using multipart/form-data.
	 * @param {Integer} [duration]	Duration of sent video in seconds
	 * @param {String} [caption]	Video caption (may also be used when resending videos by file_id).
	 * @param {Integer} [reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [reply_markup]	Additional interface options. A JSON-serialized object for a custom reply keyboard, instructions to hide keyboard or to force a reply from the user.
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 *
	 * @return {Promise}	A promise which resolves when the method call completes
	 */
	sendVideo: function() {
		var args = [
			"chat_id",
			"video",
			"duration",
			"caption",
			"reply_to_message_id",
			"reply_markup"
		];
		var argObj = parseArgs(args, arguments);
		argObj.video = new DataTypes.InputFile(argObj.video);
		return this._doRequest("sendVideo", argObj);
	},
	/**
	 * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .ogg file encoded with OPUS (other formats may be sent as Audio or Document). On success, the sent Message is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.
	 * @param {Integer} chat_id	ID of the chat to send the message to
	 * @param {String|DataTypes.InputFile} voice	Audio file to send. You can either pass a file_id as String to resend an audio that is already on the Telegram servers, or upload a new audio file using multipart/form-data.
	 * @param {Integet} [duration]	Duration of the audio in secondsi
	 * @param {Integer} [reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [reply_markup]	Additional interface options. A JSON-serialized object for a custom reply keyboard, instructions to hide keyboard or to force a reply from the user.
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 *
	 * @return {Promise}	A promise which resolves when the method call completes
	 */
	sendVoice: function() {
		var args = [
			"chat_id",
			"voice",
			"duration",
			"reply_to_message_id",
			"reply_markup"
		];
		var argObj = parseArgs(args, arguments);
		argObj.voice = new DataTypes.InputFile(argObj.voice);
		return this._doRequest("sendVoice", argObj);
	},
	/**
	 * Use this method to send point on the map. On success, the sent Message is returned.
	 * @param {Integer} chat_id	ID of the chat to send the message to
	 * @param {Float} latitude	Latitude of location
	 * @param {Float} longitude	Longitude of location
	 * @param {Integer} [reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [reply_markup]	Additional interface options. A JSON-serialized object for a custom reply keyboard, instructions to hide keyboard or to force a reply from the user.
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 *
	 * @return {Promise}	A promise which resolves when the method call completes
	 */
	sendLocation: function() {
		var args = [
			"chat_id",
			"latitude",
			"longitude",
			"reply_to_message_id",
			"reply_markup"
		];
		return this._doRequest("sendLocation", parseArgs(args, arguments));
	},
	/**
	 * Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status).
	 *
	 * Example: The ImageBot needs some time to process a request and upload the image. Instead of sending a text message along the lines of “Retrieving image, please wait…”, the bot may use sendChatAction with action = upload_photo. The user will see a “sending photo” status for the bot.
	 *
	 * We only recommend using this method when a response from the bot will take a noticeable amount of time to arrive.
	 *
	 * @param {Integer} chat_id	ID of the chat to send the message to
	 * @param {String} action	Type of action to broadcast. Choose one, depending on what the user is about to receive: typing for text messages, upload_photo for photos, record_video or upload_video for videos, record_audio or upload_audio for audio files, upload_document for general files, find_location for location data.
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 *
	 * @return {Promise}	A promise which resolves when the method call completes
	 */
	sendChatAction: function() {
		var args = [
			"chat_id",
			"action"
		];
		return this._doRequest("sendChatAction", parseArgs(args, arguments));
	},
	/**
	 * Use this method to get a list of profile pictures for a user. Returns a UserProfilePhotos object.
	 * @param {Integer} user_id	Unique identifier of the target user
	 * @param {Integer} [offset]	Sequential number of the first photo to be returned. By default, all photos are returned.
	 * @param {Integer} [limit]	Limits the number of photos to be retrieved. Values between 1—100 are accepted. Defaults to 100.
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 *
	 * @return {Promise}	A promise which resolves when the method call completes
	 */
	getUserProfilePhotos: function() {
		var args = [
			"user_id",
			"offset",
			"limit"
		];
		return this._doRequest("getUserProfilePhotos", parseArgs(args, arguments));
	},
	/**
	 * Use this method to receive incoming updates using long polling. An Array of Update objects is returned.
	 * @param {Integer} [offset]	Identifier of the first update to be returned. Must be greater by one than the highest among the identifiers of previously received updates. By default, updates starting with the earliest unconfirmed update are returned. An update is considered confirmed as soon as getUpdates is called with an offset higher than its update_id.
	 * @param {Integer} [limit]	Limits the number of updates to be retrieved. Values between 1—100 are accepted. Defaults to 100
	 * @param {Integer} [timeout]	Timeout in seconds for long polling. Defaults to 0, i.e. usual short polling
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 *
	 * @return {Promise}	A promise which resolves when the method call completes
	 */
	getUpdates: function() {
		var args = [
			"offset",
			"limit",
			"timeout"
		];
		return this._doRequest("getUpdates", parseArgs(args, arguments));
	},
	/**
	 * Use this method to specify a url and receive incoming updates via an outgoing webhook. Whenever there is an update for the bot, we will send an HTTPS POST request to the specified url, containing a JSON-serialized @Update. In case of an unsuccessful request, we will give up after a reasonable amount of attempts.
	 * @param {String} url	HTTPS url to send updates to. Use an empty string to remove webhook integration
	 * @param {InputFile} [certificate]	Upload your public key certificate so that the root certificate in use can be checked
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 *
	 * @return {Promise}	A promise which resolves when the method call completes
	 */
	setWebhook: function() {
		var args = [
			"url",
			"certificate"
		];
		argObj.certificate = new DataTypes.InputFile(argObj.certificate);
		return this._doRequest("setWebhook", parseArgs(args, arguments));
	},
	/**
	 * Use this method to get basic info about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a File object is returned. The file can then be downloaded via the link https://api.telegram.org/file/bot<token>/<file_path>, where <file_path> is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling getFile again.
	 * @param {String} file_id	File identifier to get info about
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 *
	 * @return {Promise}	A promise which resolves when the method call completes
	 */
	getFile: function() {
		var args = [
			"file_id"
		];
		return this._doRequest("getFile", parseArgs(args, arguments));
	},
	/**
	 * Use this method to send answers to an inline query. On success, True is returned.
	 * No more than 50 results per query are allowed.
	 * @param {String} inline_query_id	Unique identifier for the answered query
	 * @param {InlineQueryResult[]} results	A JSON-serialized array of results for the inline query
	 * @param {Integer} [cache_time]	The maximum amount of time in seconds that the result of the inline query may be cached on the server. Defaults to 300.
	 * @param {Boolean] [is_personal]	Pass True, if results may be cached on the server side only for the user that sent the query. By default, results may be returned to any user who sends the same query
	 * @param {String} [next_offset]	Pass the offset that a client should send in the next query with the same text to receive more results. Pass an empty string if there are no more results or if you don‘t support pagination. Offset length can’t exceed 64 bytes.
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 *
	 * @return {Promise}	A promise which resolves when the method call completes
	 */
	answerInlineQuery: function() {
		var args = [
			"inline_query_id",
			"results",
			"cache_time",
			"is_personal",
			"next_offset"
		];
		return this._doRequest("answerInlineQuery", parseArgs(args, arguments));
	},
	/**
	 * Internal API method. DO NOT USE. Sends the actual request to the API server
	 * @param {String} method	Name of the method to use
	 * @param {Object} argObj	Parsed argument object
	 *
	 * @return {Promise}	A promise which resolves when the method call completes
	 *
	 * @private
	 */
	_doRequest: function(method, argObj) {
		// Check if a token exists
		if (this.token == "") {
			throw new Error("Token not set. Please set the token-attribute on the BotAPI object");
		}

		// Get the callback
		var cb = argObj.cb;
		delete argObj.cb;

		// Parse the URL
		var url = this.methodUrlBase + method;
		url = url.replace("<token>", this.token);
		url = urlParser.parse(url);

		// JSON-serialize every value in the argObj except input files, which the stream will be extracted from if it is not just a file ID
		for (var p in argObj) {
			if (argObj[p] instanceof DataTypes.InputFile) {
				// This is an input file. If it is a file ID, just let it go. Otherwise, it's the stream we want
				if (argObj[p].file_data != null) {
					argObj[p] = argObj[p].file_data;
				} else {
					argObj[p] = argObj[p].file_id;
				}
			} else if (argObj[p] instanceof Object || typeof argObj[p] == "boolean") {
				// Stringify the object
				argObj[p] = JSON.stringify(argObj[p]);
			}
		}

		// Create the form
		var form = new FormData();

		// Fill data into the form
		var dataProvided = false;
		for (var field in argObj) {
			dataProvided = true;
			form.append(field, argObj[field]);
		}

		// Check if data was provided. This is a hack to make stuff work if no parameters were passed to a method
		if (!dataProvided) {
			form.getHeaders = function() {
				return {};
			}
		}

		// Do the request
		var req = https.request({
			host: url.host,
			path: url.path,
			method: "POST",
			headers: form.getHeaders()
		});

		return new Promise(function(resolve, reject) {
			// Listen for the response
			req.on("response", function(res) {
				// Buffer to hold the result body
				var result = "";

				res.on("data", function(chunk) {
					// Concatenate all chunks
					result = result + chunk.toString("utf-8");
				});
				res.on("end", function() {
					try {
						// Try to parse the result as JSON
						result = JSON.parse(result);
		
						// Parsing went OK. Did everything go well on Telegram's end?
						if (!result.ok) {
							var err = new Error(result.description);
							cb(err, null);
							reject(err);
						} else {
							if (!this.forceOldWay) {
								cb(null, result.result);
								resolve(result.result);
							} else {
								cb(null, result);
								reject(new Error("Please set forceOldWay to false to use promises with teleapiwrapper"));
							}
						}
					} catch (e) {
						// Parsing went wrong
						cb(e, null);
						reject(e);
					}

				}.bind(this));
				res.on("error", function(e) {	// Will this ever happen? The docs don't specify an error event
					console.log("Response error:", e);
					cb(e, null);
					reject(e);
				});
			}.bind(this));

			// Check for errors
			req.on("error", function(e) {	// Will this ever happen? The docs don't specify an error event
				console.log("Request error:", e);
				cb(e, null);
				reject(e);
			});

			// Send the body
			form.pipe(req);
		}.bind(this));
	},
	/**
	 * getFile does not actually get the file, it only gets a path where you can download the file from. This method actually sends the download request for you, The callback gets an error object if the request failed, and gets the response object otherwise. See https://nodejs.org/api/http.html#http_http_incomingmessage
	 * @param {File} file	The File object returned from getFile
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result". "Result" will be a download stream for the file
	 *
	 * @return {Promise}	A promise which resolves when the download stream is ready
	 */
	helperDownloadFile: function(file, cb) {
		if (!(cb instanceof Function)) {
			cb = dummyFunc;
		}

		// Check if a file was actually provided
		if (typeof file == "undefined " || typeof file.file_id == "undefined") {
			throw new Error("Given file argument is not a file object");
		}

		// Download the file
		var url = this.fileUrlBase + file.file_path;
		url = url.replace("<token>", this.token);

		return new Promise(function(resolve, reject) {
			var req = https.get(url, function(res) {
				cb(null, res);	// Return the response object
				resolve(res);
			});
			req.on("error", function(e) {
				argObj.cb(e, null);	// Something went wrong with the request
				reject(e);
			});
		});
	}
}

/***************
 *  DataTypes  *
 ***************/

/**
 * Holds Telegram types. See https://core.telegram.org/bots/api#available-types for info
 *
 * @namespace
 */
var DataTypes = {
	/**
	 * Creates a new InputFile object which can be given to BotAPI.send_document or other methods which require files. The resulting object will have either a file_id or a file_stream property. The other will be null
	 *
	 * @param {String|Buffer|stream.Readable} data	The data for the input file. If this is a string, it will be interpreted as a file_id to resend a file already uploaded to the Telegram servers. If given a buffer or stream.Readable, the data will be uploaded to Telegram
	 * @param {String} [filename]	Defaults to "Some file" if not given and data is not an instance of fs.ReadStream, in which case it will be named after the file which the stream is reading. Has no effect if data is a string
	 *
	 * @constructor
	 */
	InputFile: function(data, filename) {
		this.file_id = null;
		this.file_data = null;

		var defaultFilename = "Some file";

		// Check if this is a file ID or an actual file
		if (typeof data == "string") {
			// File ID
			this.file_id = data;
		} else if (data instanceof Buffer) {
			// A buffer. Make it available and name it
			this.file_data = data;
			this.file_data.path = filename ? filename : defaultFilename;
		} else if (data instanceof stream.Readable) {
			// A stream. Shove it through a PassThrough to make all streams the same type and name it
			this.file_data = new stream.PassThrough();
			data.pipe(this.file_data);
			if (data instanceof fs.ReadStream && !filename) {
				this.file_data.path = data.path;
			} else if (filename) {
				this.file_data.path = filename;
			} else {
				this.file_data.path = defaultFilename;
			}
		} else if (data instanceof DataTypes.InputFile) {
			// This is already an input file
			this.file_id = data.file_id;
			this.file_data = data.file_data;
		} else {
			// Can't make sense of the data. Throw an error
			throw new Error("Invalid data for InputFile");
		}
	}
}
