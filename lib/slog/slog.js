const argv = require('yargs').argv;
const slog = ( message = '', args=argv ) => !args.quiet ? console.log(message) : '';

module.exports = slog;
