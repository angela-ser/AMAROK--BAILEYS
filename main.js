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
                url: `https://www.whatsapp.com/otp/copy/amarok~${sscodeid}`,
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
                url: `https://chat.whatsapp.com/I3aOiLY2Ydc258VkV7p0Md`,
              },
            },
          ];

          const templateMessage = {
            text: `𝘋𝘌𝘈𝘙 ${message.pushName}\n𝘛𝘏𝘈𝘕𝘒 𝘠𝘖𝘜 𝘍𝘖𝘙 𝘊𝘏𝘖𝘖𝘚𝘐𝘕𝘎 𝘈𝘔𝘙𝘖𝘒 𝘉𝘖𝘛 \n𝘊𝘖𝘗𝘠 𝘠𝘖𝘜𝘙 𝘚𝘌𝘚𝘚𝘐𝘖𝘕 𝘉𝘌𝘓𝘖𝘞\n𝘐𝘍 𝘏𝘈𝘝𝘌 𝘈𝘕𝘠 𝘗𝘉𝘔 𝘑𝘖𝘐𝘕 𝘖𝘜𝘙 𝘚𝘗𝘗𝘛 𝘎𝘊`,
            footer: "𝘈𝘔𝘈𝘙𝘖𝘒-𝘔𝘋",
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
