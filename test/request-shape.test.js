'use strict';

const assert = require('node:assert/strict');
const TelegramBot = require('../src/telegram');

const TOKEN = '123456:TEST-TOKEN';

/**
 * Capture the arguments passed to `_request` without performing any I/O.
 */
function capture(bot) {
  const calls = [];
  bot._request = (methodPath, options) => {
    calls.push({ methodPath, options });
    return Promise.resolve(true);
  };
  return calls;
}

describe('request shaping', () => {
  let bot;
  beforeEach(() => {
    bot = new TelegramBot(TOKEN);
  });

  describe('_fixJsonFields()', () => {
    it('does not turn a null sentinel into the string "null"', () => {
      const qs = { photo: null };
      bot._fixJsonFields(qs);
      assert.equal(qs.photo, null);
    });

    it('serializes object/array fields', () => {
      const obj = { link_preview_options: { is_disabled: true }, photo: { file_id: 'x' } };
      bot._fixJsonFields(obj);
      assert.equal(obj.link_preview_options, JSON.stringify({ is_disabled: true }));
      assert.equal(obj.photo, JSON.stringify({ file_id: 'x' }));
    });

    it('leaves already-serialized strings untouched', () => {
      const obj = { content: '{"a":1}' };
      bot._fixJsonFields(obj);
      assert.equal(obj.content, '{"a":1}');
    });
  });

  describe('_fixReplyMarkup()', () => {
    it('stringifies objects but not strings', () => {
      const markup = { inline_keyboard: [] };
      const obj = { reply_markup: markup };
      bot._fixReplyMarkup(obj);
      assert.equal(obj.reply_markup, JSON.stringify(markup));

      const obj2 = { reply_markup: '{"inline_keyboard":[]}' };
      bot._fixReplyMarkup(obj2);
      assert.equal(obj2.reply_markup, '{"inline_keyboard":[]}');
    });
  });

  describe('sendPhoto (buffer upload path)', () => {
    it('keeps photo null in qs and puts the file in formData', () => {
      const calls = capture(bot);
      return bot.sendPhoto(1, Buffer.from('89504e470d0a1a0a', 'hex')).then(() => {
        const { options } = calls[0];
        assert.equal(options.qs.photo, null);
        assert.ok(options.formData.photo);
        assert.equal(options.formData.photo.options.contentType, 'image/png');
      });
    });
  });

  describe('forwardMessages()', () => {
    it('JSON-serializes message_ids', async () => {
      const calls = capture(bot);
      await bot.forwardMessages(1, 2, [10, 11, 12]);
      assert.equal(calls[0].methodPath, 'forwardMessages');
      assert.equal(calls[0].options.form.message_ids, JSON.stringify([10, 11, 12]));
    });
  });

  describe('deleteAllMessageReactions()', () => {
    it('accepts a positional user id', async () => {
      const calls = capture(bot);
      await bot.deleteAllMessageReactions(5, 99);
      assert.equal(calls[0].options.form.chat_id, 5);
      assert.equal(calls[0].options.form.user_id, 99);
      assert.equal(calls[0].options.form.message_id, undefined);
    });

    it('accepts an options object', async () => {
      const calls = capture(bot);
      await bot.deleteAllMessageReactions(5, { actor_chat_id: 7 });
      assert.equal(calls[0].options.form.chat_id, 5);
      assert.equal(calls[0].options.form.actor_chat_id, 7);
    });
  });

  describe('_buildURL()', () => {
    it('builds the standard Bot API URL', () => {
      assert.equal(bot._buildURL('getMe'), `https://api.telegram.org/bot${TOKEN}/getMe`);
    });

    it('honours testEnvironment and baseApiUrl', () => {
      const b = new TelegramBot(TOKEN, { testEnvironment: true, baseApiUrl: 'http://localhost:8081' });
      assert.equal(b._buildURL('getMe'), `http://localhost:8081/bot${TOKEN}/test/getMe`);
    });
  });

  describe('getFileLink()', () => {
    it('derives the file URL from getFile()', async () => {
      bot.getFile = () => Promise.resolve({ file_path: 'photos/file_1.jpg' });
      const url = await bot.getFileLink('FILE_ID');
      assert.equal(url, `https://api.telegram.org/file/bot${TOKEN}/photos/file_1.jpg`);
    });
  });
});
