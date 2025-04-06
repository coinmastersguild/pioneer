"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashToMnemonic = hashToMnemonic;
exports.entropyToMnemonic = entropyToMnemonic;
exports.mnemonicToEntropy = mnemonicToEntropy;
exports.mnemonicToSeedSync = mnemonicToSeedSync;
exports.mnemonicToSeed = mnemonicToSeed;
exports.generateMnemonic = generateMnemonic;
exports.validateMnemonic = validateMnemonic;
var sha256_1 = require("@noble/hashes/sha256");
var sha512_1 = require("@noble/hashes/sha512");
var pbkdf2_1 = require("@noble/hashes/pbkdf2");
var utils_1 = require("@noble/hashes/utils");
var en_1 = require("./en");
var INVALID_MNEMONIC = 'Invalid mnemonic';
var INVALID_ENTROPY = 'Invalid entropy';
var INVALID_CHECKSUM = 'Invalid mnemonic checksum';
var WORDLIST_REQUIRED = 'A wordlist is required but a default could not be found.\nPlease pass a 2048 word array explicitly.';
function normalize(str) {
    return (str || '').normalize('NFKD');
}
function lpad(str, padString, length) {
    while (str.length < length) {
        str = padString + str;
    }
    return str;
}
function binaryToByte(bin) {
    return parseInt(bin, 2);
}
function bytesToBinary(bytes) {
    return bytes.map(function (x) { return lpad(x.toString(2), '0', 8); }).join('');
}
function deriveChecksumBits(entropyBuffer) {
    var ENT = entropyBuffer.length * 8;
    var CS = ENT / 32;
    var hash = (0, sha256_1.sha256)(Uint8Array.from(entropyBuffer));
    return bytesToBinary(Array.from(hash)).slice(0, CS);
}
function salt(password) {
    return 'mnemonic' + (password || '');
}
function mnemonicToSeedSync(mnemonic, password) {
    if (password === void 0) { password = ''; }
    var mnemonicBuffer = Uint8Array.from(Buffer.from(normalize(mnemonic), 'utf8'));
    var saltBuffer = Uint8Array.from(Buffer.from(salt(normalize(password)), 'utf8'));
    var res = (0, pbkdf2_1.pbkdf2)(sha512_1.sha512, mnemonicBuffer, saltBuffer, { c: 2048, dkLen: 64 });
    return Buffer.from(res);
}
function mnemonicToSeed(mnemonic, password) {
    if (password === void 0) { password = ''; }
    var mnemonicBuffer = Uint8Array.from(Buffer.from(normalize(mnemonic), 'utf8'));
    var saltBuffer = Uint8Array.from(Buffer.from(salt(normalize(password)), 'utf8'));
    return (0, pbkdf2_1.pbkdf2Async)(sha512_1.sha512, mnemonicBuffer, saltBuffer, { c: 2048, dkLen: 64 }).then(function (res) { return Buffer.from(res); });
}
function mnemonicToEntropy(mnemonic) {
    if (!en_1.wordlist) {
        throw new Error(WORDLIST_REQUIRED);
    }
    var words = normalize(mnemonic).split(' ');
    if (words.length % 3 !== 0) {
        throw new Error(INVALID_MNEMONIC);
    }
    var bits = words
        .map(function (word) {
        var index = en_1.wordlist.indexOf(word);
        if (index === -1) {
            throw new Error(INVALID_MNEMONIC);
        }
        return lpad(index.toString(2), '0', 11);
    })
        .join('');
    var dividerIndex = Math.floor(bits.length / 33) * 32;
    var entropyBits = bits.slice(0, dividerIndex);
    var checksumBits = bits.slice(dividerIndex);
    var entropyBytes = entropyBits.match(/(.{1,8})/g).map(binaryToByte);
    if (entropyBytes.length < 16) {
        throw new Error(INVALID_ENTROPY);
    }
    if (entropyBytes.length > 32) {
        throw new Error(INVALID_ENTROPY);
    }
    if (entropyBytes.length % 4 !== 0) {
        throw new Error(INVALID_ENTROPY);
    }
    var entropy = Buffer.from(entropyBytes);
    var newChecksum = deriveChecksumBits(Uint8Array.from(entropy));
    if (newChecksum !== checksumBits) {
        throw new Error(INVALID_CHECKSUM);
    }
    return entropy.toString('hex');
}
function entropyToMnemonic(entropy) {
    if (!Buffer.isBuffer(entropy)) {
        entropy = Buffer.from(entropy, 'hex');
    }
    if (!en_1.wordlist) {
        throw new Error(WORDLIST_REQUIRED);
    }
    if (entropy.length < 16) {
        throw new TypeError(INVALID_ENTROPY);
    }
    if (entropy.length > 32) {
        throw new TypeError(INVALID_ENTROPY);
    }
    if (entropy.length % 4 !== 0) {
        throw new TypeError(INVALID_ENTROPY);
    }
    var entropyBits = bytesToBinary(Array.from(entropy));
    var checksumBits = deriveChecksumBits(Uint8Array.from(entropy));
    var bits = entropyBits + checksumBits;
    var chunks = bits.match(/(.{1,11})/g);
    var words = chunks.map(function (binary) {
        var index = binaryToByte(binary);
        return en_1.wordlist[index];
    });
    return en_1.wordlist[0] === '\u3042\u3044\u3053\u304f\u3057\u3093' // Japanese wordlist
        ? words.join('\u3000')
        : words.join(' ');
}
function generateMnemonic(strength, rng) {
    if (strength === void 0) { strength = 128; }
    if (rng === void 0) { rng = function (size) { return Buffer.from((0, utils_1.randomBytes)(size)); }; }
    if (strength % 32 !== 0) {
        throw new TypeError(INVALID_ENTROPY);
    }
    return entropyToMnemonic(rng(strength / 8));
}
function validateMnemonic(mnemonic) {
    try {
        mnemonicToEntropy(mnemonic);
    }
    catch (e) {
        return false;
    }
    return true;
}
function hashToMnemonic(hash) {
    var cleanHash = hash.startsWith('0x') ? hash.slice(2) : hash;
    var entropy = cleanHash.slice(0, 32);
    return entropyToMnemonic(entropy);
}
