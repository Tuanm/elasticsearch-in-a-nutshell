/**
 * Prints a message.
 *
 * @param {String} message the message.
 * @param {Boolean} err to specify whether the message need printing via `stderr` or `stdout`.
 */
function log(message = '', err = false) {
    if (!!message) {
        const std = !!err ? process.stdout : process.stderr;
        std.write(message);
    }
}

module.exports = log;