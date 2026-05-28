const config = require('../config/config');
const moment = require('moment');

module.exports = {
  commands: ['menu', 'help', 'aide'],
  description: 'Affiche le menu principal',
  execute: async ({ sock, m, isOwner }) => {
    const p = config.PREFIX;
    const heure = moment().format('HH:mm:ss');
    const date = moment().format('DD/MM/YYYY');

    const menu = `╔══════════════════════╗
║   *${config.BOT_NAME}* 🤖   ║
╠══════════════════════╣
║ 📅 ${date} | ⏰ ${heure}
╠══════════════════════╣
║ *⚙️ GÉNÉRAL*
║ ${p}menu - Ce menu
║ ${p}ping - Tester le bot
║ ${p}info - Infos du bot
║ ${p}owner - Contact proprio
╠══════════════════════╣
║ *🎮 DIVERTISSEMENT*
║ ${p}joke - Blague aléatoire
║ ${p}citation - Citation inspirante
║ ${p}devinette - Devinette
╠══════════════════════╣
║ *🛠️ OUTILS*
║ ${p}heure - Heure actuelle
║ ${p}calcul [expr] - Calculatrice
║ ${p}météo [ville] - Météo
╠══════════════════════╣
║ *👥 GROUPE*
║ ${p}tagall - Mentionner tous
║ ${p}kick [@user] - Exclure membre
║ ${p}add [numéro] - Ajouter membre
╠══════════════════════╣
║ *👑 PROPRIÉTAIRE*
║ ${p}broadcast - Diffuser message
╚══════════════════════╝

_Propulsé par XMD-BOT v${config.VERSION}_`;

    await m.reply(menu);
  },
};
