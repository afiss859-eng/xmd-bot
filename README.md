# 🤖 XMD-BOT — Bot WhatsApp Multi-Device

Un bot WhatsApp puissant et facile à utiliser, créé pour vous par Replit.

## ✨ Fonctionnalités

- 📋 **Menu interactif** — Liste de toutes les commandes
- 🧮 **Calculatrice** — Effectuez des calculs mathématiques
- 😂 **Blagues & Devinettes** — Divertissement aléatoire
- 💭 **Citations inspirantes** — Motivation quotidienne
- 👥 **Gestion de groupe** — Taguer tous, kick, add membres
- ⚡ **Ping / Info** — Statut du bot en temps réel

## 🚀 Installation

### Prérequis
- [Node.js](https://nodejs.org) version 18 ou supérieure
- Un numéro WhatsApp dédié pour le bot

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/afiss859-eng/xmd-bot.git
cd xmd-bot

# 2. Installer les dépendances
npm install

# 3. Configurer le bot
cp .env.example .env
# Éditez le fichier .env avec vos informations

# 4. Démarrer le bot
npm start
```

### Configuration (.env)

```env
BOT_NAME=XMD-BOT
OWNER_NUMBER=584265781353
PREFIX=.
SESSION_NAME=xmd-session
LANGUAGE=fr
```

## 📱 Connexion WhatsApp

Au premier démarrage, un QR code s'affichera dans le terminal.  
Scannez-le avec WhatsApp : **Paramètres → Appareils liés → Lier un appareil**

## 📋 Commandes disponibles

| Commande | Description |
|----------|-------------|
| `.menu` | Affiche toutes les commandes |
| `.ping` | Teste la connexion du bot |
| `.info` | Informations du bot |
| `.owner` | Contact du propriétaire |
| `.heure` | Heure et date actuelles |
| `.joke` | Blague aléatoire |
| `.citation` | Citation inspirante |
| `.devinette` | Devinette amusante |
| `.calcul [expr]` | Calculatrice mathématique |
| `.tagall` | Mentionne tous les membres (groupe) |
| `.kick [@membre]` | Exclure un membre (propriétaire) |
| `.add [numéro]` | Ajouter un membre (propriétaire) |
| `.groupinfo` | Infos du groupe |

## 👑 Propriétaire

- **Numéro:** +58 426-578-1353  
- **GitHub:** [afiss859-eng](https://github.com/afiss859-eng)

## 📄 Licence

MIT — Libre d'utilisation et de modification.
