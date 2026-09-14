/**
 * Zero-dependency file type detection and MIME lookup.
 *
 * Replaces the `file-type` and `mime` packages so the library installs with a
 * minimal, fully CommonJS dependency tree and no ESM/CJS interop surprises.
 *
 * @module fileTypes
 * @private
 */

/**
 * Magic-byte signatures for the file formats that can be uploaded through the
 * Telegram Bot API. Each entry is `{ ext, mime, bytes? , ascii?, offset? }`.
 */
const SIGNATURES = [
  { bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], ext: 'png', mime: 'image/png' },
  { bytes: [0xff, 0xd8, 0xff], ext: 'jpg', mime: 'image/jpeg' },
  { ascii: 'GIF87a', ext: 'gif', mime: 'image/gif' },
  { ascii: 'GIF89a', ext: 'gif', mime: 'image/gif' },
  { ascii: 'RIFF', ext: 'webp', mime: 'image/webp', tail: { offset: 8, ascii: 'WEBP' } },
  { ascii: 'RIFF', ext: 'wav', mime: 'audio/wav', tail: { offset: 8, ascii: 'WAVE' } },
  { ascii: 'RIFF', ext: 'avi', mime: 'video/x-msvideo', tail: { offset: 8, ascii: 'AVI ' } },
  { bytes: [0x42, 0x4d], ext: 'bmp', mime: 'image/bmp' },
  { ascii: 'II*\u0000', ext: 'tiff', mime: 'image/tiff' },
  { ascii: 'MM\u0000*', ext: 'tiff', mime: 'image/tiff' },
  { ascii: '%PDF', ext: 'pdf', mime: 'application/pdf' },
  { bytes: [0x50, 0x4b, 0x03, 0x04], ext: 'zip', mime: 'application/zip' },
  { bytes: [0x1f, 0x8b], ext: 'gz', mime: 'application/gzip' },
  { bytes: [0x52, 0x61, 0x72, 0x21, 0x1a, 0x07], ext: 'rar', mime: 'application/x-rar-compressed' },
  { bytes: [0x37, 0x7a, 0xbc, 0xaf, 0x27, 0x1c], ext: '7z', mime: 'application/x-7z-compressed' },
  { ascii: 'ID3', ext: 'mp3', mime: 'audio/mpeg' },
  { bytes: [0xff, 0xfb], ext: 'mp3', mime: 'audio/mpeg' },
  { bytes: [0xff, 0xf3], ext: 'mp3', mime: 'audio/mpeg' },
  { bytes: [0xff, 0xf2], ext: 'mp3', mime: 'audio/mpeg' },
  { ascii: 'OggS', ext: 'ogg', mime: 'audio/ogg' },
  { ascii: 'fLaC', ext: 'flac', mime: 'audio/flac' },
  { bytes: [0x1a, 0x45, 0xdf, 0xa3], ext: 'webm', mime: 'video/webm' },
  { ascii: 'MThd', ext: 'mid', mime: 'audio/midi' },
  { ascii: '{\\rtf', ext: 'rtf', mime: 'application/rtf' },
];

/** ISO-BMFF brands (`ftyp` box) mapped to a container extension + MIME type. */
const FTYP_BRANDS = {
  'M4A ': { ext: 'm4a', mime: 'audio/mp4' },
  'M4V ': { ext: 'm4v', mime: 'video/x-m4v' },
  'qt  ': { ext: 'mov', mime: 'video/quicktime' },
  '3gp4': { ext: '3gp', mime: 'video/3gpp' },
  '3gp5': { ext: '3gp', mime: 'video/3gpp' },
};

/**
 * Common filename extensions mapped to their MIME type. Used when an explicit
 * content type is not provided for a path/stream upload.
 */
const EXTENSION_MIME = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  bmp: 'image/bmp',
  tiff: 'image/tiff',
  tif: 'image/tiff',
  svg: 'image/svg+xml',
  heic: 'image/heic',
  ico: 'image/x-icon',
  mp3: 'audio/mpeg',
  m4a: 'audio/mp4',
  aac: 'audio/aac',
  ogg: 'audio/ogg',
  oga: 'audio/ogg',
  opus: 'audio/opus',
  wav: 'audio/wav',
  flac: 'audio/flac',
  mp4: 'video/mp4',
  m4v: 'video/x-m4v',
  mov: 'video/quicktime',
  avi: 'video/x-msvideo',
  webm: 'video/webm',
  mkv: 'video/x-matroska',
  '3gp': 'video/3gpp',
  pdf: 'application/pdf',
  zip: 'application/zip',
  gz: 'application/gzip',
  tgz: 'application/gzip',
  tar: 'application/x-tar',
  rar: 'application/x-rar-compressed',
  '7z': 'application/x-7z-compressed',
  txt: 'text/plain',
  csv: 'text/csv',
  html: 'text/html',
  htm: 'text/html',
  css: 'text/css',
  js: 'application/javascript',
  json: 'application/json',
  xml: 'application/xml',
  md: 'text/markdown',
  rtf: 'application/rtf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  epub: 'application/epub+zip',
  apk: 'application/vnd.android.package-archive',
  tgs: 'application/x-tgsticker',
  ttf: 'font/ttf',
  otf: 'font/otf',
  woff: 'font/woff',
  woff2: 'font/woff2',
};

/**
 * Compare a byte sequence against the buffer at the given offset.
 * @private
 */
function matchesBytes(buffer, bytes, offset = 0) {
  if (buffer.length < offset + bytes.length) return false;
  for (let i = 0; i < bytes.length; i += 1) {
    if (buffer[offset + i] !== bytes[i]) return false;
  }
  return true;
}

/**
 * Compare an ASCII sequence against the buffer at the given offset.
 * @private
 */
function matchesAscii(buffer, ascii, offset = 0) {
  if (buffer.length < offset + ascii.length) return false;
  for (let i = 0; i < ascii.length; i += 1) {
    if (buffer[offset + i] !== ascii.charCodeAt(i)) return false;
  }
  return true;
}

/**
 * Detect the file type of a Buffer from its magic bytes.
 *
 * @param  {Buffer} buffer Data to inspect
 * @return {Object|null} `{ ext, mime }` when recognized, otherwise `null`
 */
function detectFileType(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 3) {
    return null;
  }

  for (const sig of SIGNATURES) {
    const headMatches = sig.bytes
      ? matchesBytes(buffer, sig.bytes)
      : matchesAscii(buffer, sig.ascii);

    if (!headMatches) continue;

    if (sig.tail && !matchesAscii(buffer, sig.tail.ascii, sig.tail.offset)) {
      continue;
    }

    return { ext: sig.ext, mime: sig.mime };
  }

  // ISO Base Media File Format (mp4/m4a/mov/3gp) — 'ftyp' box at offset 4.
  if (buffer.length >= 12 && matchesAscii(buffer, 'ftyp', 4)) {
    const brand = buffer.toString('ascii', 8, 12);
    return FTYP_BRANDS[brand] || { ext: 'mp4', mime: 'video/mp4' };
  }

  return null;
}

/**
 * Look up a MIME type by filename or extension. Falls back to
 * `application/octet-stream` for unknown extensions.
 *
 * @param  {String} filename File name or extension (with or without a dot)
 * @return {String} MIME type
 */
function lookupMime(filename) {
  if (!filename || typeof filename !== 'string') {
    return 'application/octet-stream';
  }
  const match = /\.([a-z0-9]+)$/i.exec(filename);
  const ext = (match ? match[1] : filename).toLowerCase();
  return EXTENSION_MIME[ext] || 'application/octet-stream';
}

module.exports = { detectFileType, lookupMime };
