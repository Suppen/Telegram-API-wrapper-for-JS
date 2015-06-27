/**************
 *  Requires  *
 **************/

// Require important stuff
var https = require("https");
var querystring = require("querystring");
var urlParser = require("url");
var FormData = require("form-data");


/***********************
 *  General functions  *
 ***********************/

// Function to tell the user about unimplemented parts of the API
function unimplemented() {
	return new Promise(function(resolve, reject) {
		reject("This method is not implemented yet");
	});
};

// Dummy function, doing nothing at all
function dummyFunc(){};

// Get the callback from an arguments object
function getCb(args) {
	if (args.length == 0) {
		return dummy;
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

	parsed.cb = getCb(args);
	if (parsed.cb != dummyFunc) {
		args.length--;
	}

	for (var i = 0; i < args.length && i < fields.length; i++) {
		parsed[fields[i]] = args[i];
	}
	return parsed;
};


/************
 *  BotAPI  *
 ************/

// Default base URL for method calls
var defaultMethodUrlBase = "https://api.telegram.org/bot<token>/";

/**
 * Creates a new BotAPI-object for a bot
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

	/**
	 * Change this in the constructed object if you for some reason don't want to use this URL
	 */
	this.methodUrlBase = defaultMethodUrlBase;
};


// The prototype of the bot BotAPI
BotAPI.prototype = {
	token: "",
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
	 * @param {Boolean} [disable_web_page_preview]	Disables link previews for links in this message
	 * @param {Integer} [reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [reply_markup]	Additional interface options. A JSON-serialized object for a custom reply keyboard, instructions to hide keyboard or to force a reply from the user.
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 */
	sendMessage: function() {
		var args = [
			"chat_id",
			"text",
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
	 * @param {Integer} [reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [reply_markup]	Additional interface options. A JSON-serialized object for a custom reply keyboard, instructions to hide keyboard or to force a reply from the user.
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 */
	sendAudio: function() {
		var args = [
			"chat_id",
			"audio",
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
	 * @param {Integer} [reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [reply_markup]	Additional interface options. A JSON-serialized object for a custom reply keyboard, instructions to hide keyboard or to force a reply from the user.
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 */
	sendVideo: function() {
		var args = [
			"chat_id",
			"video",
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
	 * @param {Function} [cb]	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 */
	setWebhook: function() {
		var args = [
			"url"
		];
		this._doRequest("setWebhook", parseArgs(args, arguments));
	},
	/**
	 * Internal API method. DO NOT USE. Sends the actual request to the API server
	 * @param {String} method	Name of the method to use
	 * @param {Object} argObj	Parsed argument object
	 */
	_doRequest: function(method, argObj) {
		var self = this;

		// Get the callback
		var cb = argObj.cb;
		delete argObj.cb;

		// Check if a token exists
		if (self.token == "") {
			throw new Error("Token not set. Please set the token-attribute on the BotAPI object");
		}

		// Parse the URL
		url = self.methodUrlBase + method;
		url = url.replace("<token>", self.token);
		url = urlParser.parse(url);

		// The callback for the request

		// Extract the file field
		var fileField = argObj.fileField;
		delete argObj.fileField;

		// Create the form
		var form = new FormData();

		var numberOfFields = 0;
		if (fileField && typeof fileField == "string") {
			// Insert the file into the form
			var inputFile = argObj[fileField];
			delete argObj[fileField];

			form.append(fileField, inputFile.file_read_stream);
			numberOfFields++;
		} else if (fileField) {
			throw new Error("No sensible file field given");
		}

		// Put the rest of the data into the form
		for (var field in argObj) {
			form.append(field, argObj[field]);
			numberOfFields++;
		}

		// The http-callback function
		function requestCallback(res) {
			var result = "";

			res.on("data", function(chunk) {
				result += "" + chunk;
			});
			res.on("end", function() {
				try {
					try {
						result = JSON.parse(result);
					} catch (e) {
						throw new Error("Result was not JSON");
					}
					if (!result.ok) {
						throw new Error(result.description);
					} else {
						cb(null, result);
					}
				} catch (e) {
					cb(e, null);
				}
				
			});
			res.on("error", function(e) {
				cb(e, null);
			});
		};

		// The actual request
		var options = {
			host: url.host,
			path: url.path,
			method: "POST",
		};

		if (numberOfFields > 0) {
			headers: form.getHeaders()
		}
		var req = https.request(options, requestCallback);
		if (numberOfFields > 0) {
			form.pipe(req);
		} else {
			req.end();
		}
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
	 * Makes an empty InputFile object. This type is my own implementation
	 *
	 * @constructor
	 */
	InputFile: function() {
		/** InputFile's file read stream, Stream.Readable **/
		this.file_read_stream = null;
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
	Contact: ["phone_number", "first_name"],
	Location: ["longitude", "latitude"],
	UserProfilePhotos: ["total_count", "photos"],
	ReplyKeyboardMarkup: ["keyboard"],
	ReplyKeyboardHide: ["hide_keyboard"],
	ForceReply: ["force_reply"],
	InputFile: ["file_read_stream"]
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
