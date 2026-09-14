'use strict';

const assert = require('node:assert/strict');
const { detectFileType, lookupMime } = require('../src/fileTypes');

describe('fileTypes', () => {
  describe('detectFileType()', () => {
    const cases = [
      ['PNG', Buffer.from('89504e470d0a1a0a', 'hex'), { ext: 'png', mime: 'image/png' }],
      ['JPEG', Buffer.from('ffd8ffe000104a464946', 'hex'), { ext: 'jpg', mime: 'image/jpeg' }],
      ['GIF89a', Buffer.from('GIF89a....', 'ascii'), { ext: 'gif', mime: 'image/gif' }],
      ['WEBP', Buffer.from('RIFF\x00\x00\x00\x00WEBP', 'binary'), { ext: 'webp', mime: 'image/webp' }],
      ['WAV', Buffer.from('RIFF\x00\x00\x00\x00WAVE', 'binary'), { ext: 'wav', mime: 'audio/wav' }],
      ['AVI', Buffer.from('RIFF\x00\x00\x00\x00AVI ', 'binary'), { ext: 'avi', mime: 'video/x-msvideo' }],
      ['PDF', Buffer.from('%PDF-1.7', 'ascii'), { ext: 'pdf', mime: 'application/pdf' }],
      ['ZIP', Buffer.from('504b0304', 'hex'), { ext: 'zip', mime: 'application/zip' }],
      ['GZIP', Buffer.from('1f8b08', 'hex'), { ext: 'gz', mime: 'application/gzip' }],
      ['OGG', Buffer.from('OggS\x00\x02', 'binary'), { ext: 'ogg', mime: 'audio/ogg' }],
      ['FLAC', Buffer.from('fLaC\x00\x00', 'binary'), { ext: 'flac', mime: 'audio/flac' }],
      ['MP3 (ID3)', Buffer.from('ID3\x04\x00', 'binary'), { ext: 'mp3', mime: 'audio/mpeg' }],
      ['MP3 (frame)', Buffer.from('fffb90', 'hex'), { ext: 'mp3', mime: 'audio/mpeg' }],
      ['WEBM', Buffer.from('1a45dfa3', 'hex'), { ext: 'webm', mime: 'video/webm' }],
      ['MP4', Buffer.from('\x00\x00\x00\x18ftypmp42', 'binary'), { ext: 'mp4', mime: 'video/mp4' }],
      ['M4A', Buffer.from('\x00\x00\x00\x18ftypM4A ', 'binary'), { ext: 'm4a', mime: 'audio/mp4' }],
      ['MOV', Buffer.from('\x00\x00\x00\x14ftypqt  ', 'binary'), { ext: 'mov', mime: 'video/quicktime' }],
      ['3GP', Buffer.from('\x00\x00\x00\x18ftyp3gp4', 'binary'), { ext: '3gp', mime: 'video/3gpp' }],
    ];

    for (const [label, buffer, expected] of cases) {
      it(`detects ${label}`, () => {
        assert.deepEqual(detectFileType(buffer), expected);
      });
    }

    it('returns null for unknown and non-buffer data', () => {
      assert.equal(detectFileType(Buffer.from('0102030405060708', 'hex')), null);
      assert.equal(detectFileType(Buffer.from([0x01, 0x02])), null);
      assert.equal(detectFileType('not a buffer'), null);
      assert.equal(detectFileType(null), null);
    });
  });

  describe('lookupMime()', () => {
    it('maps known extensions case-insensitively', () => {
      assert.equal(lookupMime('photo.PNG'), 'image/png');
      assert.equal(lookupMime('clip.mp4'), 'video/mp4');
      assert.equal(lookupMime('data.json'), 'application/json');
      assert.equal(lookupMime('png'), 'image/png');
    });

    it('falls back to application/octet-stream', () => {
      assert.equal(lookupMime('mystery.zzz'), 'application/octet-stream');
      assert.equal(lookupMime('noextension'), 'application/octet-stream');
      assert.equal(lookupMime(''), 'application/octet-stream');
      assert.equal(lookupMime(null), 'application/octet-stream');
    });
  });
});
