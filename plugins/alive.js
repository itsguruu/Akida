const { malvin } = require("../malvin");
const config = require("../settings");
const { runtime } = require("../lib/functions");
const moment = require("moment");

const ALIVE_IMG = "https://files.catbox.moe/pu5n2m.jpg"; // Elegant metallic AKIDA background

malvin({
    pattern: "alive",
    alias: ["alive2", "status"],
    desc: "Check AKIDA bot's status and uptime",
    category: "main",
    react: "💫",
    filename: __filename
}, async (malvin, mek, m, { reply, from }) => {
    try {
        const pushname = m.pushName || "User";
        const now = moment();
        const currentTime = now.format("HH:mm:ss");
        const currentDate = now.format("dddd, MMMM Do YYYY");
        const uptime = runtime(process.uptime());

        // Stylish small-caps formatter
        const toTinyCap = (text) =>
            text.split("").map((char) => {
                const tiny = {
                    a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ғ", g: "ɢ",
                    h: "ʜ", i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ",
                    o: "ᴏ", p: "ᴘ", q: "ǫ", r: "ʀ", s: "s", t: "ᴛ", u: "ᴜ",
                    v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ"
                };
                return tiny[char.toLowerCase()] || char;
            }).join("");

        // Random emoji for lively look
        const aliveEmoji = ["⚙️", "💠", "🚀", "🌟", "💎", "🛰️", "💫", "🔥"];
        const pickEmoji = aliveEmoji[Math.floor(Math.random() * aliveEmoji.length)];

        // ALIVE message
        const msg = `
╭━━━❰ ${pickEmoji} ＡＫＩＤＡ 𝐒𝐓𝐀𝐓𝐔𝐒 ${pickEmoji} ❱━━━╮
│ 💠 *User:* ${pushname}
│ ⚙️ *Prefix:* ${config.PREFIX}
│ 💻 *Mode:* ${config.MODE}
│ ⏰ *Time:* ${currentTime}
│ 📅 *Date:* ${currentDate}
│ ⏱️ *Uptime:* ${uptime}
│ 🧠 *Version:* 2.0.0
│ 👑 *Owner:* Guru
│ 🔗 *Channel:* https://shorturl.at/DYEi0
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

╭─❰ 💬 𝐀𝐊𝐈𝐃𝐀 𝐑𝐄𝐒𝐏𝐎𝐍𝐒𝐄 ❱─╮
│ 🟢 Online and fully operational
│ 💎 Powered by Guru’s Intelligence
│ 🌐 Always active to serve you
╰──────────────────────────────╯
> *ᴛʜᴇ ғᴜᴛᴜʀᴇ ɪs ᴀɪ — ᴀɴᴅ ɪᴛ's ᴀᴋɪᴅᴀ ⚙️*
        `.trim();

        // Send message with metallic style image
        await malvin.sendMessage(from, {
            image: { url: ALIVE_IMG },
            caption: msg,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363299029326322@newsletter',
                    newsletterName: 'GURU',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (err) {
        console.error("❌ Error in .alive:", err);
        return reply(`❌ *Alive Command Error:*\n${err.message}`);
    }
});
