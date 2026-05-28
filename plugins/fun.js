const blagues = [
  'Pourquoi les plongeurs plongent-ils toujours en arrière ? Parce que sinon ils tomberaient dans le bateau ! 😂',
  'Qu\'est-ce qu\'un crocodile qui surveille la cour d\'école ? Un sac à dents ! 😄',
  'Pourquoi les mathématiciens font-ils de bons détectives ? Parce qu\'ils savent toujours x ! 🔍',
  'Qu\'est-ce qu\'un chat tombé dans un pot de peinture le jour de Noël ? Un chat-peint de Noël ! 🎄',
  'Pourquoi les baleines nagent-elles dans l\'eau salée ? Parce que le poivre les ferait éternuer ! 🐳',
  'Qu\'est-ce qu\'un canif ? Un petit fien ! 😅',
  'Comment appelle-t-on un chat tombé dans un pot de colle ? Un chat collant ! 🐱',
  'Pourquoi Superman met-il sa cape par-dessus son slip ? Pour ne pas avoir froid aux oreilles ! 🦸',
];

const citations = [
  '"La vie, c\'est comme une bicyclette, il faut avancer pour ne pas perdre l\'équilibre." — Albert Einstein',
  '"Le succès, c\'est tomber sept fois et se relever huit." — Proverbe japonais',
  '"Sois le changement que tu veux voir dans le monde." — Mahatma Gandhi',
  '"La connaissance s\'acquiert par l\'expérience, tout le reste n\'est que de l\'information." — Albert Einstein',
  '"Un voyage de mille lieues commence toujours par un premier pas." — Lao Tseu',
  '"L\'imagination est plus importante que le savoir." — Albert Einstein',
  '"Le bonheur n\'est pas quelque chose que vous reportez à plus tard, c\'est quelque chose que vous planifiez pour le présent." — Jim Rohn',
];

const devinettes = [
  { q: 'Je commence la nuit et je finis le matin. Qui suis-je ?', r: 'La lettre N !' },
  { q: 'Plus je sèche, plus je suis mouillée. Qui suis-je ?', r: 'Une serviette !' },
  { q: 'J\'ai des dents mais je ne mords pas. Qui suis-je ?', r: 'Un peigne !' },
  { q: 'Je cours sans jambes et je murmure sans bouche. Qui suis-je ?', r: 'Le vent !' },
  { q: 'Qu\'est-ce qui a des mains mais ne peut pas applaudir ?', r: 'Une horloge !' },
];

module.exports = {
  commands: ['joke', 'blague', 'citation', 'devinette'],
  description: 'Commandes de divertissement',
  execute: async ({ m, config: cfg }) => {
    const cmd = m.body.slice(cfg.PREFIX.length).trim().split(' ')[0].toLowerCase();

    switch (cmd) {
      case 'joke':
      case 'blague': {
        const blague = blagues[Math.floor(Math.random() * blagues.length)];
        await m.reply(`😂 *Blague du jour*\n\n${blague}`);
        break;
      }

      case 'citation': {
        const citation = citations[Math.floor(Math.random() * citations.length)];
        await m.reply(`💭 *Citation inspirante*\n\n${citation}`);
        break;
      }

      case 'devinette': {
        const dev = devinettes[Math.floor(Math.random() * devinettes.length)];
        await m.reply(`🧩 *Devinette*\n\n❓ ${dev.q}\n\n||💡 Réponse: ${dev.r}||`);
        break;
      }
    }
  },
};
