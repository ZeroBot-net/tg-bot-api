'use strict';

/**
 * Webhook bot using the library's built-in HTTP server.
 *
 * Telegram only delivers webhooks over HTTPS. The simplest setup is to run
 * this server on plain HTTP behind a TLS-terminating reverse proxy
 * (nginx, caddy, cloudflared, ...) and point WEBHOOK_URL at the proxy.
 *
 * Alternatively, terminate TLS in-process by passing `key` + `cert` (or `pfx`)
 * to the `webHook` options below.
 *
 *   TELEGRAM_TOKEN=123:ABC \
 *   WEBHOOK_URL=https://example.com/tg \
 *   WEBHOOK_PORT=8443 \
 *   node examples/webhook.js
 */

const TelegramBot = require('..');

const token = process.env.TELEGRAM_TOKEN;
if (!token) {
  console.error('Set TELEGRAM_TOKEN before running this example.');
  process.exit(1);
}

const webHookUrl = process.env.WEBHOOK_URL;
if (!webHookUrl) {
  console.error('Set WEBHOOK_URL to a publicly reachable HTTPS endpoint.');
  process.exit(1);
}

const port = Number(process.env.WEBHOOK_PORT || 8443);

const bot = new TelegramBot(token, {
  webHook: {
    port,
    host: '0.0.0.0',
    healthEndpoint: '/healthz',
    // key: fs.readFileSync('/etc/ssl/private/key.pem'),
    // cert: fs.readFileSync('/etc/ssl/certs/cert.pem'),
  },
});

bot.on('message', (msg) => {
  console.log(`[${msg.chat.id}] ${msg.text}`);
  bot.sendMessage(msg.chat.id, 'Webhook received your message.');
});

bot.on('webhook_error', (err) => console.error('webhook_error:', err.message));

bot.setWebHook(webHookUrl, { secret_token: process.env.WEBHOOK_SECRET })
  .then(() => console.log(`Webhook server on :${port}; updates -> ${webHookUrl}`))
  .catch((err) => console.error('Failed to set webhook:', err.message));

const shutdown = () => bot.closeWebHook().then(() => process.exit(0));
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
