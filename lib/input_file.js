"use strict";

/************
 * Requires * 
 ************/

const fs = require("fs");
const stream = require("stream");

/*************
 * InputFile *
 *************/

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

/***********
 * Exports *
 ***********/

module.exports = InputFile;
