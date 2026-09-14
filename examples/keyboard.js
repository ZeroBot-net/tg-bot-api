'use strict';

/**
 * Inline keyboard with callback handling.
 *
 *   TELEGRAM_TOKEN=123:ABC node examples/keyboard.js
 */

const TelegramBot = require('..');

const token = process.env.TELEGRAM_TOKEN;
if (!token) {
  console.error('Set TELEGRAM_TOKEN before running this example.');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

bot.onText(/^\/start\b/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Pick an option:', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Option A', callback_data: 'a' },
          { text: 'Option B', callback_data: 'b' },
        ],
        [{ text: 'Open website', url: 'https://core.telegram.org/bots/api' }],
      ],
    },
  });
});

bot.on('callback_query', async (query) => {
  const choice = query.data;
  await bot.answerCallbackQuery(query.id, { text: `You chose ${choice}` });
  await bot.editMessageText(`You chose *${choice}*`, {
    chat_id: query.message.chat.id,
    message_id: query.message.message_id,
    parse_mode: 'MarkdownV2',
  });
});
