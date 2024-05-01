const { get } = require('axios');

module.exports.config = {
    name: "ai",
    version: "1.0.0",
    role: 0,
    hasPrefix: true,
    description: "Talk to AI with continuous conversation.",
    aliases: [],
    usages: "[prompt]",
    cooldown: 0,
};

module.exports.run = async function({ api, event, args }) {
    function sendMessage(msg) {
        api.sendMessage(msg, event.threadID, event.messageID);
    }

    if (!args[0]) return sendMessage('Please provide a question first.');

    const prompt = args.join(" ");
    const url = `https://deku-rest-api.replit.app/gpt4?prompt=${encodeURIComponent(prompt)}&uid=${event.senderID}`;

    try {
        const response = await get(url);
        const data = response.data;
        const message = `${data.gpt4}`;
        const bottomMessage = "Bot made by Pogi @John Longno";
        const colorfulBottomMessage = `\u001b[31m\u001b[1m${bottomMessage}\u001b[0m`; // Red color with bold font
        const finalMessage = `${message}\n${colorfulBottomMessage}`;
        return sendMessage(finalMessage);
    } catch (error) {
        return sendMessage(error.message);
    }
}
