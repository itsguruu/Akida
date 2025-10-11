const config = require('../settings');
const { malvin } = require('../malvin');

malvin({
    pattern: "list",
    alias: ["listcmd", "commands"],
    desc: "Show bot command menu",
    category: "menu",
    react: "⚡",
    filename: __filename
}, async (malvin, mek, m, { from, reply }) => {
    try {
        const dec = `
╭━━━〘 ⚙️ 𝐀𝐊𝐈𝐃𝐀 𝐒𝐘𝐒𝐓𝐄𝐌 ⚙️ 〙━━━╮
│   💠 *ᴏᴡɴᴇʀ:* GURU
│   ⚡ *ᴠᴇʀꜱɪᴏɴ:* 2.0.0
│   📱 *ᴘʀᴇғɪx:* ${config.PREFIX}
│   🪄 *ᴍᴏᴅᴇ:* ${config.MODE}
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭⟢〘 ⚡ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃 𝐂𝐌𝐃 ⚡ 〙⟣
│ ⦿ .play — YouTube audio
│ ⦿ .song — Song from YouTube
│ ⦿ .video — YouTube video
│ ⦿ .fb — Facebook video
│ ⦿ .ig — Instagram video
│ ⦿ .tk — TikTok video
│ ⦿ .mfire — MediaFire files
│ ⦿ .gdrive — Google Drive files
│ ⦿ .apk — Download APK
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭⟢〘 🌸 𝐀𝐍𝐈𝐌𝐄 𝐂𝐌𝐃 🌸 〙⟣
│ ⦿ .anime — Random anime
│ ⦿ .animegirl — Anime girls
│ ⦿ .loli — Romantic anime pics
│ ⦿ .dog — Dog images
│ ⦿ .king — Anime info
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭⟢〘 ℹ️ 𝐈𝐍𝐅𝐎 𝐂𝐌𝐃 ℹ️ 〙⟣
│ ⦿ .alive — Bot status
│ ⦿ .ping — Response speed
│ ⦿ .menu — Main menu
│ ⦿ .ai — Chat with AI
│ ⦿ .status — System status
│ ⦿ .owner — Owner info
│ ⦿ .list — Full command list
│ ⦿ .script — Bot repository
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭⟢〘 🎮 𝐅𝐔𝐍 & 𝐎𝐓𝐇𝐄𝐑 🎮 〙⟣
│ ⦿ .joke — Random joke
│ ⦿ .fact — Random fact
│ ⦿ .githubstalk — GitHub user info
│ ⦿ .gpass — Generate password
│ ⦿ .define — Word meaning
│ ⦿ .hack — Prank friend
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭⟢〘 👥 𝐆𝐑𝐎𝐔𝐏 𝐂𝐌𝐃 👥 〙⟣
│ ⦿ .mute — Mute group
│ ⦿ .unmute — Unmute
│ ⦿ .tagall — Mention all
│ ⦿ .add — Add member
│ ⦿ .kick — Kick user
│ ⦿ .promote — Admin role
│ ⦿ .demote — Remove admin
│ ⦿ .setwelcome — Welcome msg
│ ⦿ .setgoodbye — Goodbye msg
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭⟢〘 👑 𝐎𝐖𝐍𝐄𝐑 𝐂𝐌𝐃 👑 〙⟣
│ ⦿ .update — Update bot
│ ⦿ .restart — Restart
│ ⦿ .shutdown — Shutdown
│ ⦿ .settings — View settings
│ ⦿ .block — Block user
│ ⦿ .unblock — Unblock
│ ⦿ .setpp — Change profile pic
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭⟢〘 🔄 𝐂𝐎𝐍𝐕𝐄𝐑𝐓 𝐂𝐌𝐃 🔄 〙⟣
│ ⦿ .sticker — Photo to sticker
│ ⦿ .tts — Text to speech
│ ⦿ .trt — Translate text
╰━━━━━━━━━━━━━━━━━━━━━━╯

> 🪶 𝘗𝘰𝘸𝘦𝘳𝘦𝘥 𝘣𝘺 𝐆𝐔𝐑𝐔 × 𝐀𝐊𝐈𝐃𝐀 ʙᴏᴛ
        `.trim();

        await malvin.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL || "https://files.catbox.moe/your_akida_logo.png" },
                caption: dec,
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
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error(e);
        reply(`❌ An error occurred: ${e.message || e}`);
    }
});
