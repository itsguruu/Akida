/*
🔧 Project      : AKIDA
👑 Owner        : GURU
📦 Repository   : https://github.com/itsguruu/Akida
📞 Support      : https://wa.me/254105521300
*/

const { malvin } = require('../malvin');
const config = require('../settings');
const { runtime } = require('../lib/functions');
const moment = require('moment-timezone');

malvin({
  pattern: "alive",
  alias: ["status", "online"],
  desc: "Check bot's live status and system info",
  category: "main",
  react: "💫",
  filename: __filename
}, async (malvin, mek, m, { from, reply }) => {
  try {
    const pushname = m.pushName || "User";
    const sender = m.sender.split("@")[0];
    const time = moment().tz("Africa/Nairobi").format("HH:mm:ss A");
    const date = moment().tz("Africa/Nairobi").format("dddd, MMMM Do YYYY");
    const up = runtime(process.uptime());

    const msg = `
╭━━━〔 *⚡ AKIDA SYSTEM STATUS ⚡* 〕━━━╮
│ 👋 ʜᴇʏ *@${sender}* 
│ 🕒 ᴛɪᴍᴇ : *${time}*
│ 📆 ᴅᴀᴛᴇ : *${date}*
│ ⏱️ ᴜᴘᴛɪᴍᴇ : *${up}*
│ ⚙️ ᴍᴏᴅᴇ : *${config.MODE}*
│ 💠 ᴠᴇʀꜱɪᴏɴ : *${config.version || "2.0.0"}*
│ 👑 ᴏᴡɴᴇʀ : *GURU*
│ 🔗 ᴄʜᴀɴɴᴇʟ : *https://tinyurl.com/2dgykp48*
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯
> ᴀᴋɪᴅᴀ ɪꜱ ᴏɴʟɪɴᴇ 💫 ʀᴜɴɴɪɴɢ ꜱᴍᴏᴏᴛʜʟʏ ⚙️
    `.trim();

    // Try sending image first
    try {
      await malvin.sendMessage(from, {
        image: { url: "https://files.catbox.moe/r5d1tp.jpg" },
        caption: msg,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363299029326322@newsletter",
            newsletterName: "GURU",
            serverMessageId: 143
          }
        }
      }, { quoted: mek });
    } catch (err) {
      console.log("⚠️ Alive image failed, using fallback:", err.message);
      await malvin.sendMessage(from, {
        image: { url: "https://i.imgur.com/tAKB8DP.jpeg" },
        caption: msg + "\n\n⚠️ Fallback image used due to rate limit.",
        mentions: [m.sender]
      }, { quoted: mek });
    }

  } catch (err) {
    console.error("❌ Alive command error:", err.message);
    return reply(`❌ *Alive Command Error:*\n${err.message}`);
  }
});
