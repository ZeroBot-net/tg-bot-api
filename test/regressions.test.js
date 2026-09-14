'use strict';

const assert = require('node:assert/strict');
const TelegramBot = require('../src/telegram');

const TOKEN = '123456:TEST-TOKEN';

/**
 * Capture `_request` calls without performing I/O, but still run the same
 * option preprocessing the real `_request` applies (so serialization is tested).
 */
function capture(bot) {
  const calls = [];
  bot._request = (methodPath, options) => {
    bot._preprocessOptions(options);
    calls.push({ methodPath, options });
    return Promise.resolve(true);
  };
  return calls;
}

describe('regressions', () => {
  let bot;
  beforeEach(() => { bot = new TelegramBot(TOKEN); });

  describe('wrong API endpoint', () => {
    it('replaceStickerInSet calls replaceStickerInSet (not deleteStickerFromSet)', async () => {
      const calls = capture(bot);
      await bot.replaceStickerInSet(1, 'set', 'old_id', {});
      assert.equal(calls[0].methodPath, 'replaceStickerInSet');
    });

    it('unpinAllGeneralForumTopicMessages calls the matching endpoint', async () => {
      const calls = capture(bot);
      await bot.unpinAllGeneralForumTopicMessages(1, {});
      assert.equal(calls[0].methodPath, 'unpinAllGeneralForumTopicMessages');
    });
  });

  describe('wrong field name', () => {
    it('getUserChatBoosts sends user_id, not message_id', async () => {
      const calls = capture(bot);
      await bot.getUserChatBoosts(5, 99);
      assert.equal(calls[0].options.form.user_id, 99);
      assert.equal(calls[0].options.form.message_id, undefined);
    });
  });

  describe('structured parameters are serialized', () => {
    it('restrictChatMember serializes permissions', async () => {
      const calls = capture(bot);
      await bot.restrictChatMember(1, 2, { permissions: { can_send_messages: false } });
      assert.equal(calls[0].options.form.permissions, JSON.stringify({ can_send_messages: false }));
    });

    it('setChatMenuButton serializes menu_button', async () => {
      const calls = capture(bot);
      await bot.setChatMenuButton({ menu_button: { type: 'commands' } });
      assert.equal(calls[0].options.form.menu_button, JSON.stringify({ type: 'commands' }));
    });

    it('setMyDefaultAdministratorRights serializes rights', async () => {
      const calls = capture(bot);
      await bot.setMyDefaultAdministratorRights({ rights: { can_manage_chat: true } });
      assert.equal(calls[0].options.form.rights, JSON.stringify({ can_manage_chat: true }));
    });

    it('getUpdates serializes allowed_updates', async () => {
      const calls = capture(bot);
      await bot.getUpdates({ allowed_updates: ['message', 'callback_query'] });
      assert.equal(calls[0].options.form.allowed_updates, JSON.stringify(['message', 'callback_query']));
    });

    it('setWebHook serializes allowed_updates', async () => {
      const calls = capture(bot);
      await bot.setWebHook('https://example.com', { allowed_updates: ['message'] });
      assert.equal(calls[0].options.qs.allowed_updates, JSON.stringify(['message']));
    });

    it('createInvoiceLink serializes prices, provider_data and suggested_tip_amounts', async () => {
      const calls = capture(bot);
      await bot.createInvoiceLink('t', 'd', 'p', 'tok', 'XTR', [{ label: 'l', amount: 1 }], {
        provider_data: { a: 1 },
        suggested_tip_amounts: [100, 200],
      });
      const { form } = calls[0].options;
      assert.equal(form.prices, JSON.stringify([{ label: 'l', amount: 1 }]));
      assert.equal(form.provider_data, JSON.stringify({ a: 1 }));
      assert.equal(form.suggested_tip_amounts, JSON.stringify([100, 200]));
    });

    it('file uploads serialize caption_entities via qs', async () => {
      const calls = capture(bot);
      const entities = [{ type: 'bold', offset: 0, length: 5 }];
      await bot.sendPhoto(1, Buffer.from('89504e470d0a1a0a', 'hex'), { caption_entities: entities });
      assert.equal(calls[0].options.qs.caption_entities, JSON.stringify(entities));
    });
  });

  describe('sendChecklist', () => {
    it('sends a single JSON checklist (object form)', async () => {
      const calls = capture(bot);
      await bot.sendChecklist('bc', { title: 'T', tasks: [{ text: 'a' }] });
      assert.equal(calls[0].methodPath, 'sendChecklist');
      assert.equal(calls[0].options.form.checklist, JSON.stringify({ title: 'T', tasks: [{ text: 'a' }] }));
      assert.equal(calls[0].options.form.title, undefined);
    });

    it('sends a single JSON checklist (legacy title/tasks form)', async () => {
      const calls = capture(bot);
      await bot.sendChecklist('bc', 'T', [{ text: 'a' }]);
      assert.equal(calls[0].options.form.checklist, JSON.stringify({ title: 'T', tasks: [{ text: 'a' }] }));
    });
  });

  describe('getForumTopicIconStickers', () => {
    it('sends no chat_id when called without arguments', async () => {
      const calls = capture(bot);
      await bot.getForumTopicIconStickers();
      assert.equal(calls[0].options.form.chat_id, undefined);
    });
  });

  describe('constructor', () => {
    it('does not mutate the caller options object', () => {
      const options = { polling: false };
      const instance = new TelegramBot(TOKEN, options);
      assert.ok(instance);
      assert.deepEqual(options, { polling: false });
    });
  });
});
