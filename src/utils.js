const {
  jidDecode,
  areJidsSameUser,
  proto,
  getContentType,
} = require('@whiskeysockets/baileys');

function smsg(sock, m, store) {
  if (!m) return m;
  let M = proto.WebMessageInfo;
  if (m.key) {
    m.id = m.key.id;
    m.isBaileys = m.id?.startsWith('BAE5') && m.id?.length === 16;
    m.chat = m.key.remoteJid;
    m.fromMe = m.key.fromMe;
    m.isGroup = m.chat?.endsWith('@g.us');
    m.sender = m.fromMe
      ? (sock.user?.id?.split(':')[0] + '@s.whatsapp.net')
      : m.isGroup
        ? m.key.participant
        : m.chat;
  }

  if (m.message) {
    m.mtype = getContentType(m.message);
    m.msg =
      m.mtype === 'viewOnceMessage'
        ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)]
        : m.message[m.mtype];
    m.body =
      m.message?.conversation ||
      m.msg?.caption ||
      m.msg?.text ||
      (m.mtype === 'listResponseMessage' && m.msg?.singleSelectReply?.selectedRowId) ||
      (m.mtype === 'buttonsResponseMessage' && m.msg?.selectedButtonId) ||
      (m.mtype === 'viewOnceMessage' && m.msg?.caption) ||
      '';

    m.reply = (text) => sock.sendMessage(m.chat, { text: String(text) }, { quoted: m });
    m.replyImage = (buffer, caption = '') =>
      sock.sendMessage(m.chat, { image: buffer, caption }, { quoted: m });
    m.replySticker = (buffer) =>
      sock.sendMessage(m.chat, { sticker: buffer }, { quoted: m });
  }

  return m;
}

async function getBuffer(url, options = {}) {
  const axios = require('axios');
  const res = await axios({ method: 'get', url, responseType: 'arraybuffer', ...options });
  return Buffer.from(res.data);
}

async function fetchJson(url, options = {}) {
  const axios = require('axios');
  const res = await axios({ method: 'get', url, ...options });
  return res.data;
}

function getSizeMedia(path) {
  const stat = require('fs').statSync(path);
  return stat.size;
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

module.exports = { smsg, getBuffer, fetchJson, getSizeMedia, formatBytes };
