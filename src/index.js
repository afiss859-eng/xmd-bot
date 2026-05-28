const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  jidDecode,
  proto,
  getContentType,
} = require('@whiskeysockets/baileys');

const pino = require('pino');
const { Boom } = require('@hapi/boom');
const path = require('path');
const fs = require('fs-extra');
const config = require('../config/config');
const { loadPlugins } = require('./plugins');
const { smsg, getBuffer, getSizeMedia, fetchJson } = require('./utils');

const store = makeInMemoryStore({
  logger: pino().child({ level: 'silent', stream: 'store' }),
});

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
      ignore: 'pid,hostname',
    },
  },
});

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(
    path.join(__dirname, '..', config.SESSION_NAME)
  );

  const { version, isLatest } = await fetchLatestBaileysVersion();
  logger.info(`📱 WhatsApp v${version.join('.')} | Dernière version: ${isLatest}`);
  logger.info(`🤖 Démarrage du bot ${config.BOT_NAME}...`);

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state,
    browser: ['XMD-BOT', 'Chrome', '20.0.0'],
    getMessage: async (key) => {
      if (store) {
        const msg = await store.loadMessage(key.remoteJid, key.id);
        return msg?.message || undefined;
      }
      return proto.Message.fromObject({});
    },
  });

  store.bind(sock.ev);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      logger.info('📲 Scannez le QR code avec WhatsApp pour connecter le bot');
    }

    if (connection === 'close') {
      const shouldReconnect =
        new Boom(lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      logger.warn(`❌ Connexion fermée. Raison: ${lastDisconnect?.error?.message}`);
      if (shouldReconnect) {
        logger.info('🔄 Reconnexion en cours...');
        startBot();
      } else {
        logger.error('⛔ Déconnecté définitivement. Supprimez le dossier session et redémarrez.');
      }
    } else if (connection === 'open') {
      logger.info(`✅ ${config.BOT_NAME} connecté avec succès !`);
      logger.info(`👑 Propriétaire: ${config.OWNER_NUMBER}`);
      logger.info(`🔧 Préfixe des commandes: ${config.PREFIX}`);
    }
  });

  sock.ev.on('creds.update', saveCreds);

  const plugins = await loadPlugins();
  logger.info(`📦 ${plugins.size} plugins chargés`);

  sock.ev.on('messages.upsert', async (chatUpdate) => {
    try {
      const mek = chatUpdate.messages[0];
      if (!mek?.message) return;

      const m = smsg(sock, mek, store);
      const body =
        m.body ||
        (m.mtype === 'templateButtonReplyMessage' && m.message?.templateButtonReplyMessage?.selectedId) ||
        '';

      const isCmd = body.startsWith(config.PREFIX);
      const command = isCmd ? body.slice(config.PREFIX.length).trim().split(' ')[0].toLowerCase() : '';
      const args = body.trim().split(/ +/).slice(1);
      const q = args.join(' ');

      const isOwner =
        m.sender === config.OWNER_NUMBER + '@s.whatsapp.net' ||
        m.sender === config.OWNER_NUMBER;

      const botNumber = sock.user.id.replace(/:[0-9]+/, '') + '@s.whatsapp.net';
      const isBotNumber = m.sender === botNumber;

      if (isBotNumber) return;

      if (isCmd) {
        logger.info(`💬 Commande reçue: ${config.PREFIX}${command} par ${m.sender}`);
        const plugin = plugins.get(command);
        if (plugin) {
          await plugin.execute({ sock, m, args, q, isOwner, config, logger });
        } else {
          await m.reply(`❌ Commande *${config.PREFIX}${command}* inconnue.\nTapez *${config.PREFIX}menu* pour voir toutes les commandes.`);
        }
      }
    } catch (err) {
      logger.error('Erreur lors du traitement du message:', err);
    }
  });

  return sock;
}

startBot().catch((err) => {
  logger.error('Erreur fatale:', err);
  process.exit(1);
});
