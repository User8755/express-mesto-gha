const { DEFAULT } = require('./errors');

class DefaultError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = DEFAULT;
  }
}

module.exports = DefaultError;
