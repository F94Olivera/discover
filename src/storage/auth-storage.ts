import type { Session, User } from '../types/auth';
import { isEmail, normalizeEmail } from '../features/auth/validation';

export const AUTH_KEYS = { users: 'tourism.users.v1', session: 'tourism.session.v1' } as const;
export type KeyValueStorage = {
  getItem: (key: string) => Promise<string | null>;
  removeItem: (key: string) => Promise<void>;
  setItem: (key: string, value: string) => Promise<void>;
};
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function isUser(value: unknown): value is User {
  return isRecord(value) && typeof value.id === 'string' && value.id.startsWith('user-') && value.id.length > 5
    && typeof value.name === 'string' && value.name.trim().length > 0 && value.name === value.name.trim()
    && typeof value.email === 'string' && isEmail(value.email) && value.email === normalizeEmail(value.email)
    && typeof value.passwordVerifier === 'string' && /^[a-f0-9]{64}$/.test(value.passwordVerifier)
    && typeof value.passwordSalt === 'string' && /^[a-f0-9]{32}$/.test(value.passwordSalt)
    && Object.keys(value).length === 5;
}
export function parseUsers(raw: string | null): User[] {
  if (raw === null) return [];
  const value: unknown = JSON.parse(raw);
  if (!Array.isArray(value) || !value.every(isUser)
    || new Set(value.map(user => user.id)).size !== value.length
    || new Set(value.map(user => user.email)).size !== value.length) {
    throw new Error('Los datos de cuentas no son válidos. No se modificaron los datos guardados.');
  }
  return value;
}
export function parseSession(raw: string | null, users: User[]): Session | null {
  if (raw === null) return null;
  const value: unknown = JSON.parse(raw);
  if (!isRecord(value) || typeof value.userId !== 'string' || Object.keys(value).length !== 1) {
    throw new Error('La sesión guardada no es válida. No se modificaron los datos guardados.');
  }
  return users.some(user => user.id === value.userId) ? { userId: value.userId } : null;
}
export function createAuthStorage(storage: KeyValueStorage) {
  return {
    readUsers: async () => parseUsers(await storage.getItem(AUTH_KEYS.users)),
    readSession: async (users: User[]) => parseSession(await storage.getItem(AUTH_KEYS.session), users),
    clearSession: async () => storage.removeItem(AUTH_KEYS.session),
    saveUsers: async (users: User[]) => storage.setItem(AUTH_KEYS.users, JSON.stringify(users)),
    saveSession: async (session: Session) => storage.setItem(AUTH_KEYS.session, JSON.stringify(session)),
  };
}
export type AuthStorage = ReturnType<typeof createAuthStorage>;
