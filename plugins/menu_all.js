const config = require('../settings');
const moment = require('moment-timezone');
const { malvin, commands } = require('../malvin');
const { getPrefix } = require('../lib/prefix');

// Stylized uppercase letters like ᴍᴇɴᴜ
function toUpperStylized(str) {
  const stylized = {
    A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ', E: 'ᴇ', F: 'ғ', G: 'ɢ', H: 'ʜ',
    I: 'ɪ', J: 'ᴊ', K: 'ᴋ', L: 'ʟ', M: 'ᴍ', N: 'ɴ', O: 'ᴏ', P: 'ᴘ',
    Q: 'ǫ', R: 'ʀ', S: 's', T: 'ᴛ', U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x',
    Y: 'ʏ', Z: 'ᴢ'
  };
  return str.split('').map(c => stylized[c.toUpperCase()] || c).join('');
}

// Normalize categories
const normalize = str => str.toLowerCase().replace(/\s+menu$/, '').trim();

// Emojis by category
const emojiByCategory = {
  ai: '🤖', anime: '🍥', audio: '🎧', bible: '📖', download: '⬇️',
  downloader: '📥', fun: '🎮', game: '🕹️', group: '👥', img_edit: '🖌️',
  info: 'ℹ️', information: '🧠', logo: '🖼️', main: '🏠', media: '🎞️',
  menu: '📜', misc: '📦', music: '🎵', other: '📁', owner: '👑',
  privacy: '🔒', search: '🔎', settings: '⚙️', sticker: '🌟',
  tools: '🛠️', user: '👤', utilities: '🧰', utility: '🧮',
  wallpapers: '🖼️', whatsapp: '📱'
};

// Random backgrounds (you can edit or add your own)
const backgroundImages = [
  'https://url.bwmxmd.online/Adams.zjrmnw18.jpeg',
  'https://telegra.ph/file/2ccf21b77a7b350d1b872.jpg',
  'https://telegra.ph/file/7e13a0569b3d41dcf5147.jpg',
  'https://telegra.ph/file/3b6e3b4529e48c626d78b.jpg',
  'https://telegra.ph/file/4f6a8d3871e79cb0d8c1a.jpg',
  'https://telegra.ph/file/43d1cc74ed94789d5e1fc.jpg',
  'https://telegra.ph/file/57edc41d2e5b42ce7e4f1.jpg',
  'https://telegra.ph/file/8f33dcd21944c10f7c5c9.jpg'
];

malvin({
  pattern: 'menu',
  alias: ['allmenu'],
  desc: 'Show all bot commands with background',
  category: 'menu',
  react: '✨',
  filename: __filename
}, async (malvin, mek, m, { from, sender, reply }) => {
  try {
    const prefix = getPrefix();
    const timezone = config.TIMEZONE || 'Africa/Nairobi';
    const time = moment().tz(timezone).format('HH:mm:ss');
    const date = moment().tz(timezone).format('dddd, DD MMMM YYYY');

    const uptime = () => {
      const sec = process.uptime();
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = Math.floor(sec % 60);
      return `${h}h ${m}m ${s}s`;
    };

    // Menu header
    let menu = `
╭═══〘 *${toUpperStylized('Akida Bot Menu')}* 〙═══╮
│ 👤 *User:* @${sender.split('@')[0]}
│ ⚙️ *Mode:* ${config.MODE}
│ 🕒 *Time:* ${time}
│ 📅 *Date:* ${date}
│ ⏱️ *Runtime:* ${uptime()}
│ 🧩 *Plugins:* ${commands.length}
│ 💫 *Prefix:* ${config.PREFIX}
│ 👑 *Owner:* ${config.OWNER_NAME}
│ 🧠 *Dev:* Guru
│ 🚀 *Version:* 2.0.0
╰═════════════════════╯
`;

    // Build command categories
    const categories = {};
    for (const cmd of commands) {
      if (cmd.category && !cmd.dontAdd && cmd.pattern) {
        const normalizedCategory = normalize(cmd.category);
        categories[normalizedCategory] = categories[normalizedCategory] || [];
        categories[normalizedCategory].push(cmd.pattern.split('|')[0]);
      }
    }

    // Add each category to the menu
    for (const cat of Object.keys(categories).sort()) {
      const emoji = emojiByCategory[cat] || '💫';
      menu += `\n*╭─❏ ${emoji} ${toUpperStylized(cat)} ᴍᴇɴᴜ ❏*`;
      for (const cmd of categories[cat].sort()) {
        menu += `\n*│• ${prefix}${cmd}*`;
      }
      menu += `\n*╰───────────────⭓*`;
    }

    menu += `\n\n> ⚡ ${toUpperStylized('Explore the power of Akida!')}`;

    // Choose a random background
    const backgroundImage =
      config.MENU_IMAGE_URL ||
      backgroundImages[Math.floor(Math.random() * backgroundImages.length)];

    // Send menu with background image
    await malvin.sendMessage(
      from,
      {
        image: { url: backgroundImage },
        caption: menu,
        contextInfo: {
          mentionedJid: [sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid:
              config.NEWSLETTER_JID || '120363299029326322@newsletter',
            newsletterName: config.OWNER_NAME || 'Akida Updates',
            serverMessageId: 143
          }
        }
      },
      { quoted: mek }
    );

    // Optional: send menu sound
    if (config.MENU_AUDIO_URL) {
      await new Promise(r => setTimeout(r, 1000));
      await malvin.sendMessage(
        from,
        {
          audio: { url: config.MENU_AUDIO_URL },
          mimetype: 'audio/mp4',
          ptt: true
        },
        { quoted: mek }
      );
    }

  } catch (e) {
    console.error('Menu Error:', e.message);
    await reply(`❌ ᴇʀʀᴏʀ: ${e.message}`);
  }
});
