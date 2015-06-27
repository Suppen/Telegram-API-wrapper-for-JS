// Require important stuff
var https = require("https");
var querystring = require("querystring");
var urlParser = require("url");


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

// Function to tell the user about unimplemented parts of the API
function unimplemented() {
	return new Promise(function(resolve, reject) {
		reject("This method is not implemented yet");
	});
};

// Get the callback from an arguments object
function getCb(args) {
	var cb = args[args.length-1];
	if (cb instanceof Function) {
		return cb;
	} else {
		return function() {};	// Dummy function
	}
};

// The prototype of the bot BotAPI
BotAPI.prototype = {
	methodUrlBase: "https://api.telegram.org/bot<token>/",
	token: "",
	/**
	 * A simple method for testing your bot's auth token. Requires no parameters. Returns basic information about the bot in form of a User object.
	 *
	 * @param {Function} cb	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 *
	 * @return {User}	Basic information about the bot in form of a User object
	 */
	getMe: function(cb) {
		this._doRequest("getMe", {}, getCb(arguments));
	},
	/**
	 * Use this method to forward messages of any kind. On success, the sent Message is returned.
	 * @param {Integer} chat_id	ID of the chat to send the message to
	 * @param {String} text	Message to send to the chat
	 * @param {Boolean} [disable_web_page_preview]	Disables link previews for links in this message
	 * @param {Integer} [reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [reply_markup]	Additional interface options. A JSON-serialized object for a custom reply keyboard, instructions to hide keyboard or to force a reply from the user.
	 * @param {Function} cb	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 *
	 * @return {Message}	The sent Message
	 */
	sendMessage: function(
		chat_id,
		text,
		disable_web_page_preview,
		reply_to_message_id,
		reply_markup,
		cb
	) {
		var method = "sendMessage";
		var data = {
			chat_id: chat_id,
			text: text,
			disable_web_page_preview: disable_web_page_preview,
			reply_to_message_id: reply_to_message_id,
			reply_markup: reply_markup
		};
		this._doRequest(method, data, getCb(arguments));
	},
	/**
	 * Use this method to forward messages of any kind. On success, the sent Message is returned.
	 * @param {Integer} chat_id	ID of the chat to send the message to
	 * @param {Integer} from_chat_id	Unique identifier for the chat where the original message was sent — User or GroupChat id
	 * @param {Integer} message_id	Unique message identifier
	 * @param {Function} cb	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 *
	 * @return {Message}	The sent Message
	 */
	forwardMessage: function(
		chat_id,
		from_chat_id,
		message_id,
		cb
	) {
		var method = "forwardMessage";
		var data = {
			chat_id: chat_id,
			from_chat_id: from_chat_id,
			message_id: message_id
		};
		this._doRequest(method, data, getCb(arguments));
	},
	/**
	 * Use this method to send photos. On success, the sent Message is returned.
	 * @param {Integer} chat_id	ID of the chat to send the message to
	 * @param {String|InputFile} photo	Photo to send. You can either pass a file_id as String to resend a photo that is already on the Telegram servers, or upload a new photo using multipart/form-data.
	 * @param {String} [caption]	Photo caption (may also be used when resending photos by file_id).
	 * @param {Integer} [reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [reply_markup]	Additional interface options. A JSON-serialized object for a custom reply keyboard, instructions to hide keyboard or to force a reply from the user.
	 * @param {Function} cb	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 *
	 * @return {Message}	The sent Message
	 */
	sendPhoto: function(
		chat_id,
		photo,
		caption,
		reply_to_message_id,
		reply_markup,
		cb
	) {
return unimplemented();
		var method = "sendPhoto";
		var data = {
			chat_id: chat_id,
			photo: photo,
			caption: caption,
			reply_to_message_id: reply_to_message_id,
			reply_markup: reply_markup
		};
		this._doRequest(method, data, getCb(arguments));
	},
	/**
	 * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .ogg file encoded with OPUS (other formats may be sent as Document). On success, the sent Message is returned.
	 * @param {Integer} chat_id	ID of the chat to send the message to
	 * @param {String|InputFile} audio	Audio file to send. You can either pass a file_id as String to resend an audio that is already on the Telegram servers, or upload a new audio file using multipart/form-data.
	 * @param {Integer} [reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [reply_markup]	Additional interface options. A JSON-serialized object for a custom reply keyboard, instructions to hide keyboard or to force a reply from the user.
	 * @param {Function} cb	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 *
	 * @return {Message}	The sent Message
	 */
	sendAudio: function(
		chat_id,
		audio,
		reply_to_message_id,
		reply_markup,
		cb
	) {
return unimplemented();
		var method = "sendAudio";
		var data = {
			chat_id: chat_id,
			audio: audio,
			reply_to_message_id: reply_to_message_id,
			reply_markup: reply_markup
		};
		this._doRequest(method, data, getCb(arguments));
	},
	/**
	 * Use this method to send general files. On success, the sent Message is returned.
	 * @param {Integer} chat_id	ID of the chat to send the message to
	 * @param {String|InputFile} document	File to send. You can either pass a file_id as String to resend a file that is already on the Telegram servers, or upload a new file using multipart/form-data.
	 * @param {Integer} [reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [reply_markup]	Additional interface options. A JSON-serialized object for a custom reply keyboard, instructions to hide keyboard or to force a reply from the user.
	 * @param {Function} cb	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 *
	 * @return {Message}	The sent Message
	 */
	sendDocument: function(
		chat_id,
		document,
		reply_to_message_id,
		reply_markup,
		cb
	) {
return unimplemented();
		var method = "sendDocument";
		var data = {
			chat_id: chat_id,
			document: document,
			reply_to_message_id: reply_to_message_id,
			reply_markup: reply_markup
		};
		this._doRequest(method, data, getCb(arguments));
	},
	/**
	 * Use this method to send .webp stickers. On success, the sent Message is returned.
	 * @param {Integer} chat_id	ID of the chat to send the message to
	 * @param {String|InputFile} sticker	Sticker to send. You can either pass a file_id as String to resend a sticker that is already on the Telegram servers, or upload a new sticker using multipart/form-data.
	 * @param {Integer} [reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [reply_markup]	Additional interface options. A JSON-serialized object for a custom reply keyboard, instructions to hide keyboard or to force a reply from the user.
	 * @param {Function} cb	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 *
	 * @return {Message}	The sent Message
	 */
	sendSticker: function(
		chat_id,
		sticker,
		reply_to_message_id,
		reply_markup,
		cb
	) {
return unimplemented();
		var method = "sendSticker";
		var data = {
			chat_id: chat_id,
			sticker: sticker,
			reply_to_message_id: reply_to_message_id,
			reply_markup: reply_markup
		};
		this._doRequest(method, data, getCb(arguments));
	},
	/**
	 * Use this method to send video files, Telegram clients support mp4 videos (other formats may be sent as Document). On success, the sent Message is returned.
	 * @param {Integer} chat_id	ID of the chat to send the message to
	 * @param {String|InputFile} video	Video to send. You can either pass a file_id as String to resend a video that is already on the Telegram servers, or upload a new video file using multipart/form-data.
	 * @param {Integer} [reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [reply_markup]	Additional interface options. A JSON-serialized object for a custom reply keyboard, instructions to hide keyboard or to force a reply from the user.
	 * @param {Function} cb	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 *
	 * @return {Message}	The sent Message
	 */
	sendVideo: function(
		chat_id,
		video,
		reply_to_message_id,
		reply_markup,
		cb
	) {
return unimplemented();
		var method = "sendVideo";
		var data = {
			chat_id: chat_id,
			video: video,
			reply_to_message_id: reply_to_message_id,
			reply_markup: reply_markup
		};
		this._doRequest(method, data, getCb(arguments));
	},
	/**
	 * Use this method to send point on the map. On success, the sent Message is returned.
	 * @param {Integer} chat_id	ID of the chat to send the message to
	 * @param {Float} latitude	Latitude of location
	 * @param {Float} longitude	Longitude of location
	 * @param {Integer} [reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [reply_markup]	Additional interface options. A JSON-serialized object for a custom reply keyboard, instructions to hide keyboard or to force a reply from the user.
	 * @param {Function} cb	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 *
	 * @return {Message}	The sent Message
	 */
	sendLocation: function(
		chat_id,
		latitude,
		longitude,
		reply_to_message_id,
		reply_markup,
		cb
	) {
		var method = "sendLocation";
		var data = {
			chat_id: chat_id,
			latitude: latitude,
			longitude: longitude,
			reply_to_message_id: reply_to_message_id,
			reply_markup: reply_markup
		};
		this._doRequest(method, data, getCb(arguments));
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
	 * @param {Function} cb	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 */
	sendChatAction: function(
		chat_id,
		action,
		cb
	) {
		var method = "sendChatAction";
		var data = {
			chat_id: chat_id,
			action: action
		};
		this._doRequest(method, data, getCb(arguments));
	},
	/**
	 * Use this method to get a list of profile pictures for a user. Returns a UserProfilePhotos object.
	 * @param {Integer} user_id	Unique identifier of the target user
	 * @param {Integer} [offset]	Sequential number of the first photo to be returned. By default, all photos are returned.
	 * @param {Integer} [limit]	Limits the number of photos to be retrieved. Values between 1—100 are accepted. Defaults to 100.
	 * @param {Function} cb	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 *
	 * @return {UserProfilePhotos}
	 */
	getUserProfilePhotos: function(
		user_id,
		offset,
		limit,
		cb
	) {
		var method = "getUserProfilePhotos";
		var data = {
			user_id: user_id,
			offset: offset,
			limit: limit
		};
		this._doRequest(method, data, getCb(arguments));
	},
	/**
	 * Use this method to receive incoming updates using long polling (wiki). An Array of Update objects is returned.
	 * @param {Integer} [offset]	Identifier of the first update to be returned. Must be greater by one than the highest among the identifiers of previously received updates. By default, updates starting with the earliest unconfirmed update are returned. An update is considered confirmed as soon as getUpdates is called with an offset higher than its update_id.
	 * @param {Integer} [limit]	Limits the number of updates to be retrieved. Values between 1—100 are accepted. Defaults to 100
	 * @param {Integer} [timeout]	Timeout in seconds for long polling. Defaults to 0, i.e. usual short polling
	 * @param {Function} cb	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 *
	 * @return {Update[]}
	 */
	getUpdates: function(
		offset,
		limit,
		timeout,
		cb
	) {
		var method = "getUpdates";
		var data = {
			offset: offset,
			limit: limit,
			timeout: timeout
		};
		this._doRequest(method, data, getCb(arguments));
	},
	/**
	 * Use this method to specify a url and receive incoming updates via an outgoing webhook. Whenever there is an update for the bot, we will send an HTTPS POST request to the specified url, containing a JSON-serialized @Update. In case of an unsuccessful request, we will give up after a reasonable amount of attempts.
	 * @param {String} url	HTTPS url to send updates to. Use an empty string to remove webhook integration
	 * @param {Function} cb	If the last argument is a function, it will be treated as a callback function with args "error" and "result"
	 */
	setWebhook: function(url, cb) {
		var method = "setWebhook";
		var data = {
			url: url
		};
		this._doRequest(apiurl, data, getCb(arguments));
	},
	/**
	 * Internal API method. DO NOT USE. Sends the actual request to the API server
	 * @param {String} method	Name of the method to use
	 * @param {String} [data]	Object containing parameters for the method
	 *
	 * @return {Promise}	A promise which will contain the result of the request
	 */
	_doRequest: function(method, data, cb) {
		var self = this;

		if (self.token == "") {
			throw new Error("Token not set. Please set the token-attribute on the BotAPI object");
		}

		if (!data) {
			data = {};
		}

		data = querystring.stringify(data);

		var result = "";

		url = self.methodUrlBase + method;
		url = url.replace("<token>", self.token);
		url = urlParser.parse(url);

		var req = https.request({
			host: url.host,
			path: url.path,
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		}, function(res) {
			res.on("data", function(chunk) {
				result += "" + chunk;
			});
			res.on("end", function() {
				try {
					result = JSON.parse(result);
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
		});

		req.write(data);
		req.end();
	}
};

module.exports.BotAPI = BotAPI;
