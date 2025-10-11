const { malvin } = require("../malvin");
const config = require("../settings");
const os = require("os");
const { runtime } = require('../lib/functions');
const moment = require("moment-timezone");
const axios = require("axios");

// Primary & fallback alive image
const ALIVE_IMG = "https://files.catbox.moe/r5d1tp.jpg";  // Your main one
const FALLBACK_IMG = "https://files.catbox.moe/r5d1tp.jpg";            // Backup if main fails

malvin({
    pattern: "alive",
    desc: "Check if AKIDA bot is running smoothly",
    category: "main",
    react: "💠",
    filename: __filename
}, async (malvin, mek, m, { reply, from }) => {
    try {
        const pushname = m.pushName || "User";
        const timezone = "Africa/Nairobi";
        const now = moment().tz(timezone);
        const currentTime = now.format("hh:mm:ss A");
        const currentDate = now.format("dddd, MMMM Do YYYY");
        const uptime = runtime(process.uptime());
        const owner = config.OWNER_NAME || "GURU";

        // Small stylizer
        const stylize = (text) => text.split('').map(c => {
            const tiny = {
                A:'ᴀ', B:'ʙ', C:'ᴄ', D:'ᴅ', E:'ᴇ', F:'ғ', G:'ɢ', H:'ʜ', I:'ɪ',
                J:'ᴊ', K:'ᴋ', L:'ʟ', M:'ᴍ', N:'ɴ', O:'ᴏ', P:'ᴘ', Q:'ǫ', R:'ʀ',
                S:'s', T:'ᴛ', U:'ᴜ', V:'ᴠ', W:'ᴡ', X:'x', Y:'ʏ', Z:'ᴢ'
            };
            return tiny[c.toUpperCase()] || c;
        }).join('');

        const caption = `
╭━━━〔 💠 ${stylize("AKIDA Alive")} 💠 〕━━━⊷
┃ 👋 ${stylize("Hello")}, *${pushname}*!
┃ 🕓 ${stylize("Time")}: ${currentTime}
┃ 📅 ${stylize("Date")}: ${currentDate}
┃ ⚙️ ${stylize("Mode")}: ${config.MODE}
┃ 🧭 ${stylize("Uptime")}: ${uptime}
┃ 💎 ${stylize("Owner")}: ${owner}
┃ 🔗 ${stylize("Channel")}: https://shorturl.at/DYEi0
┃ 🤖 ${stylize("Version")}: ${config.version || "2.0.0"}
╰━━━━━━━━━━━━━━━━━━━⊷
> ${stylize("Powering your chats with elegance and speed ✨")}
`.trim();

        // Try sending main image first
        try {
            await malvin.sendMessage(from, {
                image: { url: ALIVE_IMG },
                caption,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363299029326322@newsletter',
                        newsletterName: 'AKIDA | GURU',
                        serverMessageId: 143
                    }
                }
            }, { quoted: mek });

        } catch (err) {
            // fallback image if main fails
            await malvin.sendMessage(from, {
                image: { url: FALLBACK_IMG },
                caption: caption + "\n\n⚠️ Primary image source unavailable, using fallback.",
                contextInfo: {
                    mentionedJid: [m.sender]
                }
            }, { quoted: mek });
        }

    } catch (err) {
        console.error("❌ Alive Command Error:", err.message);
        return reply(`❌ *Alive Command Error:*\n${err.message}`);
    }
});
