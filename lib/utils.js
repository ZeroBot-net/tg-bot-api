const util = require('util');
// Native deprecation warning
exports.deprecate = msg => util.deprecate(() => {}, msg, '@zero-bot.net/tg-bot-api')();