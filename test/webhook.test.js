'use strict';

const assert = require('node:assert/strict');
const http = require('node:http');
const net = require('node:net');
const TelegramBot = require('../src/telegram');

const TOKEN = '123456:TEST-TOKEN';

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

function request(port, { method = 'GET', path = '/', body, headers = {} } = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port, method, path, headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });
    req.on('error', reject);
    if (body !== undefined) req.write(body);
    req.end();
  });
}

describe('webhook server', () => {
  let bot;
  let port;

  beforeEach(async () => {
    port = await freePort();
    bot = new TelegramBot(TOKEN, {
      webHook: { autoOpen: false, host: '127.0.0.1', port, healthEndpoint: '/healthz' },
    });
    await bot.openWebHook();
  });

  afterEach(async () => {
    if (bot.hasOpenWebHook()) await bot.closeWebHook();
  });

  it('reports as open and closed', async () => {
    assert.equal(bot.hasOpenWebHook(), true);
    await bot.closeWebHook();
    assert.equal(bot.hasOpenWebHook(), false);
  });

  it('processes a valid update and replies OK', async () => {
    let received = null;
    bot.on('message', (msg) => { received = msg; });

    const payload = JSON.stringify({
      update_id: 1,
      message: { message_id: 7, chat: { id: 1, type: 'private' }, text: 'webhook' },
    });

    const res = await request(port, {
      method: 'POST',
      path: `/${TOKEN}`,
      headers: { 'content-type': 'application/json', 'content-length': Buffer.byteLength(payload) },
      body: payload,
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body, 'OK');
    assert.equal(received.message_id, 7);
  });

  it('answers the health endpoint with 200', async () => {
    const res = await request(port, { method: 'GET', path: '/healthz' });
    assert.equal(res.statusCode, 200);
    assert.equal(res.body, 'OK');
  });

  it('rejects unauthorized paths with 401', async () => {
    const res = await request(port, { method: 'POST', path: '/wrong-token', body: '{}' });
    assert.equal(res.statusCode, 401);
  });

  it('responds 418 for non-POST requests to the webhook path', async () => {
    const res = await request(port, { method: 'GET', path: `/${TOKEN}` });
    assert.equal(res.statusCode, 418);
  });

  it('rejects bodies larger than maxBodySize with 413', async () => {
    await bot.closeWebHook();
    const smallPort = await freePort();
    const limited = new TelegramBot(TOKEN, {
      webHook: { autoOpen: false, host: '127.0.0.1', port: smallPort, maxBodySize: 16 },
    });
    await limited.openWebHook();
    try {
      const res = await request(smallPort, {
        method: 'POST',
        path: `/${TOKEN}`,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ update_id: 1, message: { text: 'this is definitely too large' } }),
      });
      assert.equal(res.statusCode, 413);
    } finally {
      await limited.closeWebHook();
    }
  });

  it('rejects requests missing the configured secret token header', async () => {
    await bot.closeWebHook();
    const secretPort = await freePort();
    const secured = new TelegramBot(TOKEN, {
      webHook: { autoOpen: false, host: '127.0.0.1', port: secretPort, secretToken: 's3cret' },
    });
    await secured.openWebHook();
    try {
      const payload = JSON.stringify({ update_id: 1, message: { message_id: 1, chat: { id: 1 } } });

      const denied = await request(secretPort, {
        method: 'POST',
        path: `/${TOKEN}`,
        headers: { 'content-type': 'application/json', 'content-length': Buffer.byteLength(payload) },
        body: payload,
      });
      assert.equal(denied.statusCode, 403);

      let received = null;
      secured.on('message', (msg) => { received = msg; });

      const allowed = await request(secretPort, {
        method: 'POST',
        path: `/${TOKEN}`,
        headers: {
          'content-type': 'application/json',
          'content-length': Buffer.byteLength(payload),
          'x-telegram-bot-api-secret-token': 's3cret',
        },
        body: payload,
      });
      assert.equal(allowed.statusCode, 200);
      assert.equal(received.message_id, 1);
    } finally {
      await secured.closeWebHook();
    }
  });

  it('answers health checks only on the exact endpoint path', async () => {
    const wrong = await request(port, { method: 'GET', path: '/healthz/extra' });
    assert.equal(wrong.statusCode, 401);
    const right = await request(port, { method: 'GET', path: '/healthz' });
    assert.equal(right.statusCode, 200);
  });
});
