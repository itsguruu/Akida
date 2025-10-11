/*
⚡ Project       : AKIDA BOT
👑 Developer     : Guru (Guru Tech Labs)
🌍 Timezone      : Africa/Nairobi
📦 Repository    : https://github.com/itsguruu/Akida
📡 Channel       : https://shorturl.at/DYEi0
🧠 Description   : Auto Bio Updater with random quotes, live Kenya time, and auto-start.
*/

const axios = require('axios');
const config = require('../settings');
const { malvin } = require('../malvin');
const fs = require('fs');

let bioInterval;

// Default bio pattern
const defaultBio = config.AUTO_BIO_TEXT || 
"⚡ ᴀᴋɪᴅᴀ | {quote} | 🇰🇪 {time}";

// API and fallback
const quoteApiUrl = config.QUOTE_API_URL || 'https://apis.davidcyriltech.my.id/random/quotes';
const fallbackQuotes = [
    "Stay curious, keep learning.",
    "Dream big, work hard, shine brighter.",
    "The best is yet to come.",
    "Focus on progress, not perfection.",
    "Be real. Be kind. Be Guru-level awesome."
];

const updateInterval = config.AUTO_BIO_INTERVAL || 45 * 1000; // 45s

// 🕒 Get Kenya time
function getKenyaTime() {
    return new Date().toLocaleString('en-US', {
        timeZone: 'Africa/Nairobi',
        hour12: true,
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });
}

// 📡 Main command
malvin({
    pattern: 'autobio',
    alias: ['autoabout', 'setbio'],
    desc: 'Enable automatic WhatsApp bio updates with random quotes and Kenya time',
    category: 'system',
    filename: __filename,
    usage: `${config.PREFIX}autobio on/off [text]`
}, async (malvin, mek, m, { args, reply, isOwner }) => {
    if (!isOwner) return reply("❌ *Only the bot owner can use this command.*");

    const [action, ...bioParts] = args;
    const customBio = bioParts.join(' ') || defaultBio;

    try {
        if (action === 'on') {
            if (config.AUTO_BIO === "true") return reply("⚙️ Auto-bio is already enabled.");
            config.AUTO_BIO = "true";
            config.AUTO_BIO_TEXT = customBio;
            startAutoBio(malvin, customBio);
            return reply(`✅ *Auto-Bio Enabled!*\n📝 Current: "${customBio}"`);

        } else if (action === 'off') {
            if (config.AUTO_BIO !== "true") return reply("⚙️ Auto-bio is already disabled.");
            config.AUTO_BIO = "false";
            stopAutoBio();
            return reply("🛑 *Auto-Bio Disabled.*");

        } else {
            const menuText = `
╭━〔 ⚡ *Aᴋɪᴅᴀ Aᴜᴛᴏ-ʙɪᴏ* ⚡ 〕━⊷
│ 💡 Usage:
│ • ${config.PREFIX}autobio on [text] – Enable
│ • ${config.PREFIX}autobio off – Disable
│
│ 🏷 Placeholders:
│ • {quote} → random quote
│ • {time} → Kenya time
│
│ 🔄 Status: ${config.AUTO_BIO === "true" ? "🟢 ON" : "🔴 OFF"}
│ 📝 Bio Text: "${config.AUTO_BIO_TEXT || defaultBio}"
│ 🕒 Time: ${getKenyaTime()}
│
│ 👑 Developer: *Guru | AKIDA Tech Labs*
│ 🔗 Channel: https://shorturl.at/DYEi0
╰━━━━━━━━━━━━━━━━━━━━━━━⊷`.trim();

            return reply(menuText);
        }
    } catch (error) {
        console.error('AutoBio Error:', error);
        reply("❌ Failed to update Auto-Bio settings.");
    }
});

// 🧠 Get random quote
async function fetchQuote() {
    try {
        const res = await axios.get(quoteApiUrl);
        return res.data?.content || fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    } catch {
        return fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    }
}

// 🚀 Start updater
async function startAutoBio(malvin, bioText) {
    stopAutoBio();

    async function updateBio() {
        try {
            const quote = await fetchQuote();
            const time = getKenyaTime();
            const newBio = bioText.replace('{quote}', quote).replace('{time}', time);
            await malvin.updateProfileStatus(newBio);
            console.log(`✅ Updated Bio → ${newBio}`);
        } catch (err) {
            console.error("❌ Bio update failed:", err.message);
        }
    }

    await updateBio();
    bioInterval = setInterval(updateBio, updateInterval);
}

// 🧩 Stop updater
function stopAutoBio() {
    if (bioInterval) clearInterval(bioInterval);
    bioInterval = null;
}

// ⚙️ Auto-enable when bot starts or reconnects
module.exports.init = async (malvin) => {
    console.log("🚀 Checking auto-bio settings...");
    if (config.AUTO_BIO === "true" || config.AUTO_BIO === true) {
        const bioText = config.AUTO_BIO_TEXT || defaultBio;
        console.log("✅ Auto-Bio is enabled. Starting updater...");
        await startAutoBio(malvin, bioText);
    } else {
        console.log("ℹ️ Auto-Bio is disabled in settings. Use '.autobio on' to enable.");
    }
};
