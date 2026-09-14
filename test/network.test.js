'use strict';

const assert = require('node:assert/strict');
const dns = require('node:dns');
const TelegramBot = require('../src/telegram');
const { applyNetworkTuning } = require('../src/network');

const TOKEN = '123456:TEST-TOKEN';
const tick = () => new Promise((resolve) => setImmediate(resolve));

describe('latency helpers', () => {
  describe('applyNetworkTuning()', () => {
    it('applies settings and returns them', () => {
      const applied = applyNetworkTuning({ ipv4First: true, autoSelectFamilyAttemptTimeout: 50 });
      assert.deepEqual(applied, { ipv4First: true, autoSelectFamilyAttemptTimeout: 50 });
      assert.equal(dns.getDefaultResultOrder(), 'ipv4first');
    });

    it('is exposed as a static on TelegramBot', () => {
      assert.equal(typeof TelegramBot.applyNetworkTuning, 'function');
      assert.equal(typeof TelegramBot.applyNetworkTuning(), 'object');
    });

    it('The constructor option ipv4First applies tuning', () => {
      dns.setDefaultResultOrder('verbatim');
      const bot = new TelegramBot(TOKEN, { ipv4First: true });
      assert.ok(bot);
      assert.equal(dns.getDefaultResultOrder(), 'ipv4first');
    });
  });

  describe('preheat()', () => {
    it('resolves with the bot instance on success', async () => {
      const bot = new TelegramBot(TOKEN);
      let calls = 0;
      bot.getMe = () => { calls += 1; return Promise.resolve({ id: 1 }); };
      const result = await bot.preheat();
      assert.equal(result, bot);
      assert.equal(calls, 1);
    });

    it('suppresses errors by default and emits preheat_error', async () => {
      const bot = new TelegramBot(TOKEN);
      const failure = new Error('boom');
      bot.getMe = () => Promise.reject(failure);
      let emitted = null;
      bot.on('preheat_error', (err) => { emitted = err; });
      const result = await bot.preheat();
      assert.equal(result, bot);
      assert.equal(emitted, failure);
    });

    it('rejects when suppressErrors is false', async () => {
      const bot = new TelegramBot(TOKEN);
      bot.getMe = () => Promise.reject(new Error('boom'));
      await assert.rejects(() => bot.preheat({ suppressErrors: false }), /boom/);
    });
  });

  describe('the prewarm constructor option', () => {
    it('fires a warm-up request', async () => {
      const original = TelegramBot.prototype.getMe;
      let calls = 0;
      TelegramBot.prototype.getMe = function getMe() { calls += 1; return Promise.resolve({}); };
      try {
        const bot = new TelegramBot(TOKEN, { prewarm: true });
        await tick();
        await tick();
        assert.equal(calls, 1);
        assert.ok(bot);
      } finally {
        TelegramBot.prototype.getMe = original;
      }
    });
  });
});
