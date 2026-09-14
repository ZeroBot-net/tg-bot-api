'use strict';

/**
 * Minimal polling bot: echoes back any text it receives.
 *
 *   TELEGRAM_TOKEN=123:ABC node examples/echo-bot.js
 */

const TelegramBot = require('..');

const token = process.env.TELEGRAM_TOKEN;
if (!token) {
  console.error('Set TELEGRAM_TOKEN before running this example.');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  console.log(`[${msg.chat.id}] ${msg.from.username || msg.from.id}: ${msg.text}`);
});

bot.onText(/^\/start\b/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Hello! Send me anything and I will echo it back.');
});

bot.on('text', (msg) => {
  if (msg.text.startsWith('/')) return;
  bot.sendMessage(msg.chat.id, msg.text);
});

bot.on('polling_error', (err) => console.error('polling_error:', err.message));
