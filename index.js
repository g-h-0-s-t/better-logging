const betterLogging = require('./dist/api');
module.exports = betterLogging.betterLogging;
module.exports.default = betterLogging.default;
module.exports.betterLogging = betterLogging.betterLogging;
module.exports.expressMiddleware = betterLogging.expressMiddleware;
module.exports.CustomInstance = betterLogging.CustomInstance;