/*


	sign and validate



 */

require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

let bip39 = require('../lib/index')

//test seed
let TEST_HASH = '0x061f9c04c904431e2568178e3cd42282'
let TEST_SEED = 'alcohol woman abuse must during monitor noble actual mixed trade anger aisle'

let hash_seed = bip39.hashToMnemonic(TEST_HASH)
console.log("hash_seed: ",hash_seed)

//
let entrop_seed = bip39.mnemonicToEntropy(TEST_SEED)
console.log("Entropy: ",entrop_seed)

let seed = bip39.entropyToMnemonic(entrop_seed)
console.log("Seed: ",seed)
