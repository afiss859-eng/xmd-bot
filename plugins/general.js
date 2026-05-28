const config = require('../config/config');
const moment = require('moment');
const os = require('os');

module.exports = {
  commands: ['ping', 'info', 'owner', 'heure', 'version'],
  description: 'Commandes générales',
  execute: async ({ sock, m, args, config: cfg, logger }) => {
    const cmd = m.body.slice(cfg.PREFIX.length).trim().split(' ')[0].toLowerCase();

    switch (cmd) {
      case 'ping': {
        const start = Date.now();
        await m.reply('🏓 Calcul...');
        const end = Date.now();
        await m.reply(`🏓 *Pong!*\n⚡ Latence: *${end - start}ms*`);
        break;
      }

      case 'info': {
        const uptime = process.uptime();
        const h = Math.floor(uptime / 3600);
        const min = Math.floor((uptime % 3600) / 60);
        const sec = Math.floor(uptime % 60);
        const info = `╔══════════════════╗
║  *INFO DU BOT* 🤖
╠══════════════════╣
║ 🏷️ Nom: *${cfg.BOT_NAME}*
║ 📌 Version: *${cfg.VERSION}*
║ 👑 Proprio: *${cfg.OWNER_NUMBER}*
║ 🔧 Préfixe: *${cfg.PREFIX}*
║ ⏱️ Uptime: *${h}h ${min}m ${sec}s*
║ 💾 RAM: *${(process.memoryUsage().rss / 1024 / 1024).toFixed(1)} MB*
║ 🖥️ Plateforme: *${os.platform()}*
╚══════════════════╝`;
        await m.reply(info);
        break;
      }

      case 'owner': {
        await sock.sendMessage(
          m.chat,
          {
            text: `👑 *Propriétaire du bot*\n\n📱 Numéro: wa.me/${cfg.OWNER_NUMBER}\n🤖 Bot: ${cfg.BOT_NAME}`,
            mentions: [cfg.OWNER_NUMBER + '@s.whatsapp.net'],
          },
          { quoted: m }
        );
        break;
      }

      case 'heure': {
        const now = moment();
        await m.reply(
          `🕐 *Heure actuelle*\n\n📅 Date: *${now.format('dddd DD MMMM YYYY')}*\n⏰ Heure: *${now.format('HH:mm:ss')}*`
        );
        break;
      }

      case 'version': {
        await m.reply(`🤖 *${cfg.BOT_NAME}*\n📌 Version: *${cfg.VERSION}*\n👨‍💻 Auteur: *${cfg.AUTHOR}*`);
        break;
      }
    }
  },
};
