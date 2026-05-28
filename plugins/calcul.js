module.exports = {
  commands: ['calcul', 'calc', 'math'],
  description: 'Calculatrice',
  execute: async ({ m, args, config: cfg }) => {
    const expression = args.join(' ');
    if (!expression) {
      return await m.reply(`❌ Usage: ${cfg.PREFIX}calcul [expression]\nExemple: ${cfg.PREFIX}calcul 5 + 3 * 2`);
    }

    try {
      const safeExpr = expression.replace(/[^0-9+\-*/().% ]/g, '');
      if (!safeExpr) throw new Error('Expression invalide');

      const result = Function('"use strict"; return (' + safeExpr + ')')();
      await m.reply(`🧮 *Calculatrice*\n\n📝 Expression: *${expression}*\n✅ Résultat: *${result}*`);
    } catch {
      await m.reply(`❌ Expression mathématique invalide.\nExemple: ${cfg.PREFIX}calcul 10 + 5`);
    }
  },
};
