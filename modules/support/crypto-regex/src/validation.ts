/**
 * @license
 * https://github.com/ealmansi/cashaddrjs
 * Copyright (c) 2017-2020 Emilio Almansi
 * Distributed under the MIT software license, see the accompanying
 * file LICENSE or http://www.opensource.org/licenses/mit-license.php.
 */

'use strict';

/**
 * Validation utility.
 *
 * @module validation
 */

/**
 * Error thrown when encoding or decoding fail due to invalid input.
 *
 * @constructor ValidationError
 * @param {string} message Error description.
 */
function ValidationError(message:any) {
    var error = new Error();
    error.name = error.name = 'ValidationError';
    error.message = error.message = message;
    return error
}

// @ts-ignore
ValidationError.prototype = Object.create(Error.prototype);

/**
 * Validates a given condition, throwing a {@link ValidationError} if
 * the given condition does not hold.
 *
 * @static
 * @param {boolean} condition Condition to validate.
 * @param {string} message Error message in case the condition does not hold.
 */
// function validate(condition:any, message:any) {
//     if (!condition) {
//         // @ts-ignore
//         throw new ValidationError(message);
//     }
// }

module.exports = {
    // @ts-ignore
    ValidationError: ValidationError,
    // validate: validate,
};
