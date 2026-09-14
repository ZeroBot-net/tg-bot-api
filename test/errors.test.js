'use strict';

const assert = require('node:assert/strict');
const errors = require('../src/errors');

describe('errors', () => {
  describe('BaseError', () => {
    it('formats "CODE: message" and exposes the code', () => {
      const err = new errors.BaseError('EX', 'boom');
      assert.ok(err instanceof Error);
      assert.equal(err.code, 'EX');
      assert.equal(err.message, 'EX: boom');
    });

    it('serializes via toJSON()', () => {
      const err = new errors.BaseError('EX', 'boom');
      assert.deepEqual(err.toJSON(), { code: 'EX', message: 'EX: boom' });
    });
  });

  describe('FatalError', () => {
    it('accepts a plain string', () => {
      const err = new errors.FatalError('nope');
      assert.equal(err.code, 'EFATAL');
      assert.equal(err.message, 'EFATAL: nope');
      assert.equal(err.cause, undefined);
    });

    it('preserves the underlying error as .cause and keeps its stack', () => {
      const source = new Error('socket hang up');
      source.code = 'ECONNRESET';
      const err = new errors.FatalError(source);
      assert.equal(err.cause, source);
      assert.equal(err.stack, source.stack);
      assert.match(err.message, /socket hang up/);
      assert.match(err.message, /ECONNRESET/);
    });

    it('renders inner errors of an AggregateError instead of a blank message', () => {
      const agg = new AggregateError([new Error('first'), new Error('second')]);
      const err = new errors.FatalError(agg);
      assert.match(err.message, /first/);
      assert.match(err.message, /second/);
      assert.notEqual(err.message.trim(), 'EFATAL:');
    });
  });

  describe('ParseError / TelegramError', () => {
    it('keep a reference to the server response', () => {
      const response = { statusCode: 400 };
      assert.equal(new errors.ParseError('bad json', response).response, response);
      assert.equal(new errors.TelegramError('400 bad', response).response, response);
    });
  });
});
