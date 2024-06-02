"use strict";

import { sha256 } from '@noble/hashes/sha256';
import { sha512 } from '@noble/hashes/sha512';
import { pbkdf2, pbkdf2Async } from '@noble/hashes/pbkdf2';
import { randomBytes } from '@noble/hashes/utils';
import { wordlist } from './en';

const INVALID_MNEMONIC = 'Invalid mnemonic';
const INVALID_ENTROPY = 'Invalid entropy';
const INVALID_CHECKSUM = 'Invalid mnemonic checksum';
const WORDLIST_REQUIRED = 'A wordlist is required but a default could not be found.\nPlease pass a 2048 word array explicitly.';

function normalize(str: string): string {
    return (str || '').normalize('NFKD');
}

function lpad(str: string, padString: string, length: number): string {
    while (str.length < length) {
        str = padString + str;
    }
    return str;
}

function binaryToByte(bin: string): number {
    return parseInt(bin, 2);
}

function bytesToBinary(bytes: number[]): string {
    return bytes.map((x) => lpad(x.toString(2), '0', 8)).join('');
}

function deriveChecksumBits(entropyBuffer: Uint8Array): string {
    const ENT = entropyBuffer.length * 8;
    const CS = ENT / 32;
    const hash = sha256(Uint8Array.from(entropyBuffer));
    return bytesToBinary(Array.from(hash)).slice(0, CS);
}

function salt(password?: string): string {
    return 'mnemonic' + (password || '');
}

function mnemonicToSeedSync(mnemonic: string, password: string = ''): Buffer {
    const mnemonicBuffer = Uint8Array.from(Buffer.from(normalize(mnemonic), 'utf8'));
    const saltBuffer = Uint8Array.from(Buffer.from(salt(normalize(password)), 'utf8'));
    const res = pbkdf2(sha512, mnemonicBuffer, saltBuffer, { c: 2048, dkLen: 64 });
    return Buffer.from(res);
}

function mnemonicToSeed(mnemonic: string, password: string = ''): Promise<Buffer> {
    const mnemonicBuffer = Uint8Array.from(Buffer.from(normalize(mnemonic), 'utf8'));
    const saltBuffer = Uint8Array.from(Buffer.from(salt(normalize(password)), 'utf8'));
    return pbkdf2Async(sha512, mnemonicBuffer, saltBuffer, { c: 2048, dkLen: 64 }).then((res: Uint8Array) => Buffer.from(res));
}

function mnemonicToEntropy(mnemonic: string): string {
    if (!wordlist) {
        throw new Error(WORDLIST_REQUIRED);
    }
    const words = normalize(mnemonic).split(' ');
    if (words.length % 3 !== 0) {
        throw new Error(INVALID_MNEMONIC);
    }
    const bits = words
        .map((word) => {
            const index = wordlist.indexOf(word);
            if (index === -1) {
                throw new Error(INVALID_MNEMONIC);
            }
            return lpad(index.toString(2), '0', 11);
        })
        .join('');
    const dividerIndex = Math.floor(bits.length / 33) * 32;
    const entropyBits = bits.slice(0, dividerIndex);
    const checksumBits = bits.slice(dividerIndex);
    const entropyBytes = entropyBits.match(/(.{1,8})/g)!.map(binaryToByte);
    if (entropyBytes.length < 16) {
        throw new Error(INVALID_ENTROPY);
    }
    if (entropyBytes.length > 32) {
        throw new Error(INVALID_ENTROPY);
    }
    if (entropyBytes.length % 4 !== 0) {
        throw new Error(INVALID_ENTROPY);
    }
    const entropy = Buffer.from(entropyBytes);
    const newChecksum = deriveChecksumBits(Uint8Array.from(entropy));
    if (newChecksum !== checksumBits) {
        throw new Error(INVALID_CHECKSUM);
    }
    return entropy.toString('hex');
}

function entropyToMnemonic(entropy: string | Buffer): string {
    if (!Buffer.isBuffer(entropy)) {
        entropy = Buffer.from(entropy, 'hex');
    }
    if (!wordlist) {
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
    const entropyBits = bytesToBinary(Array.from(entropy));
    const checksumBits = deriveChecksumBits(Uint8Array.from(entropy));
    const bits = entropyBits + checksumBits;
    const chunks = bits.match(/(.{1,11})/g);
    const words = chunks!.map((binary) => {
        const index = binaryToByte(binary);
        return wordlist![index];
    });
    return wordlist[0] === '\u3042\u3044\u3053\u304f\u3057\u3093' // Japanese wordlist
        ? words.join('\u3000')
        : words.join(' ');
}

function generateMnemonic(strength: number = 128, rng: (size: number) => Buffer = (size) => Buffer.from(randomBytes(size))): string {
    if (strength % 32 !== 0) {
        throw new TypeError(INVALID_ENTROPY);
    }
    return entropyToMnemonic(rng(strength / 8));
}

function validateMnemonic(mnemonic: string): boolean {
    try {
        mnemonicToEntropy(mnemonic);
    } catch (e) {
        return false;
    }
    return true;
}

export {
    hashToMnemonic,
    entropyToMnemonic,
    mnemonicToEntropy,
    mnemonicToSeedSync,
    mnemonicToSeed,
    generateMnemonic,
    validateMnemonic
};

function hashToMnemonic(hash: string): string {
    const cleanHash = hash.startsWith('0x') ? hash.slice(2) : hash;
    const entropy = cleanHash.slice(0, 32);
    return entropyToMnemonic(entropy);
}
