/**
 * Optional, opt-in network tuning that removes the most common latency
 * penalties when talking to the Telegram Bot API over a fresh connection.
 *
 * The biggest offender is Node's "happy eyeballs" behaviour: on networks with
 * broken or absent IPv6 it waits `autoSelectFamilyAttemptTimeout` (250ms by
 * default) before falling back to IPv4 — on *every* new connection. Preferring
 * IPv4 and shortening that window can cut 100–250ms off cold requests.
 *
 * These helpers mutate process-global Node settings, so they are never applied
 * automatically — call `applyNetworkTuning()` once at startup, or pass
 * `{ ipv4First: true }` to the `TelegramBot` constructor.
 *
 * @module network
 */

/**
 * Apply latency-oriented network defaults.
 *
 * @param  {Object} [options]
 * @param  {Boolean} [options.ipv4First=true] Prefer IPv4 when resolving hosts
 *   (`dns.setDefaultResultOrder('ipv4first')`).
 * @param  {Number} [options.autoSelectFamilyAttemptTimeout=100] Milliseconds to
 *   wait for an IPv6 connection before falling back to IPv4 (Node default: 250).
 * @return {Object} The applied settings.
 */
function applyNetworkTuning(options = {}) {
  const ipv4First = options.ipv4First !== false;
  const autoSelectFamilyAttemptTimeout = typeof options.autoSelectFamilyAttemptTimeout === 'number'
    ? options.autoSelectFamilyAttemptTimeout
    : 100;

  const dns = require('dns');
  const net = require('net');

  if (ipv4First && typeof dns.setDefaultResultOrder === 'function') {
    dns.setDefaultResultOrder('ipv4first');
  }

  if (typeof net.setDefaultAutoSelectFamilyAttemptTimeout === 'function') {
    net.setDefaultAutoSelectFamilyAttemptTimeout(autoSelectFamilyAttemptTimeout);
  }

  return { ipv4First, autoSelectFamilyAttemptTimeout };
}

module.exports = { applyNetworkTuning };
