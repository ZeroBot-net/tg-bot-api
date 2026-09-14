<h1 align="center">Node.js Telegram Bot API</h1>

<div align="center">

A lightweight, dependency-light Node.js library for the [Telegram Bot API](https://core.telegram.org/bots/api).

[![Bot API](https://img.shields.io/badge/Bot%20API-v.10.3-00aced.svg?style=flat-square&logo=telegram)](https://core.telegram.org/bots/api)
[![npm package](https://img.shields.io/npm/v/@zero-bot.net/tg-bot-api?logo=npm&style=flat-square)](https://www.npmjs.org/package/@zero-bot.net/tg-bot-api)

</div>

## ✨ Features

- **202 methods** — full Telegram Bot API 10.3 coverage
- **No build step** — ships native CommonJS, runs on Node.js 18+
- **Small dependency tree** — file-type detection and MIME lookup are built in
- **Built-in TypeScript definitions**
- **Both update modes** — long polling *and* webhooks (with a built-in HTTP(S) server)
- Rich Messages, Ephemeral Messages, Guest Mode, Business Accounts
- Gifts, Stars & Payments, Checklists, Media Polls, Live Photos, Stories
- Communities, Managed Bots, Suggested Posts, and more

## 📦 Install

```sh
npm i @zero-bot.net/tg-bot-api
```

## 🚀 Usage

```js
const TelegramBot = require('@zero-bot.net/tg-bot-api');

const token = 'YOUR_TELEGRAM_BOT_TOKEN';

// Polling mode
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/echo (.+)/, (msg, match) => {
  bot.sendMessage(msg.chat.id, match[1]);
});

bot.on('message', (msg) => {
  console.log(msg.chat.id, msg.text);
});
```

### Sending files

`sendPhoto`, `sendDocument`, `sendAudio`, ... accept a **local path**, a
**stream**, a **Buffer**, a **URL**, or a **`file_id`**:

```js
await bot.sendPhoto(chatId, './cat.png');          // path
await bot.sendPhoto(chatId, buffer);               // Buffer (type auto-detected)
await bot.sendPhoto(chatId, 'https://x/y.png');    // URL
await bot.sendPhoto(chatId, fileId);               // previously uploaded file
```

### Webhooks

```js
const bot = new TelegramBot(token, {
  webHook: { port: 8443, host: '0.0.0.0', healthEndpoint: '/healthz' },
});

bot.on('message', (msg) => bot.sendMessage(msg.chat.id, 'hi'));
await bot.setWebHook('https://example.com:8443');
```

### Error handling

All API errors are `errors.TelegramError` (code `ETELEGRAM`) and carry the raw
server `response`. Transport failures are `errors.FatalError` (code `EFATAL`)
with the original error preserved as `.cause`.

```js
const { TelegramError } = require('@zero-bot.net/tg-bot-api');

bot.on('polling_error', (err) => {
  if (err instanceof TelegramError) console.error(err.response.body);
  else console.error(err.message, err.cause);
});
```

## ⚡ Performance & latency

Warm (keep-alive) requests take **20–80ms**. Cold connections pay DNS + TCP +
TLS **plus Node's 250ms IPv6 fallback window** — that is what pushes a request
to 200–600ms. Ranked fixes:

1. **Host near Telegram** (EU/US) — RTT drops from ~200ms to ~10–30ms. No code.
2. **Self-hosted Bot API server** — biggest win for media; files never leave
   your machine:
   ```js
   const bot = new TelegramBot(token, { baseApiUrl: 'http://127.0.0.1:8081' });
   ```
3. **Remove the IPv6 fallback penalty** (up to −250ms per connection):
   ```js
   TelegramBot.applyNetworkTuning();          // ipv4-first + 100ms fallback window
   // or: new TelegramBot(token, { ipv4First: true });
   ```
4. **Pre-warm the connection** so the first request is not a cold start:
   ```js
   const bot = new TelegramBot(token, { prewarm: true });
   // or: await bot.preheat();
   ```
5. **Tune polling** for instant updates:
   `{ polling: { params: { timeout: 30 }, interval: 50 } }`.
6. **Fewer round-trips** — batch with `sendMediaGroup` / `forwardMessages` /
   `copyMessages`, and reuse `file_id`s instead of re-uploading.

Keep-alive is enabled by default (`forever: true`); tune the pool if needed:

```js
new TelegramBot(token, {
  request: {
    agentOptions: { keepAlive: true, keepAliveMsecs: 10000, maxSockets: 64 },
  },
});
```

## 📚 Documentation

- [`doc/usage.md`](doc/usage.md) — full usage guide
- [`doc/api.md`](doc/api.md) — API reference (generated from `src/telegram.js`)
- [`doc/help.md`](doc/help.md) — FAQs and common pitfalls
- [`examples/`](examples/) — runnable examples

## 🧪 Development

```sh
npm test          # offline mocha test suite
npm run lint      # eslint
npm run doc       # regenerate doc/api.md
```

Requires Node.js >= 18.

## 👥 Contributors

<a href="https://github.com/ZeroBot-net/tg-bot-api/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ZeroBot-net/tg-bot-api" />
</a>

## License

**The MIT License (MIT)**

Copyright © 2026 Grandpa EJ
