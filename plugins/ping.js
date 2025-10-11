const config = require('../settings');
const { malvin } = require('../malvin');
const moment = require('moment-timezone');

// Bot start time for uptime calculation
const botStartTime = process.hrtime.bigint();

// Cache for timezone formatting
const formatCache = new Map();

const emojiSets = {
    reactions: ['⚡', '🚀', '💨', '🎯', '🌟', '💎', '🔥', '✨', '🌀', '🔹'],
    bars: [
        '▰▰▰▰▰▰▰▰▰▰',
        '▰▱▱▱▱▱▱▱▱▱',
        '▰▰▱▱▱▱▱▱▱▱',
        '▰▰▰▱▱▱▱▱▱▱',
        '▰▰▰▰▱▱▱▱▱▱'
    ],
    status: [
        { threshold: 0.3, text: '🚀 Super Fast' },
        { threshold: 0.6, text: '⚡ Fast' },
        { threshold: 1.0, text: '⚠️ Medium' },
        { threshold: Infinity, text: '🐢 Slow' }
    ]
};

malvin({
    pattern: 'ping',
    alias: ['speed', 'pong','p'],
    desc: 'Check bot\'s response time and status',
    category: 'main',
    react: '⚡',
    filename: __filename
}, async (malvin, mek, m, { from, sender, reply }) => {
    try {
        // High-resolution start time
        const start = process.hrtime.bigint();

        // Random emoji and loading bar
        const reactionEmoji = emojiSets.reactions[Math.floor(Math.random() * emojiSets.reactions.length)];
        const loadingBar = emojiSets.bars[Math.floor(Math.random() * emojiSets.bars.length)];

        // React with emoji (with retry)
        let attempts = 0;
        const maxAttempts = 2;
        while (attempts < maxAttempts) {
            try {
                await malvin.sendMessage(from, { react: { text: reactionEmoji, key: mek.key } });
                break;
            } catch (reactError) {
                attempts++;
                if (attempts === maxAttempts) throw new Error('Failed to send reaction');
            }
        }

        // Calculate response time in seconds
        const responseTime = Number(process.hrtime.bigint() - start) / 1e9;

        // Determine status based on response time
        const statusText = emojiSets.status.find(s => responseTime < s.threshold)?.text || '🐢 Slow';

        // Time info (cache formatting for performance)
        const timezone = config.TIMEZONE || 'Africa/Harare';
        const cacheKey = `${timezone}:${moment().format('YYYY-MM-DD HH:mm:ss')}`;
        let time, date;
        if (formatCache.has(cacheKey)) {
            ({ time, date } = formatCache.get(cacheKey));
        } else {
            time = moment().tz(timezone).format('HH:mm:ss');
            date = moment().tz(timezone).format('DD/MM/YYYY');
            formatCache.set(cacheKey, { time, date });
            if (formatCache.size > 100) formatCache.clear(); // Prevent memory leak
        }
/*
🔧 Project      : AKIDA BOT
👑 Owner        : GURU
📦 Repository   : https://github.com/itsguruu/Akida
📞 Support      : https://wa.me/254105521300
*/

const config = require('../settings');
const { malvin } = require('../malvin');
const moment = require('moment-timezone');

// Record bot start time for uptime tracking
const botStartTime = process.hrtime.bigint();

// Cache time format results
const formatCache = new Map();

const emojiSets = {
    reactions: ['⚡', '🚀', '💨', '🎯', '🌟', '💎', '🔥', '✨', '🌀', '🔹'],
    bars: [
        '▰▰▰▰▰▰▰▰▰▰',
        '▰▱▱▱▱▱▱▱▱▱',
        '▰▰▱▱▱▱▱▱▱▱',
        '▰▰▰▰▱▱▱▱▱▱',
        '▰▰▰▰▰▰▱▱▱▱'
    ],
    status: [
        { threshold: 0.3, text: '🚀 Ultra Speed' },
        { threshold: 0.6, text: '⚡ Fast & Stable' },
        { threshold: 1.2, text: '⚙️ Running Smooth' },
        { threshold: Infinity, text: '🐢 Bit Slow' }
    ]
};

malvin({
    pattern: 'ping',
    alias: ['speed', 'status', 'p'],
    desc: 'Check AKIDA’s performance and response time',
    category: 'main',
    react: '⚡',
    filename: __filename
}, async (malvin, mek, m, { from, sender, reply }) => {
    try {
        // Start high-resolution timer
        const start = process.hrtime.bigint();

        const reactionEmoji = emojiSets.reactions[Math.floor(Math.random() * emojiSets.reactions.length)];
        const loadingBar = emojiSets.bars[Math.floor(Math.random() * emojiSets.bars.length)];

        await malvin.sendMessage(from, { react: { text: reactionEmoji, key: mek.key } });

        // Calculate latency
        const latency = Number(process.hrtime.bigint() - start) / 1e9;
        const statusText = emojiSets.status.find(s => latency < s.threshold)?.text || '🐢 Slow';

        // Time + Date
        const timezone = 'Africa/Nairobi';
        const cacheKey = `${timezone}:${moment().format('YYYY-MM-DD HH:mm:ss')}`;
        let time, date;
        if (formatCache.has(cacheKey)) {
            ({ time, date } = formatCache.get(cacheKey));
        } else {
            time = moment().tz(timezone).format('HH:mm:ss A');
            date = moment().tz(timezone).format('dddd, MMMM Do YYYY');
            formatCache.set(cacheKey, { time, date });
            if (formatCache.size > 100) formatCache.clear();
        }

        // System uptime & memory
        const uptimeSeconds = Number(process.hrtime.bigint() - botStartTime) / 1e9;
        const uptime = moment.duration(uptimeSeconds, 'seconds').humanize();
        const memory = process.memoryUsage();
        const memoryUsage = `${(memory.heapUsed / 1024 / 1024).toFixed(1)}MB / ${(memory.heapTotal / 1024 / 1024).toFixed(1)}MB`;

        const nodeVersion = process.version;

        // Owner & Bot Info
        const ownerName = 'GURU';
        const botName = 'ＡＫＩＤＡ';
        const repoLink = 'https://github.com/itsguruu/Akida';

        const msg = `
╔═══『 ⚙️ 𝐀𝐊𝐈𝐃𝐀 𝐒𝐘𝐒𝐓𝐄𝐌 𝐒𝐓𝐀𝐓𝐔𝐒 ⚙️ 』═══╗

👋 ʜᴇʏ *@${sender.split("@")[0]}*
━━━━━━━━━━━━━━━━━━━━━━━
🚀 *Status:* ${statusText}
⚡ *Response:* ${latency.toFixed(2)} s
🕒 *Time:* ${time}
📆 *Date:* ${date}
⏱ *Uptime:* ${uptime}
💾 *Memory:* ${memoryUsage}
💻 *Node:* ${nodeVersion}
━━━━━━━━━━━━━━━━━━━━━━━
👑 *Owner:* ${ownerName}
🤖 *Bot:* ${botName}
🔗 *Repo:* ${repoLink}
━━━━━━━━━━━━━━━━━━━━━━━
${loadingBar}
╚═══════════════════════╝
> ᴘᴏᴡᴇʀᴇᴅ ʙʏ *ɢᴜʀᴜ ⚡ ＡＫＩＤＡ*
        `.trim();

        await malvin.sendMessage(from, {
            text: msg,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363299029326322@newsletter',
                    newsletterName: 'GURU',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        await malvin.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (e) {
        console.error('❌ Ping command error:', e);
        await reply(`❌ Error: ${e.message}`);
        await malvin.sendMessage(from, { react: { text: '❌', key: mek.key } });
    }
});
