'use strict';

/**
 * Sending files three ways — Buffer, local path, and remote URL — plus
 * streaming a file down from Telegram.
 *
 *   TELEGRAM_TOKEN=123:ABC CHAT_ID=123456 node examples/send-media.js
 */

const fs = require('fs');
const path = require('path');
const TelegramBot = require('..');

const token = process.env.TELEGRAM_TOKEN;
const chatId = process.env.CHAT_ID;
if (!token || !chatId) {
  console.error('Set TELEGRAM_TOKEN and CHAT_ID before running this example.');
  process.exit(1);
}

const bot = new TelegramBot(token);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  // 1. From a remote URL (Telegram fetches it).
  await bot.sendPhoto(chatId, 'https://picsum.photos/600/400', {
    caption: 'Sent from a URL',
  });

  // 2. From a local file path (detected via magic bytes / extension).
  const tmpFile = path.join(require('os').tmpdir(), 'tg-bot-api-example.txt');
  fs.writeFileSync(tmpFile, 'hello from a local file');
  await bot.sendDocument(chatId, tmpFile, { caption: 'Sent from disk' });
  fs.unlinkSync(tmpFile);

  // 3. From an in-memory Buffer.
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    'base64'
  );
  await bot.sendPhoto(chatId, png, { caption: 'Sent from a Buffer' });

  await sleep(500);

  // 4. Stream a file back down from Telegram.
  const photos = await bot.getUserProfilePhotos(chatId, { limit: 1 });
  if (photos.total_count > 0) {
    const fileId = photos.photos[0].photos[0].file_id;
    const dest = await bot.downloadFile(fileId, require('os').tmpdir());
    console.log('Downloaded to:', dest);
  }
})().catch((err) => {
  console.error('Example failed:', err.message);
  process.exit(1);
});
