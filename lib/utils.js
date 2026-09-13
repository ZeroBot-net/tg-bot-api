'use strict';

var util = require('util');
// Native deprecation warning
exports.deprecate = function (msg) {
  return util.deprecate(function () {}, msg, '@zero-bot.net/tg-bot-api')();
};