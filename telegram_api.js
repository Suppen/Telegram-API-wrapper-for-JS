"use strict";

/**************
 *  Requires  *
 **************/

// Require important stuff
const https = require("https");
const urlParser = require("url");
const FormData = require("form-data");
const fs = require("fs");
const stream = require("stream");

/************
 *  BotAPI  *
 ************/

/**
 * A wrapper for the [Telegram Bot API]{@link https://core.telegram.org/bots/api}. Instances are bound to a single bot token
 */
class BotAPI {
	/**
	 * Creates a new BotAPI-object for a bot. All methods may take a callback with params error and result
	 *
	 * @param {String} botToken	The authentication token for the bot, as provided by [BotFather]{@link https://telegram.me/botfather}
	 */
	constructor(botToken) {
		/**
		 * The bot's token
		 *
		 * @type {String}
		 */
		this.token = botToken;

		/**
		 * The API endpoint to connect the bot to
		 *
		 * @type {String}
		 * @default "https://api.telegram.org/bot<token>/"
		 */
		this.methodUrlBase = "https://api.telegram.org/bot<token>/";

		/**
		 * The API endpoint to download files from
		 *
		 * @type {String}
		 * @default "https://api.telegram.org/file/bot<token>/"
		 */
		this.fileUrlBase = "https://api.telegram.org/file/bot<token>/";

		/**
		 * Timeout for requests to the HTTPS-api, in milliseconds. Default: 60000 (one minute)
		 *
		 * @type {Integer}
		 */
		this.requestTimeout = 60*1000;
	}

	/**************************
	 * Methods to get updates *
	 **************************/

	/**
	 * Use this method to receive incoming updates using long polling. An Array of [Update]{@link https://core.telegram.org/bots/api#update} objects is returned.
	 *
	 * @param {Object} args	Arguments for the method
	 * @param {Integer} [args.offset]	Identifier of the first update to be returned. Must be greater by one than the highest among the identifiers of previously received updates. By default, updates starting with the earliest unconfirmed update are returned. An update is considered confirmed as soon as getUpdates is called with an offset higher than its update_id.
	 * @param {Integer} [args.limit]	Limits the number of updates to be retrieved. Values between 1—100 are accepted. Defaults to 100
	 * @param {Integer} [args.timeout]	Timeout in seconds for long polling. Defaults to 0, i.e. usual short polling
	 * @param {Function} [cb]	A callback which will be called with the usual "error" and "result" arguments when the call completes
	 *
	 * @return {Promise}	A promise which resolves to an array of [Update]{@link https://core.telegram.org/bots/api#update} objects when the method call completes
	 */
	getUpdates(args, cb) {
		return this._doRequest("getUpdates", args, cb);
	}

	/**
	 * Use this method to specify a url and receive incoming updates via an outgoing webhook. Whenever there is an update for the bot, we will send an HTTPS POST request to the specified url, containing a JSON-serialized [Update]{@link https://core.telegram.org/bots/api#update}. In case of an unsuccessful request, we will give up after a reasonable amount of attempts.
	 *
	 * @param {Object} args	Arguments for the method
	 * @param {String} [args.url]	HTTPS url to send updates to. Use an empty string to remove webhook integration
	 * @param {InputFile} [args.certificate]	Upload your public key certificate so that the root certificate in use can be checked
	 * @param {Function} [cb]	A callback which will be called with the usual "error" and "result" arguments when the call completes
	 *
	 * @return {Promise}	A promise which resolves when the method call completes
	 */
	setWebhook(args, cb) {
		args.certificate = new InputFile(args.certificate);
		return this._doRequest("setWebhook", args, cb);
	}

	/****************************
	 * Methods to send messages *
	 ****************************/

	/**
	 * Use this method to forward messages of any kind. On success, the sent [Message]{@link https://core.telegram.org/bots/api#message} is returned.
	 *
	 * @param {Object} args	Arguments for the method
	 * @param {Integer|String} args.chat_id	Unique identifier for the target chat or username of the target channel (in the format @channelusername)
	 * @param {String} args.text	Message to send to the chat
	 * @param {String} [args.parse_mode]	Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
	 * @param {Boolean} [args.disable_web_page_preview]	Disables link previews for links in this message
	 * @param {Boolean} [args.disable_notification]	Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
	 * @param {Integer} [args.reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [args.reply_markup]	Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to hide reply keyboard or to force a reply from the user. See [InlineKeyboardMarkup]{@link https://core.telegram.org/bots/api#inlinekeyboardmarkup}, [ReplyKeyboardMarkup]{@link https://core.telegram.org/bots/api#replykeyboardmarkup}, [ReplyKeyboardHide]{@link https://core.telegram.org/bots/api#inlinekeyboardhide}, [ForceReply]{@link https://core.telegram.org/bots/api#forcereply}
	 * @param {Function} [cb]	A callback which will be called with the usual "error" and "result" arguments when the call completes
	 *
	 * @return {Promise}	A promise which resolves to the sent [Message]{@link https://core.telegram.org/bots/api#message} when the method call completes
	 */
	sendMessage(args, cb) {
		return this._doRequest("sendMessage", args, cb);
	}

	/**
	 * Use this method to forward messages of any kind. On success, the sent [Message]{@link https://core.telegram.org/bots/api#message} is returned.
	 *
	 * @param {Object} args	Arguments for the method
	 * @param {Integer|String} args.chat_id	Unique identifier for the target chat or username of the target channel (in the format @channelusername)
	 * @param {Integer|String} args.from_chat_id	Unique identifier for the chat where the original message was sent (or channel username in the format @channelusername)
	 * @param {Boolean} [args.disable_notification]	Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
	 * @param {Integer} args.message_id	Unique message identifier
	 * @param {Function} [cb]	A callback which will be called with the usual "error" and "result" arguments when the call completes
	 *
	 * @return {Promise}	A promise which resolves to the sent [Message]{@link https://core.telegram.org/bots/api#message} when the method call completes
	 */
	forwardMessage(args, cb) {
		return this._doRequest("forwardMessage", args, cb);
	}

	/**
	 * Use this method to send photos. On success, the sent [Message]{@link https://core.telegram.org/bots/api#message} is returned.
	 *
	 * @param {Object} args	Arguments for the method
	 * @param {Integer|String} args.chat_id	Unique identifier for the target chat or username of the target channel (in the format @channelusername)
	 * @param {String|InputFile} args.photo	Photo to send. You can either pass a file_id as String to resend a photo that is already on the Telegram servers, or upload a new photo
	 * @param {String} [args.caption]	Photo caption (may also be used when resending photos by file_id), 0-200 characters
	 * @param {Boolean} [args.disable_notification]	Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
	 * @param {Integer} [args.reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [args.reply_markup]	Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to hide reply keyboard or to force a reply from the user. See [InlineKeyboardMarkup]{@link https://core.telegram.org/bots/api#inlinekeyboardmarkup}, [ReplyKeyboardMarkup]{@link https://core.telegram.org/bots/api#replykeyboardmarkup}, [ReplyKeyboardHide]{@link https://core.telegram.org/bots/api#inlinekeyboardhide}, [ForceReply]{@link https://core.telegram.org/bots/api#forcereply}
	 * @param {Function} [cb]	A callback which will be called with the usual "error" and "result" arguments when the call completes
	 *
	 * @return {Promise}	A promise which resolves to the sent [Message]{@link https://core.telegram.org/bots/api#message} when the method call completes
	 */
	sendPhoto(args, cb) {
		args.photo = new InputFile(args.photo);
		return this._doRequest("sendPhoto", args, cb);
	}

	/**
	 * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .ogg file encoded with OPUS (other formats may be sent as Document). On success, the sent [Message]{@link https://core.telegram.org/bots/api#message} is returned.
	 *
	 * @param {Object} args	Arguments for the method
	 * @param {Integer|String} args.chat_id	Unique identifier for the target chat or username of the target channel (in the format @channelusername)
	 * @param {String|InputFile} args.audio	Audio file to send. You can either pass a file_id as String to resend an audio that is already on the Telegram servers, or upload a new audio file
	 * @param {Integet} [args.duration]	Duration of the audio in secondsi
	 * @param {String} [args.performer]	Performer
	 * @param {String} [args.title]	Track name
	 * @param {Boolean} [args.disable_notification]	Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
	 * @param {Integer} [args.reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [args.reply_markup]	Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to hide reply keyboard or to force a reply from the user. See [InlineKeyboardMarkup]{@link https://core.telegram.org/bots/api#inlinekeyboardmarkup}, [ReplyKeyboardMarkup]{@link https://core.telegram.org/bots/api#replykeyboardmarkup}, [ReplyKeyboardHide]{@link https://core.telegram.org/bots/api#inlinekeyboardhide}, [ForceReply]{@link https://core.telegram.org/bots/api#forcereply}
	 * @param {Function} [cb]	A callback which will be called with the usual "error" and "result" arguments when the call completes
	 *
	 * @return {Promise}	A promise which resolves to the sent [Message]{@link https://core.telegram.org/bots/api#message} when the method call completes
	 */
	sendAudio(args, cb) {
		args.audio = new InputFile(args.audio);
		return this._doRequest("sendAudio", args, cb);
	}

	/**
	 * Use this method to send general files. On success, the sent [Message]{@link https://core.telegram.org/bots/api#message} is returned.
	 *
	 * @param {Object} args	Arguments for the method
	 * @param {Integer|String} args.chat_id	Unique identifier for the target chat or username of the target channel (in the format @channelusername)
	 * @param {String|InputFile} args.document	File to send. You can either pass a file_id as String to resend a file that is already on the Telegram servers, or upload a new file
	 * @param {String} [args.caption]	Document caption (may also be used when resending documents by file_id), 0-200 characters
	 * @param {Boolean} [args.disable_notification]	Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
	 * @param {Integer} [args.reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [args.reply_markup]	Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to hide reply keyboard or to force a reply from the user. See [InlineKeyboardMarkup]{@link https://core.telegram.org/bots/api#inlinekeyboardmarkup}, [ReplyKeyboardMarkup]{@link https://core.telegram.org/bots/api#replykeyboardmarkup}, [ReplyKeyboardHide]{@link https://core.telegram.org/bots/api#inlinekeyboardhide}, [ForceReply]{@link https://core.telegram.org/bots/api#forcereply}
	 * @param {Function} [cb]	A callback which will be called with the usual "error" and "result" arguments when the call completes
	 *
	 * @return {Promise}	A promise which resolves to the sent [Message]{@link https://core.telegram.org/bots/api#message} when the method call completes
	 */
	sendDocument(args, cb) {
		args.document = new InputFile(args.document);
		return this._doRequest("sendDocument", args, cb);
	}

	/**
	 * Use this method to send .webp stickers. On success, the sent [Message]{@link https://core.telegram.org/bots/api#message} is returned.
	 *
	 * @param {Object} args	Arguments for the method
	 * @param {Integer|String} args.chat_id	Unique identifier for the target chat or username of the target channel (in the format @channelusername)
	 * @param {String|InputFile} args.sticker	Sticker to send. You can either pass a file_id as String to resend a sticker that is already on the Telegram servers, or upload a new sticker using multipart/form-data.
	 * @param {Boolean} [args.disable_notification]	Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
	 * @param {Integer} [args.reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [args.reply_markup]	Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to hide reply keyboard or to force a reply from the user. See [InlineKeyboardMarkup]{@link https://core.telegram.org/bots/api#inlinekeyboardmarkup}, [ReplyKeyboardMarkup]{@link https://core.telegram.org/bots/api#replykeyboardmarkup}, [ReplyKeyboardHide]{@link https://core.telegram.org/bots/api#inlinekeyboardhide}, [ForceReply]{@link https://core.telegram.org/bots/api#forcereply}
	 * @param {Function} [cb]	A callback which will be called with the usual "error" and "result" arguments when the call completes
	 *
	 * @return {Promise}	A promise which resolves to the sent [Message]{@link https://core.telegram.org/bots/api#message} when the method call completes
	 */
	sendSticker(args, cb) {
		args.sticker = new InputFile(args.sticker);
		return this._doRequest("sendSticker", args, cb);
	}

	/**
	 * Use this method to send video files, Telegram clients support mp4 videos (other formats may be sent as Document). On success, the sent [Message]{@link https://core.telegram.org/bots/api#message} is returned.
	 *
	 * @param {Object} args	Arguments for the method
	 * @param {Integer|String} args.chat_id	Unique identifier for the target chat or username of the target channel (in the format @channelusername)
	 * @param {String|InputFile} args.video	Video to send. You can either pass a file_id as String to resend a video that is already on the Telegram servers, or upload a new video file
	 * @param {Integer} [args.duration]	Duration of sent video in seconds
	 * @param {Integer} [args.width]	Video width
	 * @param {Integer} [args.height]	Video height
	 * @param {String} [args.caption]	Video caption (may also be used when resending videos by file_id).
	 * @param {Boolean} [args.disable_notification]	Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
	 * @param {Integer} [args.reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [args.reply_markup]	Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to hide reply keyboard or to force a reply from the user. See [InlineKeyboardMarkup]{@link https://core.telegram.org/bots/api#inlinekeyboardmarkup}, [ReplyKeyboardMarkup]{@link https://core.telegram.org/bots/api#replykeyboardmarkup}, [ReplyKeyboardHide]{@link https://core.telegram.org/bots/api#inlinekeyboardhide}, [ForceReply]{@link https://core.telegram.org/bots/api#forcereply}
	 * @param {Function} [cb]	A callback which will be called with the usual "error" and "result" arguments when the call completes
	 *
	 * @return {Promise}	A promise which resolves to the sent [Message]{@link https://core.telegram.org/bots/api#message} when the method call completes
	 */
	sendVideo(args, cb) {
		args.video = new InputFile(args.video);
		return this._doRequest("sendVideo", args, cb);
	}

	/**
	 * Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .ogg file encoded with OPUS (other formats may be sent as Audio or Document). On success, the sent [Message]{@link https://core.telegram.org/bots/api#message} is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future.
	 *
	 * @param {Object} args	Arguments for the method
	 * @param {Integer|String} args.chat_id	Unique identifier for the target chat or username of the target channel (in the format @channelusername)
	 * @param {String|InputFile} args.voice	Audio file to send. You can either pass a file_id as String to resend an audio that is already on the Telegram servers, or upload a new audio file
	 * @param {Integet} [args.duration]	Duration of the audio in seconds
	 * @param {Boolean} [args.disable_notification]	Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
	 * @param {Integer} [args.reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [args.reply_markup]	Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to hide reply keyboard or to force a reply from the user. See [InlineKeyboardMarkup]{@link https://core.telegram.org/bots/api#inlinekeyboardmarkup}, [ReplyKeyboardMarkup]{@link https://core.telegram.org/bots/api#replykeyboardmarkup}, [ReplyKeyboardHide]{@link https://core.telegram.org/bots/api#inlinekeyboardhide}, [ForceReply]{@link https://core.telegram.org/bots/api#forcereply}
	 * @param {Function} [cb]	A callback which will be called with the usual "error" and "result" arguments when the call completes
	 *
	 * @return {Promise}	A promise which resolves to the sent [Message]{@link https://core.telegram.org/bots/api#message} when the method call completes
	 */
	sendVoice(args, cb) {
		args.voice = new InputFile(args.voice);
		return this._doRequest("sendVoice", args, cb);
	}

	/**
	 * Use this method to send point on the map. On success, the sent [Message]{@link https://core.telegram.org/bots/api#message} is returned.
	 *
	 * @param {Object} args	Arguments for the method
	 * @param {Integer|String} args.chat_id	Unique identifier for the target chat or username of the target channel (in the format @channelusername)
	 * @param {Float} args.latitude	Latitude of location
	 * @param {Float} args.longitude	Longitude of location
	 * @param {Boolean} [args.disable_notification]	Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
	 * @param {Integer} [args.reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [args.reply_markup]	Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to hide reply keyboard or to force a reply from the user. See [InlineKeyboardMarkup]{@link https://core.telegram.org/bots/api#inlinekeyboardmarkup}, [ReplyKeyboardMarkup]{@link https://core.telegram.org/bots/api#replykeyboardmarkup}, [ReplyKeyboardHide]{@link https://core.telegram.org/bots/api#inlinekeyboardhide}, [ForceReply]{@link https://core.telegram.org/bots/api#forcereply}
	 * @param {Function} [cb]	A callback which will be called with the usual "error" and "result" arguments when the call completes
	 *
	 * @return {Promise}	A promise which resolves to the sent [Message]{@link https://core.telegram.org/bots/api#message} when the method call completes
	 */
	sendLocation(args, cb) {
		return this._doRequest("sendLocation", args, cb);
	}

	/**
	 * Use this method to send information about a venue. On success, the sent [Message]{@link https://core.telegram.org/bots/api#message} is returned.
	 *
	 * @param {Object} args	Arguments for the method
	 * @param {Integer|String} args.chat_id	Unique identifier for the target chat or username of the target channel (in the format @channelusername)
	 * @param {Float} args.latitude	Latitude of location
	 * @param {Float} args.longitude	Longitude of location
	 * @param {String} args.title	Name of the venue
	 * @param {String} args.address	Address of the venue
	 * @param {String} [args.foursquare_id]	Foursquare identifier of the venue
	 * @param {Boolean} [args.disable_notification]	Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
	 * @param {Integer} [args.reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [args.reply_markup]	Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to hide reply keyboard or to force a reply from the user. See [InlineKeyboardMarkup]{@link https://core.telegram.org/bots/api#inlinekeyboardmarkup}, [ReplyKeyboardMarkup]{@link https://core.telegram.org/bots/api#replykeyboardmarkup}, [ReplyKeyboardHide]{@link https://core.telegram.org/bots/api#inlinekeyboardhide}, [ForceReply]{@link https://core.telegram.org/bots/api#forcereply}
	 * @param {Function} [cb]	A callback which will be called with the usual "error" and "result" arguments when the call completes
	 *
	 * @return {Promise}	A promise which resolves to the sent [Message]{@link https://core.telegram.org/bots/api#message} when the method call completes
	 */
	sendVenue(args, cb) {
		return this._doRequest("sendVenue", args, cb);
	}

	/**
	 * Use this method to send phone contacts. On success, the sent [Message]{@link https://core.telegram.org/bots/api#message} is returned.
	 *
	 * @param {Object} args	Arguments for the method
	 * @param {Integer|String} args.chat_id	Unique identifier for the target chat or username of the target channel (in the format @channelusername)
	 * @param {String} args.phone_number	Contact's phone number
	 * @param {String} args.first_name	Contact's first name
	 * @param {String} [args.last_name]	Contact's last name
	 * @param {Boolean} [args.disable_notification]	Sends the message silently. iOS users will not receive a notification, Android users will receive a notification with no sound.
	 * @param {Integer} [args.reply_to_message_id]	If the message is a reply, ID of the original message
	 * @param {InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardHide|ForceReply} [args.reply_markup]	Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to hide reply keyboard or to force a reply from the user. See [InlineKeyboardMarkup]{@link https://core.telegram.org/bots/api#inlinekeyboardmarkup}, [ReplyKeyboardMarkup]{@link https://core.telegram.org/bots/api#replykeyboardmarkup}, [ReplyKeyboardHide]{@link https://core.telegram.org/bots/api#inlinekeyboardhide}, [ForceReply]{@link https://core.telegram.org/bots/api#forcereply}
	 * @param {Function} [cb]	A callback which will be called with the usual "error" and "result" arguments when the call completes
	 *
	 * @return {Promise}	A promise which resolves to the sent [Message]{@link https://core.telegram.org/bots/api#message} when the method call completes
	 */
	sendContact(args, cb) {
		return this._doRequest("sendContact", args, cb);
	}

	/**
	 * Use this method when you need to tell the user that something is happening on the bot's side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status). 
	 *
	 * Example: The ImageBot needs some time to process a request and upload the image. Instead of sending a text message along the lines of “Retrieving image, please wait…”, the bot may use sendChatAction with action = upload_photo. The user will see a “sending photo” status for the bot.
	 *
	 * We only recommend using this method when a response from the bot will take a noticeable amount of time to arrive.
	 *
	 * @param {Object} args	Arguments for the method
	 * @param {Integer|String} args.chat_id	Unique identifier for the target chat or username of the target channel (in the format @channelusername)
	 * @param {String} args.action	Type of action to broadcast. Choose one, depending on what the user is about to receive: typing for text messages, upload_photo for photos, record_video or upload_video for videos, record_audio or upload_audio for audio files, upload_document for general files, find_location for location data.
	 * @param {Function} [cb]	A callback which will be called with the usual "error" and "result" arguments when the call completes
	 *
	 * @return {Promise}	A promise which resolves when the method call completes
	 */
	sendChatAction(args, cb) {
		return this._doRequest("sendChatAction", args, cb);
	}

	/*********************************
	 * Methods to edit sent messages *
	 *********************************/

	/**
	 * Use this method to edit text messages sent by the bot or via the bot (for inline bots). On success, the edited [Message]{@link https://core.telegram.org/bots/api#message} is returned.
	 *
	 * @param {Object} args	Arguments for the method
	 * @param {Integer|String} args.chat_id	Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername)
	 * @param {Integer} args.message_id	Required if inline_message_id is not specified. Unique identifier of the sent message
	 * @param {String} args.inline_message_id	Required if chat_id and message_id are not specified. Identifier of the inline message
	 * @param {String} args.text	New text of the message
	 * @param {String} [args.parse_mode]	Send Markdown or HTML, if you want Telegram apps to show bold, italic, fixed-width text or inline URLs in your bot's message.
	 * @param {Boolean} [args.disable_web_page_preview]	Disables link previews for links in this message
	 * @param {InlineKeyboardMarkup} [args.reply_markup]	A JSON-serialized object for an [inline keyboard]]{@link https://core.telegram.org/bots/api#inlinekeyboardmarkup}
	 * @param {Function} [cb]	A callback which will be called with the usual "error" and "result" arguments when the call completes
	 *
	 * @return {Promise}	A promise which resolves to the edited [Message]{@link https://core.telegram.org/bots/api#message} object when the method call completes
	 */
	editMessageText(args, cb) {
		return this._doRequest("editMessageText", args, cb);
	}

	/**
	 * Use this method to edit text messages sent by the bot or via the bot (for inline bots). On success, the edited [Message]{@link https://core.telegram.org/bots/api#message} is returned.
	 *
	 * @param {Object} args	Arguments for the method
	 * @param {Integer|String} args.chat_id	Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername)
	 * @param {Integer} args.message_id	Required if inline_message_id is not specified. Unique identifier of the sent message
	 * @param {String} args.inline_message_id	Required if chat_id and message_id are not specified. Identifier of the inline message
	 * @param {String} args.caption	New caption of the message
	 * @param {InlineKeyboardMarkup} [args.reply_markup]	A JSON-serialized object for an [inline keyboard]]{@link https://core.telegram.org/bots/api#inlinekeyboardmarkup}
	 * @param {Function} [cb]	A callback which will be called with the usual "error" and "result" arguments when the call completes
	 *
	 * @return {Promise}	A promise which resolves to the edited [Message]{@link https://core.telegram.org/bots/api#message} object when the method call completes
	 */
	editMessageCaption(args, cb) {
		return this._doRequest("editMessageCaption", args, cb);
	}

	/**
	 * Use this method to edit only the reply markup of messages sent by the bot or via the bot (for inline bots). On success, the edited [Message]{@link https://core.telegram.org/bots/api#message} is returned.
	 *
	 * @param {Object} args	Arguments for the method
	 * @param {Integer|String} args.chat_id	Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername)
	 * @param {Integer} args.message_id	Required if inline_message_id is not specified. Unique identifier of the sent message
	 * @param {String} args.inline_message_id	Required if chat_id and message_id are not specified. Identifier of the inline message
	 * @param {InlineKeyboardMarkup} [args.reply_markup]	A JSON-serialized object for an [inline keyboard]]{@link https://core.telegram.org/bots/api#inlinekeyboardmarkup}
	 * @param {Function} [cb]	A callback which will be called with the usual "error" and "result" arguments when the call completes
	 *
	 * @return {Promise}	A promise which resolves to the edited [Message]{@link https://core.telegram.org/bots/api#message} object when the method call completes
	 */
	editMessageReplyMarkup(args, cb) {
		return this._doRequest("editMessageReplyMarkup", args, cb);
	}

	/****************
	 * Misc methods *
	 ****************/

	/**
	 * A simple method for testing your bot's auth token. Requires no parameters. Returns basic information about the bot in form of a [User]{@link https://core.telegram.org/bots/api#user} object.
	 *
	 * @param {Object} args	This is here to make the method's signature equal to the others. Put anything here, really. It will be ignored. If you use promises, just ignore this
	 * @param {Function} [cb]	A callback which will be called with the usual "error" and "result" arguments when the call completes
	 *
	 * @return {Promise}	A promise which resolves to a [User]{@link https://core.telegram.org/bots/api#user} object when the method call completes
	 */
	getMe(args, cb) {
		return this._doRequest("getMe", {}, cb);
	}

	/**
	 * Use this method to get a list of profile pictures for a user. Returns a [UserProfilePhotos]{@link https://core.telegram.org/bots/api#userprofilephotos} object.
	 *
	 * @param {Object} args	Arguments for the method
	 * @param {Integer} args.user_id	Unique identifier of the target user
	 * @param {Integer} [args.offset]	Sequential number of the first photo to be returned. By default, all photos are returned.
	 * @param {Integer} [args.limit]	Limits the number of photos to be retrieved. Values between 1—100 are accepted. Defaults to 100.
	 * @param {Function} [cb]	A callback which will be called with the usual "error" and "result" arguments when the call completes
	 *
	 * @return {Promise}	A promise which resolves to a [UserProfilePhotos]{@link https://core.telegram.org/bots/api#userprofilephotos} object when the method call completes
	 */
	getUserProfilePhotos(args, cb) {
		return this._doRequest("getUserProfilePhotos", args, cb);
	}

	/**
	 * Use this method to get basic info about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a [File]{@link https://core.telegram.org/bots/api#file} object is returned. The file can then be downloaded via the link https://api.telegram.org/file/bot<token>/<file_path>, where <file_path> is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling getFile again.
	 * @param {Object} args	Arguments for the method
	 * @param {String} args.file_id	File identifier to get info about
	 * @param {Function} [cb]	A callback which will be called with the usual "error" and "result" arguments when the call completes
	 *
	 * @return {Promise}	A promise which resolves to a [File]{@link https://core.telegram.org/bots/api#file} object when the method call completes
	 */
	getFile(args, cb) {
		return this._doRequest("getFile", args, cb);
	}

	/**
	 * Use this method to kick a user from a group or a supergroup. In the case of supergroups, the user will not be able to return to the group on their own using invite links, etc., unless unbanned first. The bot must be an administrator in the group for this to work. Returns True on success.
	 *
	 * Note: This will method only work if the ‘All Members Are Admins’ setting is off in the target group. Otherwise members may only be removed by the group's creator or by the member that added them.
	 *
	 * @param {Object} args	Arguments for the method
	 * @param {Integer|String} args.chat_id	Unique identifier for the target chat or username of the target channel (in the format @channelusername)
	 * @param {Integer} args.user_id	Unique identifier of the target user
	 * @param {Function} [cb]	A callback which will be called with the usual "error" and "result" arguments when the call completes
	 *
	 * @return {Promise}	A promise which resolves when the method call completes
	 */
	kickChatMember(args, cb) {
		return this._doRequest("kickChatMember", args, cb);
	}

	/**
	 * Use this method to unban a previously kicked user in a supergroup. The user will not return to the group automatically, but will be able to join via link, etc. The bot must be an administrator in the group for this to work. Returns True on success
	 *
	 * @param {Object} args	Arguments for the method
	 * @param {Integer|String} args.chat_id	Unique identifier for the target chat or username of the target channel (in the format @channelusername)
	 * @param {Integer} args.user_id	Unique identifier of the target user
	 * @param {Function} [cb]	A callback which will be called with the usual "error" and "result" arguments when the call completes
	 *
	 * @return {Promise}	A promise which resolves to a boolean when the method call completes. True if successful, false otherwise
	 */
	unbanChatMember(args, cb) {
		return this._doRequest("unbanChatMember", args, cb);
	}

	/**
	 * Use this method to send answers to callback queries sent from inline keyboards. The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, True is returned.
	 *
	 * @param {Object} args	Arguments for the method
	 * @param {String} args.callback_query_id	Unique identifier for the query to be answered
	 * @param {String} [args.text]	Text of the notification. If not specified, nothing will be shown to the user
	 * @param {Boolean} [args.show_alert]	If true, an alert will be shown by the client instead of a notification at the top of the chat screen. Defaults to false.
	 * @param {Function} [cb]	A callback which will be called with the usual "error" and "result" arguments when the call completes
	 * 
	 * @return {Promise}	A promise which resolves to a boolean when the method call completes. True if successful, false otherwise
	 */
	answerCallbackQuery(args, cb) {
		return this._doRequest("answerCallbackQuery", args, cb);
	}

	/**
	 * Use this method to send answers to an inline query. On success, True is returned.
	 *
	 * No more than 50 results per query are allowed.
	 *
	 * @param {Object} args	Arguments for the method
	 * @param {String} args.inline_query_id	Unique identifier for the answered query
	 * @param {InlineQueryResult[]} args.results	A JSON-serialized array of [results]{@link https://core.telegram.org/bots/api#inlinequeryresult} for the inline query
	 * @param {Integer} [args.cache_time]	The maximum amount of time in seconds that the result of the inline query may be cached on the server. Defaults to 300.
	 * @param {Boolean} [args.is_personal]	Pass True, if results may be cached on the server side only for the user that sent the query. By default, results may be returned to any user who sends the same query
	 * @param {String} [args.next_offset]	Pass the offset that a client should send in the next query with the same text to receive more results. Pass an empty string if there are no more results or if you don‘t support pagination. Offset length can’t exceed 64 bytes.
	 * @param {String} [args.switch_pm_text]	If passed, clients will display a button with specified text that switches the user to a private chat with the bot and sends the bot a start message with the parameter switch_pm_parameter
	 * @param {String} [args.switch_pm_parameter]	Parameter for the start message sent to the bot when user presses the switch button

	 * @param {Function} [cb]	A callback which will be called with the usual "error" and "result" arguments when the call completes
	 *
	 * @return {Promise}	A promise which resolves to a boolean when the method call completes
	 */
	answerInlineQuery(args, cb) {
		return this._doRequest("answerInlineQuery", args, cb);
	}

	/****************************************************************
	 * The all-important doRequest method which actually does stuff *
	 ****************************************************************/

	/**
	 * Internal API method. DO NOT USE. Sends the actual request to the API server
	 * @param {String} method	Name of the method to use
	 * @param {Object} args	An object containing arguments for the method
	 * @param {Function} [cb]	A callback function to run when the request is completed. Gets the standard "error" and "result" arguments
	 *
	 * @return {Promise}	A promise which resolves when the method call completes
	 *
	 * @private
	 */
	_doRequest(method, args, cb) {
		// Set a dummy cb if it is not a function
		if (!(cb instanceof Function)) {
			cb = () => {};
		}

		// Parse the URL
		let url = this.methodUrlBase + method;
		url = url.replace("<token>", this.token);
		url = urlParser.parse(url);

		// JSON-serialize every value in the args except input files, which the stream will be extracted from if it is not just a file ID
		for (let p in args) {
			if (args[p] instanceof InputFile) {
				// This is an input file. If it is a file ID, just let it go. Otherwise, it's the stream we want
				if (args[p].file_data != null) {
					args[p] = args[p].file_data;
				} else {
					args[p] = args[p].file_id;
				}
			} else if (args[p] instanceof Object || typeof args[p] == "boolean") {
				// Stringify the object
				args[p] = JSON.stringify(args[p]);
			}
		}

		// Create the form
		let form = new FormData();

		// Fill data into the form
		let dataProvided = false;
		for (let field in args) {
			dataProvided = true;
			form.append(field, args[field]);
		}

		// Check if data was provided. This is a hack to make stuff work if no parameters were passed to a method
		if (!dataProvided) {
			form.getHeaders = () => {return {};}
		}

		// Do the request
		let req = https.request({
			host: url.host,
			path: url.path,
			method: "POST",
			headers: form.getHeaders()
		});

		// Create the promise to return
		return new Promise((resolve, reject) => {
			// Set timeout on the request
			req.setTimeout(this.requestTimeout, () => {
				req.abort();
				let err = new Error("Connection timed out on method " + method);
				cb(err, null);
				reject(err);
			});

			// Listen for the response
			req.on("response", res => {
				// Buffer to hold the result body
				let result = "";

				res.on("data", chunk => {
					// Concatenate all chunks
					result = result + chunk.toString("utf-8");
				});
				res.on("end", () => {
					try {
						// Try to parse the result as JSON
						result = JSON.parse(result);
		
						// Parsing went OK. Did everything go well on Telegram's end?
						if (!result.ok) {
							let err = new Error(result.description);
							cb(err, null);
							reject(err);
						} else {
							cb(null, result.result);
							resolve(result.result);
						}
					} catch (e) {
						// Parsing went wrong
						cb(e, null);
						reject(e);
					}

				});
				res.on("error", e => {	// Will this ever happen? The docs don't specify an error event
					console.log("Response error:", e);
					cb(e, null);
					reject(e);
				});
			});

			// Check for errors
			req.on("error", e => {	// Will this ever happen? The docs don't specify an error event
				console.log("Request error:", e);
				cb(e, null);
				reject(e);
			});

			// Send the body
			form.pipe(req);
		});
	}

	/**
	 * The API method {@link BotAPI#getFile} does not actually get the file, it only gets a path where you can download the file from. This method actually sends the download request and gives you a download stream of the type [HTTP incoming message]{@link https://nodejs.org/api/http.html#http_http_incomingmessage}, which you can do whatever you want with
	 *
	 * @param {File} file	The [File]{@link https://core.telegram.org/bots/api#file} object returned from {@link BotAPI#getFile}
	 * @param {Function} [cb]	A callback which will be called with the usual "error" and "result" arguments when the call completes. "Result" will be a download stream for the file
	 *
	 * @return {Promise}	A promise which resolves to a HTTP response stream when the file stream is ready
	 */
	helperGetFileStream(file, cb) {
		if (!(cb instanceof Function)) {
			cb = () => {};
		}

		// Download the file
		let url = this.fileUrlBase + file.file_path;
		url = url.replace("<token>", this.token);

		return new Promise((resolve, reject) => {
			let req = https.get(url, res => {
				cb(null, res);	// Return the response object
				resolve(res);
			});
			req.on("error", e => {
				args.cb(e, null);	// Something went wrong with the request
				reject(e);
			});
		});
	}
}

/***************
 *  DataTypes  *
 ***************/

/**
 * A class of which instances can be given to {@link BotAPI#sendDocument} or other methods which uploads files to Telegram.
 */
class InputFile {
	/**
	 * Creates a new instance of an InputFile
	 *
	 * @param {String|Buffer|stream.Readable} data	The data for the input file. If this is a string, it will be interpreted as a file_id to resend a file already uploaded to the Telegram servers. If given a buffer or instance of stream.Readable, the data will be uploaded to Telegram
	 * @param {String} [filename]	Defaults to "Some file" if not given and data is not an instance of fs.ReadStream, in which case it will be named after the file which the stream is reading. Has no effect if data is a string
	 */
	constructor(data, filename) {
		this.file_id = null;
		this.file_data = null;

		let defaultFilename = "Some file";

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
		} else if (data instanceof InputFile) {
			// This is already an input file
			this.file_id = data.file_id;
			this.file_data = data.file_data;
		} else {
			// Can't make sense of the data. Throw an error
			throw new Error("Invalid data for InputFile");
		}
	}
}

/************
 * Exports  *
 ************/

module.exports.BotAPI = BotAPI;
module.exports.InputFile = InputFile;
