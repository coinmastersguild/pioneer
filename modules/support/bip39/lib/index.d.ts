declare function mnemonicToSeedSync(mnemonic: string, password?: string): Buffer;
declare function mnemonicToSeed(mnemonic: string, password?: string): Promise<Buffer>;
declare function mnemonicToEntropy(mnemonic: string): string;
declare function entropyToMnemonic(entropy: string | Buffer): string;
declare function generateMnemonic(strength?: number, rng?: (size: number) => Buffer): string;
declare function validateMnemonic(mnemonic: string): boolean;
export { hashToMnemonic, entropyToMnemonic, mnemonicToEntropy, mnemonicToSeedSync, mnemonicToSeed, generateMnemonic, validateMnemonic };
declare function hashToMnemonic(hash: string): string;
