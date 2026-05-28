module.exports = {
  commands: ['tagall', 'kick', 'add', 'promote', 'demote', 'groupinfo'],
  description: 'Commandes de groupe',
  execute: async ({ sock, m, args, isOwner, config: cfg }) => {
    const cmd = m.body.slice(cfg.PREFIX.length).trim().split(' ')[0].toLowerCase();

    if (!m.isGroup && ['tagall', 'kick', 'promote', 'demote', 'groupinfo'].includes(cmd)) {
      return await m.reply('❌ Cette commande fonctionne uniquement dans les groupes !');
    }

    switch (cmd) {
      case 'tagall': {
        try {
          const groupMetadata = await sock.groupMetadata(m.chat);
          const members = groupMetadata.participants;
          const mentions = members.map((p) => p.id);
          const text = members.map((p) => `@${p.id.split('@')[0]}`).join('\n');
          await sock.sendMessage(
            m.chat,
            { text: `📢 *Mention de tous les membres*\n\n${text}`, mentions },
            { quoted: m }
          );
        } catch {
          await m.reply('❌ Impossible de récupérer les membres du groupe.');
        }
        break;
      }

      case 'kick': {
        if (!isOwner) return await m.reply('❌ Seul le propriétaire peut utiliser cette commande.');
        const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!target) return await m.reply(`❌ Mentionnez un membre.\nUsage: ${cfg.PREFIX}kick @membre`);
        try {
          await sock.groupParticipantsUpdate(m.chat, [target], 'remove');
          await m.reply(`✅ @${target.split('@')[0]} a été exclu du groupe.`);
        } catch {
          await m.reply('❌ Impossible d\'exclure ce membre. Vérifiez les permissions du bot.');
        }
        break;
      }

      case 'add': {
        if (!isOwner) return await m.reply('❌ Seul le propriétaire peut utiliser cette commande.');
        const number = args[0]?.replace(/[^0-9]/g, '');
        if (!number) return await m.reply(`❌ Usage: ${cfg.PREFIX}add [numéro]\nExemple: ${cfg.PREFIX}add 584265781353`);
        try {
          const jid = number + '@s.whatsapp.net';
          await sock.groupParticipantsUpdate(m.chat, [jid], 'add');
          await m.reply(`✅ ${number} a été ajouté au groupe !`);
        } catch {
          await m.reply('❌ Impossible d\'ajouter ce membre.');
        }
        break;
      }

      case 'groupinfo': {
        try {
          const meta = await sock.groupMetadata(m.chat);
          const info = `╔══════════════════╗
║  *INFO DU GROUPE*
╠══════════════════╣
║ 📛 Nom: *${meta.subject}*
║ 👥 Membres: *${meta.participants.length}*
║ 📅 Créé: *${new Date(meta.creation * 1000).toLocaleDateString('fr-FR')}*
║ 📝 Description: ${meta.desc || 'Aucune'}
╚══════════════════╝`;
          await m.reply(info);
        } catch {
          await m.reply('❌ Impossible de récupérer les infos du groupe.');
        }
        break;
      }

      case 'promote': {
        if (!isOwner) return await m.reply('❌ Seul le propriétaire peut utiliser cette commande.');
        const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!target) return await m.reply(`❌ Usage: ${cfg.PREFIX}promote @membre`);
        try {
          await sock.groupParticipantsUpdate(m.chat, [target], 'promote');
          await m.reply(`✅ @${target.split('@')[0]} est maintenant admin !`);
        } catch {
          await m.reply('❌ Impossible de promouvoir ce membre.');
        }
        break;
      }

      case 'demote': {
        if (!isOwner) return await m.reply('❌ Seul le propriétaire peut utiliser cette commande.');
        const target = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!target) return await m.reply(`❌ Usage: ${cfg.PREFIX}demote @membre`);
        try {
          await sock.groupParticipantsUpdate(m.chat, [target], 'demote');
          await m.reply(`✅ @${target.split('@')[0]} n'est plus admin.`);
        } catch {
          await m.reply('❌ Impossible de rétrograder ce membre.');
        }
        break;
      }
    }
  },
};
