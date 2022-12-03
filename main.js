const express = require("express");
const router = express.Router();
const { toBuffer } = require("qrcode");
const CryptoJS = require("crypto-js");
const aes256 = require('aes256');
const {
  default: makeWASocket,
  useSingleFileAuthState,
  Browsers,
  delay,
} = require("@adiwajshing/baileys");

const pino = require("pino");
let PORT = process.env.PORT || 3030;

const PastebinAPI = require("pastebin-js"),
  pastebin = new PastebinAPI("h4cO2gJEMwmgmBoteYufW6_weLvBYCqT");

router.get("/", async(req, res) => {
  const authfile = `./tmp/${makeid()}.json`;
  const { state } = useSingleFileAuthState(authfile, pino({ level: "silent" }));
  function Amarok() {
    try {
      let session = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: "silent" }),
        browser: Browsers.macOS("Desktop"),
        downloadHistory: false,
        syncFullHistory: false,
      });

      session.ev.on("connection.update", async (s) => {
        if (s.qr) {
          res.end(await toBuffer(s.qr));
        }
        const { connection, lastDisconnect } = s;
        if (connection == "open") {
          await delay(500 * 10);
          let link = await pastebin.createPasteFromFile(
            authfile,
            "Amarok session",
            null,
            0,
            "N"
          );
let data = link.replace("https://pastebin.com/", "");
          let key = "k!t"
          let plaintext = data
          let sscodeid = aes256.encrpyt(key, plaintext);

          const templateButtons = [
            {
              index: 1,
              urlButton: {
                displayText: "COPY SESSION ID",
                url: `https://www.whatsapp.com/otp/copy/inrl~${sscodeid}`,
              },
            },
            {
              index: 2,
              urlButton: {
                displayText: "GITHUB",
                url: `github.com/Diegoson/AMAROK-MD/fork`,
              },
            },
            {
              index: 3,
              urlButton: {
                displayText: "JOIN SUPPORT GRP",
                url: `https://chat.whatsapp.com/C3nWOjCxB5UF6u7JSz8U3T`,
              },
            },
          ];

          const templateMessage = {
            text: `ᴅᴇᴀʀ ᴜꜱᴇʀ ᴛʜᴀɴᴋꜱ ꜰᴏʀ ᴄʜᴏᴏꜱɪɴɢ ɪɴʀʟ-ᴍᴅ\nɪꜰ yᴏᴜ ɢᴏᴛ ᴀɴy ʙᴜɢ ɪɴ ᴏᴜʀ ʙᴏᴛ ᴩʟᴇᴀꜱᴇ ɪɴꜰʀᴏᴍ\nɪɴ ᴏᴜʀ ꜱᴜᴩᴩᴏʀᴛ ɢʀᴩ`,
            footer: "ɪɴʀʟ-ʙᴏᴛ-ᴍᴅ",
            templateButtons: templateButtons,
          };
          await session.sendMessage(session.user.id, templateMessage);

          await delay(3000 * 10);
          process.send("reset");
        }
        if (
          connection === "close" &&
          lastDisconnect &&
          lastDisconnect.error &&
          lastDisconnect.error.output.statusCode != 401
        ) {
          Amarok();
        }
      });
    } catch (err) {
      console.log(
        err + "Unknown Error Occured Please report to Owner and Stay tuned"
      );
    }
  }

  Amarok();
});

const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, (passphrase = "123")).toString();
};

const decrypt = (text) => {
  return CryptoJS.AES.decrypt(text, passphrase).toString();
};

function makeid(num = 9) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var characters9 = characters.length;
  for (var i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters9));
  }
  return result;
}

let encode = (f) => {
  return f.replace("=", "");
};

module.exports = router;
