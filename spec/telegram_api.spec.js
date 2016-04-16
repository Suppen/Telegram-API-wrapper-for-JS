"use strict";

// Import teleapiwrapper to test it 
const teleapiwrapper = require("../telegram_api");
const fs = require("fs");

// Function to put thens and catches on promises
function testPromise(promise, done) {
	promise.then(res => {
		expect(res).not.toBeNull();
		done();
	}).catch(err => {
		// Hacky method to manually fail the test
		expect(err).toBeNull();
		done();
	});
}

// Start the testing
describe("teleapiwrapper", () => {
	// Load the settings
	const settings = JSON.parse(fs.readFileSync(__dirname + "/testsettings.json"));
	if (settings.token === "") {
		throw new Error("Please set a proper token in spec/testsettings.json to test with");
	} else if (settings.chatId === 0) {
		throw new Error("Please set a proper chat ID in spec/testsettings.json to test with");
	}

	let bot = null;
	it("should be able to create a bot", () => {
		bot = new teleapiwrapper.BotAPI(settings.token);

		expect(bot instanceof teleapiwrapper.BotAPI).toBe(true);
	});

	// BotAPI.getMe
	it("should be able to get info about the bot with promises", done => {
		testPromise(bot.getMe(), done);
	});

	// BotAPI.getUpdates
	let fileUpdate = null;
	it("should be able to get updates with a promise", done => {
		bot.getUpdates().then(updates => {
			expect(updates).not.toBeNull();
			if (updates.length > 0) {
				fileUpdate = updates[updates.length-1];
			}
			done();
		}).catch(err => {
			expect(err).toBeNull();
			done();
		});
	});

	// getFile
	let fileObj = null;
	it("should be able to get file metadata", done => {
		if (fileUpdate === null) {
			expect(new Error("Please send the bot a file to test the getFile method")).toBeNull();
		} else {
			try {
				bot.getFile({file_id: fileUpdate.message.document.file_id}).then(file => {
					expect(file).not.toBeNull();
					fileObj = file;
					done();
				}).catch(err => {
					expect(err).toBeNull();
					done();
				});
			} catch (e) {
				expect(new Error("Are you sure the last thing anybody sent the bot was a file?")).toBeNull();
				done();
			}
		}
	});

	// helper.downloadFile
	it("should be able to get a HTTP response stream with the file", done => {
		if (fileUpdate !== null) {
			testPromise(bot.helperGetFileStream(fileObj), done);
		}
	});

	let chatId = settings.chatId;
	// Text
	it("should be able to send a text message to a chat with a promise", done => {
		testPromise(bot.sendMessage({chat_id: chatId, text: "Testing text with promise", disable_notification: true}), done);
	});

	// Photos
	let sendObj = {chat_id: chatId, disable_notification: true};
	it("should send a photo to the chat using a readable stream", done => {
		sendObj.photo = new teleapiwrapper.InputFile(fs.createReadStream(__dirname + "/" + settings.testPhoto), "Suppen.png");
		sendObj.caption = "Photo test with stream.Readable";
		testPromise(bot.sendPhoto(sendObj), done);
	});
	it("should send a photo to the chat using a buffer", done => {
		sendObj.photo = new teleapiwrapper.InputFile(fs.readFileSync(__dirname + "/" + settings.testPhoto), "Suppen.png");
		sendObj.caption = "Photo test with Buffer";
		bot.sendPhoto(sendObj)
			.then(res => {
				expect(res).not.toBeNull();

				// Save a reference to the photo, for the next test
				this.photoId = res.photo[0].file_id;
				done();
			}).catch(err => {
				// Hacky method to manually fail the test
				expect(err).toBeNull();
				done();
			});
	});
	it("should resend a photo to the chat by photo ID without using InputFile", done => {
		sendObj.photo = new teleapiwrapper.InputFile(this.photoId, "Suppen.png");
		sendObj.caption = "Photo test with just the photo ID";
		testPromise(bot.sendPhoto(sendObj), done);
	});
	it("should resend a photo to the chat by photo ID using InputFile", done => {
		sendObj.photo = this.photoId;
		sendObj.caption = "Photo test with photo ID and InputFile";
		testPromise(bot.sendPhoto(sendObj), done);
	});

	// Documents
	it("should send a document to the chat using a readable stream", done => {
		let document = new teleapiwrapper.InputFile(fs.createReadStream(__dirname + "/" + settings.testPhoto), "Virus.exe");
		testPromise(bot.sendDocument({chat_id: chatId, caption: "Document test with stream.Readable", document: document, disable_notification: true}), done);
	});

	// If both photo and document succeeds, just assume all file sendings will succeed

	// Location
	it("should send a location to the chat", done => {
		testPromise(bot.sendLocation({chat_id: chatId, latitude: 60.3903995, longitude: 5.3207311, disable_notification: true}), done);
	});

	// Venue
	it("should send a venue to the chat", done => {
		testPromise(bot.sendVenue({chat_id: chatId, latitude: 60.3903995, longitude: 5.3207311, title: "Bergen", address: "Bergen", disable_notification: true}), done);
	});

	// Contact
	it("should send a contact to the chat", done => {
		testPromise(bot.sendContact({chat_id: chatId, phone_number: "+4711223344", first_name: "Kake", disable_notification: true}), done);
	});
});
