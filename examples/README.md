# Examples

Small, runnable examples. Each one reads the bot token from the
`TELEGRAM_TOKEN` environment variable.

| File | Description |
|------|-------------|
| [`echo-bot.js`](echo-bot.js) | Long-polling bot that echoes text back |
| [`keyboard.js`](keyboard.js) | Inline keyboard + `callback_query` handling |
| [`send-media.js`](send-media.js) | Sending photos/documents from URL, path and Buffer |
| [`webhook.js`](webhook.js) | Webhook bot using the built-in HTTP server |

```sh
# from the repository root
TELEGRAM_TOKEN=123456:ABC-DEF node examples/echo-bot.js
```

Get a token from [@BotFather](https://t.me/BotFather).
