'use strict';

const assert = require('node:assert/strict');
const TelegramBot = require('../src/telegram');

const TOKEN = '123456:TEST-TOKEN';

/** Build a minimal private-chat message update. */
function messageUpdate(updateId, message) {
  return {
    update_id: updateId,
    message: Object.assign(
      { message_id: updateId, chat: { id: 1, type: 'private' }, date: 0 },
      message
    ),
  };
}

describe('events', () => {
  let bot;
  beforeEach(() => {
    bot = new TelegramBot(TOKEN);
  });

  describe('processUpdate()', () => {
    it('emits generic "message" plus the concrete type', () => {
      const seen = [];
      bot.on('message', (msg, meta) => seen.push(['message', meta.type]));
      bot.on('text', (msg, meta) => seen.push(['text', meta.type]));

      bot.processUpdate(messageUpdate(1, { text: 'hi' }));

      assert.deepEqual(seen, [['message', 'text'], ['text', 'text']]);
    });

    it('emits non-text message types', () => {
      let meta = null;
      bot.on('photo', (msg, m) => { meta = m; });
      bot.processUpdate(messageUpdate(2, { photo: [{ file_id: 'x' }] }));
      assert.equal(meta.type, 'photo');
    });
  });

  describe('onText()', () => {
    it('invokes the callback with message and match', () => {
      let captured = null;
      bot.onText(/\/echo (.+)/, (msg, match) => { captured = { msg, match }; });
      bot.processUpdate(messageUpdate(3, { text: '/echo hello' }));
      assert.equal(captured.match[1], 'hello');
      assert.equal(captured.msg.text, '/echo hello');
    });

    it('supports string patterns by compiling them', () => {
      let hit = false;
      bot.onText('/ping', () => { hit = true; });
      bot.processUpdate(messageUpdate(4, { text: '/ping' }));
      assert.equal(hit, true);
    });

    it('removes a listener via removeTextListener()', () => {
      const handler = () => {};
      bot.onText(/\/x/, handler);
      const removed = bot.removeTextListener(/\/x/);
      assert.equal(removed.callback, handler);
      assert.equal(bot.removeTextListener(/\/x/), null);
    });

    it('clears all listeners via clearTextListeners()', () => {
      bot.onText(/a/, () => {});
      bot.onText(/b/, () => {});
      bot.clearTextListeners();
      assert.equal(bot.removeTextListener(/a/), null);
    });
  });

  describe('onReplyToMessage()', () => {
    it('fires when a matching reply arrives and can be removed', () => {
      let replied = null;
      const id = bot.onReplyToMessage(1, 42, (msg) => { replied = msg; });
      assert.equal(typeof id, 'number');

      bot.processUpdate({
        update_id: 5,
        message: {
          message_id: 50,
          chat: { id: 1, type: 'private' },
          text: 'reply',
          reply_to_message: { message_id: 42 },
        },
      });

      assert.ok(replied);
      assert.equal(replied.message_id, 50);
      assert.equal(bot.removeReplyListener(id).id, id);
      assert.equal(bot.removeReplyListener(id), null);
    });
  });
});
