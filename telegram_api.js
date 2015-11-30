/**************
 *  Requires  *
 **************/

// Require important stuff
var http = require("http");
var https = require("https");
var urlParser = require("url");
var FormData = require("form-data");
var fs = require("fs");
var stream = require("stream");


/***********************
 *  General functions  *
 ***********************/

// Dummy function, doing nothing at all
function dummyFunc(){};

// Get the callback from an arguments object
function getCb(args) {
	if (args.length == 0) {
		return dummyFunc;
	}

	var cb = args[args.length-1];
	if (cb instanceof Function) {
		return cb;
	} else {
		return dummyFunc;
	}
};

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
};


/************
 *  BotAPI  *
 ************/

/**
 * Creates a new BotAPI-object for a bot. All methods may take a callback with params error and result
 *
 * @param {String} botToken	The authentication token for the bot, as provided by BotFather
 *
 * @constructor
 */
function BotAPI(botToken) {
	// Make it usable without "new"
	if (!this) {
		return new BotAPI(botToken);
	}

	this.token = botToken;
};


// The prototype of the bot BotAPI
BotAPI.prototype = {
	token: "",
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
	 */
	getMe: function() {
		var args = [];
		this._doRequest("getMe", parseArgs(args, arguments));
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

		this._doRequest("sendMessage", parseArgs(args, arguments));
	},
	/**
	 * Use this method to forward messages of any kind. On success, the sent Message is returned.
	 * @param {Integer} chat_id	ID of the chat to send the message to
	 * @param {Integer} from_chat_id	Unique identifier for the chat where the original message was sent — User or GroupChat id
	 * @param {Integer} message_id	Unique message identifier
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 */
	forwardMessage: function() {
		var args = [
			"chat_id",
			"from_chat_id",
			"message_id"
		];

		this._doRequest("forwardMessage", parseArgs(args, arguments));
	},
	/**
	 * Use this method to send photos. On success, the sent Message is returned.
	 * @param {Integer} chat_id	ID of the chat to send the message to
	 * @param {String|InputFile} photo	Photo to send. You can either pass a file_id as String to resend a photo that is already on the Telegram servers, or upload a new photo using multipart/form-data.
	 * @param {String} [caption]	Photo caption (may also be used when resending photos by file_id).
	 * @param {Integer} [reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [reply_markup]	Additional interface options. A JSON-serialized object for a custom reply keyboard, instructions to hide keyboard or to force a reply from the user.
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
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
		if (DataTypes.isType("InputFile", argObj.photo)) {
			argObj.fileField = "photo";
		}
		this._doRequest("sendPhoto", argObj);
	},
	/**
	 * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .ogg file encoded with OPUS (other formats may be sent as Document). On success, the sent Message is returned.
	 * @param {Integer} chat_id	ID of the chat to send the message to
	 * @param {String|InputFile} audio	Audio file to send. You can either pass a file_id as String to resend an audio that is already on the Telegram servers, or upload a new audio file using multipart/form-data.
	 * @param {Integet} [duration]	Duration of the audio in secondsi
	 * @param {String} [performer]	Performer
	 * @param {String} [title]	Track name
	 * @param {Integer} [reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [reply_markup]	Additional interface options. A JSON-serialized object for a custom reply keyboard, instructions to hide keyboard or to force a reply from the user.
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
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
		if (DataTypes.isType("InputFile", argObj.audio)) {
			argObj.fileField = "audio";
		}
		this._doRequest("sendAudio", argObj);
	},
	/**
	 * Use this method to send general files. On success, the sent Message is returned.
	 * @param {Integer} chat_id	ID of the chat to send the message to
	 * @param {String|InputFile} document	File to send. You can either pass a file_id as String to resend a file that is already on the Telegram servers, or upload a new file using multipart/form-data.
	 * @param {Integer} [reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [reply_markup]	Additional interface options. A JSON-serialized object for a custom reply keyboard, instructions to hide keyboard or to force a reply from the user.
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 */
	sendDocument: function() {
		var args = [
			"chat_id",
			"document",
			"reply_to_message_id",
			"reply_markup"
		];
		var argObj = parseArgs(args, arguments);
		if (DataTypes.isType("InputFile", argObj.document)) {
			argObj.fileField = "document";
		}
		this._doRequest("sendDocument", argObj);
	},
	/**
	 * Use this method to send .webp stickers. On success, the sent Message is returned.
	 * @param {Integer} chat_id	ID of the chat to send the message to
	 * @param {String|InputFile} sticker	Sticker to send. You can either pass a file_id as String to resend a sticker that is already on the Telegram servers, or upload a new sticker using multipart/form-data.
	 * @param {Integer} [reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [reply_markup]	Additional interface options. A JSON-serialized object for a custom reply keyboard, instructions to hide keyboard or to force a reply from the user.
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 */
	sendSticker: function() {
		var args = [
			"chat_id",
			"sticker",
			"reply_to_message_id",
			"reply_markup"
		];
		var argObj = parseArgs(args, arguments);
		if (DataTypes.isType("InputFile", argObj.sticker)) {
			argObj.fileField = "sticker";
		}
		this._doRequest("sendSticker", argObj);
	},
	/**
	 * Use this method to send video files, Telegram clients support mp4 videos (other formats may be sent as Document). On success, the sent Message is returned.
	 * @param {Integer} chat_id	ID of the chat to send the message to
	 * @param {String|InputFile} video	Video to send. You can either pass a file_id as String to resend a video that is already on the Telegram servers, or upload a new video file using multipart/form-data.
	 * @param {Integer} [duration]	Duration of sent video in seconds
	 * @param {String} [caption]	Video caption (may also be used when resending videos by file_id).
	 * @param {Integer} [reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [reply_markup]	Additional interface options. A JSON-serialized object for a custom reply keyboard, instructions to hide keyboard or to force a reply from the user.
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
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
		if (DataTypes.isType("InputFile", argObj.video)) {
			argObj.fileField = "video";
		}
		this._doRequest("sendVideo", argObj);
	},
	/**
	 * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .ogg file encoded with OPUS (other formats may be sent as Audio or Document). On success, the sent Message is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.
	 * @param {Integer} chat_id	ID of the chat to send the message to
	 * @param {String|InputFile} voice	Audio file to send. You can either pass a file_id as String to resend an audio that is already on the Telegram servers, or upload a new audio file using multipart/form-data.
	 * @param {Integet} [duration]	Duration of the audio in secondsi
	 * @param {Integer} [reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [reply_markup]	Additional interface options. A JSON-serialized object for a custom reply keyboard, instructions to hide keyboard or to force a reply from the user.
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
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
		if (DataTypes.isType("InputFile", argObj.audio)) {
			argObj.fileField = "audio";
		}
		this._doRequest("sendVoice", argObj);
	},
	/**
	 * Use this method to send point on the map. On success, the sent Message is returned.
	 * @param {Integer} chat_id	ID of the chat to send the message to
	 * @param {Float} latitude	Latitude of location
	 * @param {Float} longitude	Longitude of location
	 * @param {Integer} [reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [reply_markup]	Additional interface options. A JSON-serialized object for a custom reply keyboard, instructions to hide keyboard or to force a reply from the user.
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 */
	sendLocation: function() {
		var args = [
			"chat_id",
			"latitude",
			"longitude",
			"reply_to_message_id",
			"reply_markup"
		];
		this._doRequest("sendLocation", parseArgs(args, arguments));
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
	 */
	sendChatAction: function() {
		var args = [
			"chat_id",
			"action"
		];
		this._doRequest("sendChatAction", parseArgs(args, arguments));
	},
	/**
	 * Use this method to get a list of profile pictures for a user. Returns a UserProfilePhotos object.
	 * @param {Integer} user_id	Unique identifier of the target user
	 * @param {Integer} [offset]	Sequential number of the first photo to be returned. By default, all photos are returned.
	 * @param {Integer} [limit]	Limits the number of photos to be retrieved. Values between 1—100 are accepted. Defaults to 100.
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 */
	getUserProfilePhotos: function() {
		var args = [
			"user_id",
			"offset",
			"limit"
		];
		this._doRequest("getUserProfilePhotos", parseArgs(args, arguments));
	},
	/**
	 * Use this method to receive incoming updates using long polling. An Array of Update objects is returned.
	 * @param {Integer} [offset]	Identifier of the first update to be returned. Must be greater by one than the highest among the identifiers of previously received updates. By default, updates starting with the earliest unconfirmed update are returned. An update is considered confirmed as soon as getUpdates is called with an offset higher than its update_id.
	 * @param {Integer} [limit]	Limits the number of updates to be retrieved. Values between 1—100 are accepted. Defaults to 100
	 * @param {Integer} [timeout]	Timeout in seconds for long polling. Defaults to 0, i.e. usual short polling
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 */
	getUpdates: function() {
		var args = [
			"offset",
			"limit",
			"timeout"
		];
		this._doRequest("getUpdates", parseArgs(args, arguments));
	},
	/**
	 * Use this method to specify a url and receive incoming updates via an outgoing webhook. Whenever there is an update for the bot, we will send an HTTPS POST request to the specified url, containing a JSON-serialized @Update. In case of an unsuccessful request, we will give up after a reasonable amount of attempts.
	 * @param {String} url	HTTPS url to send updates to. Use an empty string to remove webhook integration
	 * @param {InputFile} [certificate]	Upload your public key certificate so that the root certificate in use can be checked
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 */
	setWebhook: function() {
		var args = [
			"url",
			"certificate"
		];
		if (DataTypes.isType("InputFile", argObj.certificate)) {
			argObj.fileField = "certificate";
		}
		this._doRequest("setWebhook", parseArgs(args, arguments));
	},
	/**
	 * Use this method to get basic info about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a File object is returned. The file can then be downloaded via the link https://api.telegram.org/file/bot<token>/<file_path>, where <file_path> is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling getFile again.
	 * @param {String} file_id	File identifier to get info about
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 */
	getFile: function() {
		var args = [
			"file_id"
		];
		this._doRequest("getFile", parseArgs(args, arguments));
	},
	/**
	 * Internal API method. DO NOT USE. Sends the actual request to the API server
	 * @param {String} method	Name of the method to use
	 * @param {Object} argObj	Parsed argument object
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

		// The http-callback function

		// Extract the file field
		var fileField = argObj.fileField;
		delete argObj.fileField;
		var inputFile = false;
		if (fileField) {
			inputFile = argObj[fileField];
			delete argObj[fileField];
		}

		// JSON-serialize every value in the argObj
		for (var p in argObj) {
			if (argObj[p] instanceof Object) {
				argObj[p] = JSON.stringify(argObj[p]);
			}
		}

		// Default headers for the request
		var headers = {
			"Content-Type": "application/json"
		};

		// Check if the request should contain a file
		if (inputFile) {
			// Give the file a default name if not given
			if (!(inputFile instanceof http.IncomingMessage || (inputFile instanceof stream.Readable && typeof inputFile.path == "string"))) {	// TODO Dry this up. This boolean expression is written three times in the code, the other two down in DataTypes.isType();
				inputFile.path = "Some file";
			}

			//Make the form
			var form =  new FormData();
			
			// Insert the file into the form
			form.append(fileField, inputFile);

			// Put the rest of the data into the form
			for (var field in argObj) {
				form.append(field, argObj[field]);
			}

			// Override the headers
			headers = form.getHeaders();
		}

		// Do the request
		var req = https.request({
			host: url.host,
			path: url.path,
			method: "POST",
			headers: headers
		});

		// Listen for the response
		req.on("response", function(res) {
			// Buffer to hold the result body
			var result = "";

			res.on("data", function(chunk) {
				// Concatenate all chunks
				result += "" + chunk.toString("utf-8");
			});
			res.on("end", function() {
				try {
					// Try to parse the result as JSON
					result = JSON.parse(result);
	
					// Parsing went OK. Did everything go well on Telegram's end?
					if (!result.ok) {
						cb(new Error(result.description), null);
					} else {
						cb(null, result);
					}
				} catch (e) {
					// Parsing went wrong
					cb(e, null);
				}

			});
			res.on("error", function(e) {
				cb(e, null);
			});
		});

		// Check for errors
		req.on("error", function(e) {
			cb(e, null);
		});

		// Send the body
		if (inputFile) {
			form.pipe(req);
		} else {
			req.end(JSON.stringify(argObj));
		}

	},
	/**
	 * getFile does not actually get the file, it only gets a path where you can download the file from. This method actually sends the download request for you, The callback gets an error object if the request failed, and gets the response object otherwise. See https://nodejs.org/api/http.html#http_http_incomingmessage
	 * @param {File} file	The File object returned from getFile
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 */
	helperDownloadFile: function() {
		var args = [
			"file"
		];
		argObj = parseArgs(args, arguments);

		// Check if a file was actually provided
		if (!DataTypes.isType("File", argObj.file)) {
			throw new Error("Given file argument is not a file object");
		}

		// Download the file
		var url = this.fileUrlBase + argObj.file.file_path;
		url = url.replace("<token>", this.token);

		var req = https.get(url, function(res) {
			argObj.cb(null, res);	// Return the response object
		});
		req.on("error", function(e) {
			argObj.cb(e, null);	// Something went wrong with the request
		});
	}
};

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
	 * Constructs an empty User object
	 *
	 * @constructor
	 */
	User: function() {
		/** User's ID, Integer **/
		this.id = 0;
		/** User's first name, String **/
		this.first_name = "";
		/** User's last name, String, optional **/
		this.last_name = "";
		/** User's username, String, optional **/
		this.username = "";
	},
	/**
	 * Constructs an empty GroupChat object
	 *
	 * @constructor
	 */
	GroupChat: function() {
		/** GroupChat's ID, Integer **/
		this.id = 0;
		/** GroupChat's title, String **/
		this.title = "";
	},
	/**
	 * Constructs an empty Message object
	 *
	 * @constructor
	 */
	Message: function() {
		/** Message's message ID, Integer **/
		this.message_id = 0;
		/** Message's from, User **/
		this.from = null;
		/** Message's date, Integer **/
		this.date = 0;
		/** Message's chat, User or GroupChat **/
		this.chat = null;
		/** Message's forwarded from, User, optional **/
		this.forwarded_from = null;
		/** Message's forward date, Integer, optional **/
		this.forwarded_date = 0;
		/** Message's reply to message, Message, optional **/
		this.reply_to_message = null;
		/** Message's text, String, optional **/
		this.text = "";
		/** Message's audio, Audio, optional **/
		this.audio = null;
		/** Message's document, Document, optional **/
		this.document = null;
		/** Message's photo, Array of PhotoSize, optional **/
		this.photo = [];
		/** Message's sticker, Sticker, optional **/
		this.sticker = null;
		/** Message's video, Video, optional **/
		this.video = null;
		/** Message's voice, Voice, optional **/
		this.voice = null;
		/** Message's caption for photo or video, String, optional **/
		this.caption = "";
		/** Message's contact, Contact, optional **/
		this.contact = null;
		/** Message's location, Location, optional **/
		this.location = null;
		/** Message's new chat participant, User, optional **/
		this.new_chat_participant = null;
		/** Message's left chat participant, User, optional **/
		this.left_chat_participant = null;
		/** Message's new chat title, String, optional **/
		this.new_chat_title = null;
		/** Message's new chat photo, Array of PhotoSize, optional **/
		this.new_chat_photo = [];
		/** Message's delete chat photo, True, optional **/
		this.delete_chat_photo = true;
		/** Message's group chat created, True, optional **/
		this.group_chat_created = [];
	},
	/**
	 * Constructs an empty PhotoSize object
	 *
	 * @constructor
	 */
	PhotoSize: function() {
		/** PhotoSize's ID, String **/
		this.file_id = "";
		/** PhotoSize's width, Integer **/
		this.width = 0;
		/** PhotoSize's height, Integer **/
		this.height = 0;
		/** PhotoSize's file size, Integer, optional **/
		this.file_size = 0;
	},
	/**
	 * Constructs an empty Audio object
	 *
	 * @constructor
	 */
	Audio: function() {
		/** Audio's ID, String **/
		this.file_id = "";
		/** Audio's duration, seconds, Integer **/
		this.duration = 0;
		/** Audio's performer, String, optional **/
		this.performer = "";
		/** Audio's title, String, optional **/
		this.title = "";
		/** Audio's mime type, String, optional **/
		this.mime_type = "";
		/** Audio's file size, Integer, optional **/
		this.file_size = 0;
	},
	/**
	 * Constructs an empty Document object
	 *
	 * @constructor
	 */
	Document: function() {
		/** Document's ID, String **/
		this.file_id = "";
		/** Document's thumbnail, PhotoSize **/
		this.thumb = null;
		/** Document's file name, String, optional **/
		this.file_name = "";
		/** Document's mime type, String, optional **/
		this.mime_type = "";
		/** Document's file size, Integer, optional **/
		this.file_size = 0;
	},
	/**
	 * Constructs an empty Sticker object
	 *
	 * @constructor
	 */
	Sticker: function() {
		/** Sticker's ID, String **/
		this.file_id = "";
		/** Sticker's width, Integer **/
		this.width = 0;
		/** Sticker's height, Integer **/
		this.height = 0;
		/** Sticker's thumb, PhotoSize **/
		this.thumb = null;
		/** Sticker's file size, Integer, optional **/
		this.file_size = 0;
	},
	/**
	 * Constructs an empty Video object
	 *
	 * @constructor
	 */
	Video: function() {
		/** Video's ID, String **/
		this.file_id = "";
		/** Video's width, Integer **/
		this.width = 0;
		/** Video's height, Integer **/
		this.height = 0;
		/** Video's height, Integer **/
		this.duration = 0;
		/** Video's thumb, PhotoSize **/
		this.thumb = null;
		/** Video's mime type, String, optional **/
		this.mime_type = "";
		/** Video's file size, Integer, optional **/
		this.file_size = 0;
		/** Video's caption, String, optional **/
		this.caption = "";
	},
	/**
	 * Constructs an empty Voice object
	 *
	 * @constructor
	 */
	Voice: function() {
		/** Voice's ID, String **/
		this.file_id = "";
		/** Voice's duration, seconds, Integer **/
		this.duration = 0;
		/** Voice's mime type, String, optional **/
		this.mime_type = "";
		/** Voice's file size, Integer, optional **/
		this.file_size = 0;
	},
	/**
	 * Constructs an empty Contact object
	 *
	 * @constructor
	 */
	Contact: function() {
		/** Contact's phone number, String **/
		this.phone_number = "";
		/** Contact's first name, String **/
		this.first_name = "";
		/** Contact's last name, String, optional **/
		this.last_name = "";
		/** Contact's User ID, String, optional **/
		this.user_id = "";
	},
	/**
	 * Constructs an empty Location object
	 *
	 * @constructor
	 */
	Location: function() {
		/** Location's longitude, Float **/
		this.longitude = 0;
		/** Location's latitude, Float **/
		this.latitude = 0;
	},
	/**
	 *
	 */
	Update: function() {
		/** Update's ID, Integer **/
		this.id = 0;
		/** Update's Message, Message, optional according to the docs... I'm gonna treat it as required **/
		this.message = null;
	},
	/**
	 * Constructs an empty UserProfilePhotos object
	 *
	 * @constructor
	 */
	UserProfilePhotos: function() {
		/** UserProfilePhotos's total count, Integer **/
		this.total_count = 0;
		/** UserProfilePhotos's latitude, Array of Array of PhotoSize **/
		this.photos = [];
	},
	/**
	 * Constructs an empty ReplyKeyboardMarkup object
	 *
	 * @constructor
	 */
	ReplyKeyboardMarkup: function() {
		/** ReplyKeyboardMarkup's keyboard, Array of Array of String **/
		this.keyboard = [];
		/** ReplyKeyboardMarkup's resize keyboard, Boolean, optional **/
		this.resize_keyboard = false;
		/** ReplyKeyboardMarkup's one time keyboard, Boolean, optional **/
		this.one_time_keyboard = false;
		/** ReplyKeyboardMarkup's selective, Boolean, optional **/
		this.selective = false;
	},
	/**
	 * Constructs an empty ReplyKeyboardHide object
	 *
	 * @constructor
	 */
	ReplyKeyboardHide: function() {
		/** ReplyKeyboardHide's keyboard, True **/
		this.hide_keyboard = true;
		/** ReplyKeyboardHide's selective, Boolean, optional **/
		this.selective = false;
	},
	/**
	 * Constructs an empty ForceReply object
	 *
	 * @constructor
	 */
	ForceReply: function() {
		/** ForceReply's force reply, True **/
		this.force_reply = true;
		/** ForceReply's selective, Boolean, optional **/
		this.selective = false;
	},
	/**
	 * Constructs an empty File object
	 *
	 * @constructor
	 */
	File: function() {
		/** File's unique identifier, String **/
		this.file_id = "";
		/** File's size, if known. Optional **/
		this.file_size = 0;
		/** File's path. Use https://api.telegram.org/file/bot<token>/<file_path> to get the file. String. Optional **/
		this.file_path = "";
	}
};

/**
 * List of mandatory field for each type
 */
DataTypes.RequiredFields = {
	User: ["id", "first_name"],
	GroupChat: ["id", "title"],
	Message: ["message_id", "from", "date", "chat"],
	PhotoSize: ["file_id", "width", "height"],
	Audio: ["file_id", "duration"],
	Document: ["file_id", "thumb"],
	Sticker: ["file_id", "width", "height", "thumb"],
	Video: ["file_id", "width", "height", "duration", "thumb"],
	Voice: ["file_id", "duration"],
	Contact: ["phone_number", "first_name"],
	Location: ["longitude", "latitude"],
	Update: ["id", "message"],
	UserProfilePhotos: ["total_count", "photos"],
	ReplyKeyboardMarkup: ["keyboard"],
	ReplyKeyboardHide: ["hide_keyboard"],
	ForceReply: ["force_reply"],
	File: ["file_id"]
};

/**
 * Checks if an object is of a type.
 *
 * Only checks if the type's mandatory fields are present. Does not check their
 * types. Does not check other fields
 *
 * @param {String} type	The type to check for
 * @param {Object} obj	The object to check
 *
 * @return {Boolean}	True if the object is of the type, false otherwise
 */
DataTypes.isType = function(type, obj) {
	if (type == "InputFile") {
		if (!(obj instanceof http.IncomingMessage || (obj instanceof stream.Readable && typeof obj.path == "string"))) {
			console.warn("teleapiwrapper uses the string value of the \"path\" field on a readable stream to generate the name of the file. If no \"path\" field is present, it will default to \"Some file\"");
		}
		return obj instanceof http.IncomingMessage || (obj instanceof stream.Readable && typeof obj.path == "string");
	}

	if (typeof DataTypes[type] == "undefined") {
		throw new Error("Invalid type: " + type);
	}

	var m = DataTypes.RequiredFields[type];

	for (var i = 0; i < m.length; i++) {
		if (typeof obj[m[i]] == "undefined") {
			return false;
		}
	}
	return true;
};

/************
 * Exports  *
 ************/

module.exports.BotAPI = BotAPI;
module.exports.DataTypes = DataTypes;
