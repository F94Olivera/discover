import * as Crypto from 'expo-crypto';
import type { PasswordTools } from './registration';

// Educational salted SHA-256 verifier, not production password authentication.
export const passwordTools: PasswordTools = {
  createId: () => `user-${Crypto.randomUUID()}`,
  createSalt: async () => Array.from(await Crypto.getRandomBytesAsync(16), byte => byte.toString(16).padStart(2, '0')).join(''),
  hash: (password, salt) => Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${password}`),
};
