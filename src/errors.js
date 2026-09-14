exports.BaseError = class BaseError extends Error {
  /**
   * @class BaseError
   * @constructor
   * @private
   * @param  {String} code Error code
   * @param  {String} message Error message
   */
  constructor(code, message) {
    super(`${code}: ${message}`);
    this.code = code;
  }
  toJSON() {
    return {
      code: this.code,
      message: this.message,
    };
  }
};


/**
 * Build a readable message from an arbitrary thrown value. Handles the common
 * case where a non-`Error` or an `AggregateError` has an empty `message`, which
 * previously produced a blank `EFATAL:` error.
 * @private
 * @param  {*} data
 * @return {String}
 */
function describeError(data) {
  if (typeof data === 'string') return data;
  if (data === null || data === undefined) return String(data);
  if (data instanceof Error) {
    if (data.errors && data.errors.length) {
      const nested = data.errors.map(describeError).join('; ');
      return data.message ? `${data.message} (${nested})` : nested;
    }
    const label = data.code || data.name || 'Error';
    return data.message ? `${label}: ${data.message}` : String(label);
  }
  if (typeof data.message === 'string' && data.message) return data.message;
  try {
    return JSON.stringify(data);
  } catch {
    return String(data);
  }
}

exports.FatalError = class FatalError extends exports.BaseError {
  /**
   * Fatal Error. Error code is `"EFATAL"`.
   * @class FatalError
   * @constructor
   * @param  {String|Error} data Error object or message
   */
  constructor(data) {
    const error = (typeof data === 'string') ? null : data;
    super('EFATAL', describeError(data));
    if (error) {
      this.stack = error.stack || this.stack;
      // Preserve the original error for programmatic inspection & logging.
      this.cause = error;
    }
  }
};


exports.ParseError = class ParseError extends exports.BaseError {
  /**
   * Error during parsing. Error code is `"EPARSE"`.
   * @class ParseError
   * @constructor
   * @param  {String} message Error message
   * @param  {http.IncomingMessage} response Server response
   */
  constructor(message, response) {
    super('EPARSE', message);
    this.response = response;
  }
};


exports.TelegramError = class TelegramError extends exports.BaseError {
  /**
   * Error returned from Telegram. Error code is `"ETELEGRAM"`.
   * @class TelegramError
   * @constructor
   * @param  {String} message Error message
   * @param  {http.IncomingMessage} response Server response
   */
  constructor(message, response) {
    super('ETELEGRAM', message);
    this.response = response;
  }
};
