/*
⚡ Project      : AKIDA BOT
👑 Developer    : Guru
📦 Repository   : https://github.com/itsguruu/Akida
📞 Channel      : https://tinyurl.com/2dgykp48
*/

const { malvin } = require('../malvin');
const config = require('../settings');
const moment = require("moment-timezone");

malvin({
  pattern: "owner",
  react: "👑",
  desc: "Display the owner's contact and bot details",
  category: "main",
  filename: __filename
}, async (malvin, mek, m, { from, reply }) => {
  try {
    const ownerName = config.OWNER_NAME || "GURU";
    const ownerNumber = config.OWNER_NUMBER || "254105521300";
    const version = config.version || "2.0.0";
    const timezone = config.TIMEZONE || "Africa/Nairobi";
    const currentTime = moment().tz(timezone).format("HH:mm:ss");
    const currentDate = moment().tz(timezone).format("dddd, MMMM Do YYYY");

    // Metallic Owner Info
    const caption = `
╭━━━〔 ⚡ *A K I D A  -  O W N E R* ⚡ 〕━━━╮
┃ 👤 ᴏᴡɴᴇʀ: *${ownerName}*
┃ 📞 ɴᴜᴍʙᴇʀ: *${ownerNumber}*
┃ ⚙️ ᴠᴇʀꜱɪᴏɴ: *${version}*
┃ 📆 ᴅᴀᴛᴇ: *${currentDate}*
┃ 🕓 ᴛɪᴍᴇ: *${currentTime}*
┃ 🌐 ᴄʜᴀɴɴᴇʟ: https://tinyurl.com/2dgykp48
┃ 💬 ʙᴏᴛ: *AKIDA WHATSAPP BOT*
┃ 🧠 ᴅᴇᴠᴇʟᴏᴘᴇʀ: *Guru Tech Labs*
╰━━━━━━━━━━━━━━━━━━━━━━━╯
> *Stay connected. Stay updated 🔥*
`.trim();

    // Build vCard Contact
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${ownerName}`,
      `ORG:AKIDA Tech`,
      `TITLE:Developer & Creator`,
      `TEL;type=CELL;type=VOICE;waid=${ownerNumber.replace('+', '')}:${ownerNumber}`,
      "URL:https://tinyurl.com/2dgykp48",
      "END:VCARD"
    ].join('\n');

    // Send Contact Card
    await malvin.sendMessage(from, {
      contacts: {
        displayName: ownerName,
        contacts: [{ vcard }]
      }
    });

    // Send Metallic Image + Caption
    await malvin.sendMessage(from, {
      image: { url: "https://i.imgur.com/tAKB8DP.jpeg" }, // AKIDA metallic logo
      caption,
      contextInfo: {
        mentionedJid: [`${ownerNumber.replace('+', '')}@s.whatsapp.net`],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363299029326322@newsletter',
          newsletterName: 'AKIDA Updates',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

    // Auto “Connected” Banner
    const banner = `
╭───────────────❖
│ ⚡ *CONNECTED TO AKIDA BOT*
│ 👑 Powered by: *Guru*
│ 🌐 Channel: https://tinyurl.com/2dgykp48
│ 🕓 ${currentTime} | ${currentDate}
╰───────────────❖
> *Your connection is live 🚀*
`.trim();

    await new Promise(r => setTimeout(r, 800));
    await malvin.sendMessage(from, { text: banner }, { quoted: mek });

  } catch (error) {
    console.error("❌ Error in .owner command:", error);
    reply(`⚠️ An error occurred: ${error.message}`);
  }
});
