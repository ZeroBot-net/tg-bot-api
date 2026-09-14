'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const TelegramBot = require('../src/telegram');

const TOKEN = '123456:TEST-TOKEN';

describe('_formatSendData()', () => {
  let bot;

  before(() => {
    bot = new TelegramBot(TOKEN);
  });

  it('uploads a recognized Buffer with detected content type', () => {
    const [formData, fileId] = bot._formatSendData('photo', Buffer.from('89504e470d0a1a0a', 'hex'), {});
    assert.equal(fileId, null);
    assert.equal(formData.photo.options.contentType, 'image/png');
    assert.equal(formData.photo.options.filename, 'data.png');
  });

  it('honours explicit fileOptions over detection', () => {
    const [formData] = bot._formatSendData('document', Buffer.from('89504e470d0a1a0a', 'hex'), {
      filename: 'custom.bin',
      contentType: 'application/x-custom',
    });
    assert.equal(formData.document.options.filename, 'custom.bin');
    assert.equal(formData.document.options.contentType, 'application/x-custom');
  });

  it('treats plain strings (URLs / file_ids) as-is', () => {
    const [formData, fileId] = bot._formatSendData('photo', 'https://example.com/a.png', {});
    assert.equal(formData, null);
    assert.equal(fileId, 'https://example.com/a.png');
  });

  it('wraps an existing file path in a read stream', async () => {
    const file = path.join(os.tmpdir(), `tg-bot-api-${process.pid}.txt`);
    fs.writeFileSync(file, 'hello');
    try {
      const [formData] = bot._formatSendData('document', file, {});
      const stream = formData.document.value;
      assert.ok(stream instanceof fs.ReadStream);
      assert.equal(formData.document.options.filename, path.basename(file));

      // Close the stream deterministically before removing the temp file.
      await new Promise((resolve, reject) => {
        stream.once('open', () => stream.destroy());
        stream.once('close', resolve);
        stream.once('error', reject);
      });
    } finally {
      fs.unlinkSync(file);
    }
  });

  it('throws for unrecognized Buffer types unless NTBA_FIX_350 is set', () => {
    const garbage = Buffer.from('0102030405060708', 'hex');
    assert.throws(() => bot._formatSendData('photo', garbage, {}), /Unsupported Buffer file-type/);
  });

  describe('with NTBA_FIX_350', () => {
    const previous = process.env.NTBA_FIX_350;
    before(() => { process.env.NTBA_FIX_350 = '1'; });
    after(() => {
      if (previous === undefined) delete process.env.NTBA_FIX_350;
      else process.env.NTBA_FIX_350 = previous;
    });

    it('does not append an extension and does not throw on unknown buffers', () => {
      const [formData] = bot._formatSendData('photo', Buffer.from('0102030405060708', 'hex'), {});
      assert.equal(formData.photo.options.filename, 'filename');
      assert.equal(formData.photo.options.contentType, 'application/octet-stream');
    });
  });
});
