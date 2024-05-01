const { get } = require('axios');
const fs = require('fs');
const path = require('path');

const url = "https://deku-rest-api.replit.app";
const cacheDir = path.join(__dirname, 'cache');
const filePath = path.join(cacheDir, 'emi.png');

module.exports.config = {
	name: "emi",
	version: "1.0.0",
	role: 0,
	hasPrefix: true,
	description: "Generate image in emi",
	usages: "[prompt]",
	cooldown: 5,
	aliases: ["em"]
};

module.exports.run = async function ({ api, event, args }) {
	function sendMessage(msg) {
		api.sendMessage(msg, event.threadID, event.messageID);
	}

	if (!args[0]) return sendMessage('Missing prompt!');

	const prompt = args.join(" ");
	if (!prompt) return sendMessage('Missing prompt!');

	try {
		const response = await get(`${url}/emi?prompt=${encodeURIComponent(prompt)}`, {
			responseType: 'arraybuffer'
		});

		if (response.status === 200) {
			if (!fs.existsSync(cacheDir)) {
				fs.mkdirSync(cacheDir, { recursive: true });
			}
			fs.writeFileSync(filePath, Buffer.from(response.data, "utf8"));
			return sendMessage({ attachment: fs.createReadStream(filePath) });
		} else {
			return sendMessage("Failed to generate image.");
		}
	} catch (error) {
		console.error('Error:', error);
		return sendMessage("An error occurred while processing your request.");
	}
};
