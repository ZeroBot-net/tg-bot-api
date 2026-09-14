'use strict';

const assert = require('node:assert/strict');
const TelegramBot = require('../src/telegram');

const TOKEN = '123456:TEST-TOKEN';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** A resolved promise decorated with the `.cancel()` method the poller expects. */
function cancelable(value) {
  const promise = Promise.resolve(value);
  promise.cancel = () => {};
  return promise;
}

describe('polling', () => {
  let bot;

  beforeEach(() => {
    bot = new TelegramBot(TOKEN, {
      polling: { autoStart: false, interval: 10, params: { timeout: 0 } },
    });
  });

  afterEach(async () => {
    if (bot.isPolling()) await bot.stopPolling({ cancel: true });
  });

  it('is created but not started when autoStart is false', () => {
    assert.equal(bot.isPolling(), false);
  });

  it('starts, polls repeatedly, then stops', async () => {
    let calls = 0;
    bot.getUpdates = () => { calls += 1; return cancelable([]); };

    await bot.startPolling();
    assert.equal(bot.isPolling(), true);

    await sleep(60);
    assert.ok(calls >= 1, `expected at least one getUpdates call, got ${calls}`);

    await bot.stopPolling({ cancel: true });
    assert.equal(bot.isPolling(), false);
  });

  it('dispatches updates to listeners while polling', async () => {
    let received = null;
    bot.on('message', (msg) => { received = msg; });

    let served = false;
    bot.getUpdates = () => {
      if (served) return cancelable([]);
      served = true;
      return cancelable([
        { update_id: 1, message: { message_id: 1, chat: { id: 1, type: 'private' }, text: 'hi' } },
      ]);
    };

    await bot.startPolling();
    await sleep(40);
    assert.ok(received);
    assert.equal(received.text, 'hi');
  });

  it('cannot open a webhook while polling', async () => {
    bot.getUpdates = () => cancelable([]);
    await bot.startPolling();
    await assert.rejects(() => bot.openWebHook(), /mutually exclusive/i);
  });
});
