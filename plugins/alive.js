const { malvin } = require("../malvin");
const config = require("../settings");
const { runtime } = require('../lib/functions');
const moment = require("moment-timezone");

// Primary & fallback images
const ALIVE_IMG = "https://url.bwmxmd.online/Adams.xm472dqv.jpeg";
const FALLBACK_IMG = "https://i.imgur.com/tAKB8DP.jpeg";

malvin({
    pattern: "alive",
    desc: "Check if AKIDA bot is active",
    category: "main",
    react: "⚡",
    filename: __filename
}, async (malvin, mek, m, { reply, from }) => {
    try {
        const pushname = m.pushName || "User";
        const username = `@${m.sender.split('@')[0]}`;
        const timezone = "Africa/Nairobi";
        const now = moment().tz(timezone);
        const currentTime = now.format("hh:mm:ss A");
        const currentDate = now.format("dddd, MMMM Do YYYY");
        const uptime = runtime(process.uptime());

        // Fancy small-caps stylizer
        const fancy = (txt) =>
            txt.split('').map(c => {
                const t = {
                    A:'ᴀ',B:'ʙ',C:'ᴄ',D:'ᴅ',E:'ᴇ',F:'ғ',G:'ɢ',H:'ʜ',I:'ɪ',
                    J:'ᴊ',K:'ᴋ',L:'ʟ',M:'ᴍ',N:'ɴ',O:'ᴏ',P:'ᴘ',Q:'ǫ',R:'ʀ',
                    S:'s',T:'ᴛ',U:'ᴜ',V:'ᴠ',W:'ᴡ',X:'x',Y:'ʏ',Z:'ᴢ'
                };
                return t[c.toUpperCase()] || c;
            }).join('');

        const caption = `
╭━━━〔 ⚡ ${fancy("AKIDA Alive")} ⚡ 〕━━━⊷
┃ 👋 ʜᴇʟʟᴏ ${username}!
┃ 🧠 ɴᴀᴍᴇ : *${pushname}*
┃ 🕓 ᴛɪᴍᴇ : *${currentTime}*
┃ 📅 ᴅᴀᴛᴇ : *${currentDate}*
┃ ⚙️ ᴍᴏᴅᴇ : *${config.MODE}*
┃ 🧭 ᴜᴘᴛɪᴍᴇ : *${uptime}*
┃ 👑 ᴏᴡɴᴇʀ : *GURU*
┃ 🔗 ᴄʜᴀɴɴᴇʟ : https://tinyurl.com/2dgykp48
┃ 💎 ᴠᴇʀꜱɪᴏɴ : *${config.version || "2.0.0"}*
╰━━━━━━━━━━━━━━━━━━━⊷
> ${fancy("Powered by AKIDA ✨ Elegance. Precision. Speed.")}
`.trim();

        // Try sending main image first
        try {
            await malvin.sendMessage(from, {
                image: { url: ALIVE_IMG },
                caption,
                mentions: [m.sender],
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
            // Fallback if main image fails
            await malvin.sendMessage(from, {
                image: { url: FALLBACK_IMG },
                caption: caption + "\n\n⚠️ Primary image unavailable — using fallback.",
                mentions: [m.sender]
            }, { quoted: mek });
        }

    } catch (err) {
        console.error("❌ Alive Command Error:", err.message);
        return reply(`❌ *Alive Command Error:*\n${err.message}`);
    }
});
